#!/usr/bin/env node
/**
 * Indexing Checker - Verifica lo stato di indicizzazione delle pagine
 *
 * Uso:
 *   node scripts/check-indexing.js                    # Check all sitemap URLs
 *   node scripts/check-indexing.js --url <url>       # Check single URL
 *   node scripts/check-indexing.js --submit-sitemap  # Submit sitemap to Google
 *
 * Richiede: API Search Console configurata
 */

const https = require('https');

const API_URL = process.env.API_URL || 'http://localhost:3000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

function log(msg, color = '') {
  console.log(`${color}${msg}${colors.reset}`);
}

// Fetch from API
async function fetchApi(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}${endpoint}`;
    const client = url.startsWith('https') ? https : require('http');

    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON: ${data.substring(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

// POST to API
async function postApi(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${endpoint}`);
    const client = url.protocol === 'https:' ? https : require('http');

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON: ${data.substring(0, 100)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

// Get sitemap URLs
async function fetchSitemapUrls() {
  return new Promise((resolve, reject) => {
    https.get('https://thejord.it/sitemap.xml', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const urls = [];
        const matches = data.matchAll(/<loc>([^<]+)<\/loc>/g);
        for (const match of matches) {
          urls.push(match[1]);
        }
        resolve(urls);
      });
    }).on('error', reject);
  });
}

async function checkSingleUrl(url) {
  log(`\nChecking: ${url}`, colors.cyan);

  const result = await fetchApi(`/api/search-console?action=inspect&url=${encodeURIComponent(url)}`);

  if (!result.success) {
    log(`  Error: ${result.error}`, colors.red);
    return;
  }

  const data = result.data;
  const isIndexed = data.indexingState === 'Submitted and indexed';

  log(`  Status: ${data.indexingState || 'Unknown'}`, isIndexed ? colors.green : colors.yellow);
  log(`  Verdict: ${data.verdict || 'Unknown'}`, colors.dim);
  log(`  Last crawl: ${data.lastCrawlTime || 'Never'}`, colors.dim);
  log(`  Mobile: ${data.mobileUsability || 'Unknown'}`, colors.dim);

  return { url, indexed: isIndexed, data };
}

async function checkAllUrls() {
  log('\n========================================', colors.bold);
  log('  THEJORD Indexing Checker', colors.bold);
  log(`  ${new Date().toISOString()}`, colors.bold);
  log('========================================\n', colors.bold);

  // Get sitemap URLs
  log('Fetching sitemap...', colors.cyan);
  const urls = await fetchSitemapUrls();
  log(`Found ${urls.length} URLs in sitemap\n`);

  // Batch check (via API to handle rate limiting)
  log('Checking indexing status (this may take a while)...', colors.yellow);

  const result = await postApi('/api/search-console', {
    action: 'batch-inspect',
    urls: urls,
  });

  if (!result.success) {
    log(`\nError: ${result.error}`, colors.red);
    return;
  }

  // Display results
  log('\n========================================', colors.bold);
  log('  RESULTS', colors.bold);
  log('========================================\n', colors.bold);

  log(`Total URLs: ${result.summary.total}`);
  log(`Indexed: ${result.summary.indexed}`, colors.green);
  log(`Not indexed: ${result.summary.notIndexed}`, colors.yellow);
  log(`Errors: ${result.summary.errors}`, result.summary.errors > 0 ? colors.red : colors.dim);

  // List non-indexed URLs
  const notIndexed = result.data.filter(r => !r.indexed && !r.error);
  if (notIndexed.length > 0) {
    log('\nNot indexed URLs:', colors.yellow);
    notIndexed.forEach(r => {
      log(`  - ${r.url}`, colors.yellow);
      log(`    Verdict: ${r.verdict}`, colors.dim);
    });
  }

  // List errors
  const errors = result.data.filter(r => r.error);
  if (errors.length > 0) {
    log('\nErrors:', colors.red);
    errors.forEach(r => {
      log(`  - ${r.url}: ${r.error}`, colors.red);
    });
  }

  // Summary
  const indexedPercent = Math.round((result.summary.indexed / result.summary.total) * 100);
  log(`\nIndexing rate: ${indexedPercent}%`, indexedPercent >= 80 ? colors.green : colors.yellow);
}

async function submitSitemap() {
  log('\nSubmitting sitemap to Google...', colors.cyan);

  const result = await fetchApi('/api/search-console?action=submit-sitemap');

  if (result.success) {
    log(`✓ ${result.message}`, colors.green);
  } else {
    log(`✗ Error: ${result.error}`, colors.red);
  }
}

async function showAnalytics() {
  log('\n========================================', colors.bold);
  log('  Search Performance (Last 28 days)', colors.bold);
  log('========================================\n', colors.bold);

  // Top queries
  log('Top Search Queries:', colors.cyan);
  const queries = await fetchApi('/api/search-console?action=analytics');

  if (queries.success && queries.data.length > 0) {
    console.log('\n  Query                              Clicks  Impr    CTR     Pos');
    console.log('  ' + '-'.repeat(70));
    queries.data.slice(0, 15).forEach(q => {
      const query = (q.query || '').padEnd(35).substring(0, 35);
      const clicks = String(q.clicks).padStart(6);
      const impressions = String(q.impressions).padStart(6);
      const ctr = `${q.ctr}%`.padStart(6);
      const position = String(q.position).padStart(6);
      console.log(`  ${query} ${clicks} ${impressions} ${ctr} ${position}`);
    });
  } else {
    log('  No data available', colors.dim);
  }

  // Top pages
  log('\n\nTop Pages:', colors.cyan);
  const pages = await fetchApi('/api/search-console?action=pages');

  if (pages.success && pages.data.length > 0) {
    console.log('\n  Page                                              Clicks  Impr    CTR');
    console.log('  ' + '-'.repeat(75));
    pages.data.slice(0, 15).forEach(p => {
      const page = (p.page || '').replace('https://thejord.it', '').padEnd(50).substring(0, 50);
      const clicks = String(p.clicks).padStart(6);
      const impressions = String(p.impressions).padStart(6);
      const ctr = `${p.ctr}%`.padStart(6);
      console.log(`  ${page} ${clicks} ${impressions} ${ctr}`);
    });
  } else {
    log('  No data available', colors.dim);
  }
}

async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes('--help') || args.includes('-h')) {
      log(`
Usage: node scripts/check-indexing.js [options]

Options:
  --url <url>         Check indexing status of a single URL
  --submit-sitemap    Submit sitemap to Google Search Console
  --analytics         Show search performance data
  (no options)        Check all sitemap URLs

Examples:
  node scripts/check-indexing.js
  node scripts/check-indexing.js --url https://thejord.it/en/tools/json-formatter
  node scripts/check-indexing.js --submit-sitemap
  node scripts/check-indexing.js --analytics
`);
      return;
    }

    if (args.includes('--url')) {
      const urlIndex = args.indexOf('--url');
      const url = args[urlIndex + 1];
      if (!url) {
        log('Error: --url requires a URL argument', colors.red);
        process.exit(1);
      }
      await checkSingleUrl(url);
    } else if (args.includes('--submit-sitemap')) {
      await submitSitemap();
    } else if (args.includes('--analytics')) {
      await showAnalytics();
    } else {
      await checkAllUrls();
    }

  } catch (error) {
    log(`\nError: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
