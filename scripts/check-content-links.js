#!/usr/bin/env node
/**
 * Content Link Checker - Verifica i link interni nei blog post e tool pages
 *
 * Uso: node scripts/check-content-links.js
 */

const https = require('https');
const http = require('http');

const SITE_URL = process.env.SITE_URL || 'https://thejord.it';
const CONCURRENCY = 10;
const TIMEOUT = 10000;

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(msg, color = '') {
  console.log(`${color}${msg}${colors.reset}`);
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: TIMEOUT }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        fetchUrl(redirectUrl).then(resolve);
        return;
      }
      resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
    });

    req.on('error', (e) => resolve({ url, status: 'ERROR', error: e.message, ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }); });
  });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: TIMEOUT }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function fetchSitemapUrls() {
  return new Promise((resolve, reject) => {
    https.get(`${SITE_URL}/sitemap.xml`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const urls = [];
        const matches = data.matchAll(/<loc>([^<]+)<\/loc>/g);
        for (const match of matches) urls.push(match[1]);
        resolve(urls);
      });
    }).on('error', reject);
  });
}

function extractInternalLinks(html) {
  const links = new Set();
  const hrefMatches = html.matchAll(/href="([^"]+)"/g);
  for (const match of hrefMatches) {
    let href = match[1];
    // Skip non-page links
    if (href.startsWith('http') && !href.includes('thejord.it')) continue;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (href.startsWith('/_next/') || href.startsWith('/api/') || href.startsWith('/cdn-cgi/')) continue;
    if (href.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|xml|json|webmanifest)$/i)) continue;

    if (href.startsWith('/')) {
      links.add(SITE_URL + href);
    } else if (href.includes('thejord.it')) {
      links.add(href);
    }
  }
  return [...links];
}

async function checkUrlsInBatches(urls, label = '') {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(fetchUrl));
    results.push(...batchResults);
    process.stdout.write(`\r${label}Checking: ${results.length}/${urls.length}`);
  }
  console.log('');
  return results;
}

async function main() {
  log('\n========================================', colors.bold);
  log(`  THEJORD Content Link Checker`, colors.bold);
  log(`  ${new Date().toISOString()}`, colors.bold);
  log('========================================\n', colors.bold);

  let totalBroken = [];

  try {
    // Get sitemap URLs as baseline
    log('Fetching sitemap...', colors.yellow);
    const sitemapUrls = await fetchSitemapUrls();
    const sitemapSet = new Set(sitemapUrls);
    log(`Found ${sitemapUrls.length} URLs in sitemap\n`);

    // 1. Check blog posts
    const blogUrls = sitemapUrls.filter(url => url.includes('/blog/') && !url.endsWith('/blog'));
    log(`1. Scanning ${blogUrls.length} blog posts...`, colors.cyan);

    const blogLinks = new Map(); // link -> [source pages]
    let checkedPosts = 0;

    for (const blogUrl of blogUrls) {
      try {
        const html = await fetchPage(blogUrl);
        const links = extractInternalLinks(html);
        links.forEach(link => {
          if (!blogLinks.has(link)) blogLinks.set(link, []);
          blogLinks.get(link).push(blogUrl);
        });
        checkedPosts++;
        process.stdout.write(`\r   Scanning: ${checkedPosts}/${blogUrls.length}`);
      } catch (e) { /* skip */ }
    }
    console.log('');

    const newBlogLinks = [...blogLinks.keys()].filter(link => !sitemapSet.has(link));
    log(`   Found ${blogLinks.size} internal links (${newBlogLinks.length} not in sitemap)`);

    if (newBlogLinks.length > 0) {
      const results = await checkUrlsInBatches(newBlogLinks, '   ');
      const broken = results.filter(r => !r.ok);

      if (broken.length > 0) {
        log(`   BROKEN: ${broken.length}`, colors.red);
        broken.forEach(r => {
          log(`     [${r.status}] ${r.url}`, colors.red);
          log(`       Found in: ${blogLinks.get(r.url).join(', ')}`, colors.yellow);
          totalBroken.push({ ...r, sources: blogLinks.get(r.url), type: 'blog' });
        });
      } else {
        log(`   All ${newBlogLinks.length} blog content links OK`, colors.green);
      }
    }

    // 2. Check tool pages
    const toolUrls = sitemapUrls.filter(url => url.includes('/tools/') && !url.endsWith('/tools'));
    log(`\n2. Scanning ${toolUrls.length} tool pages...`, colors.cyan);

    const toolLinks = new Map();
    let checkedTools = 0;

    for (const toolUrl of toolUrls) {
      try {
        const html = await fetchPage(toolUrl);
        const links = extractInternalLinks(html);
        links.forEach(link => {
          if (!toolLinks.has(link)) toolLinks.set(link, []);
          toolLinks.get(link).push(toolUrl);
        });
        checkedTools++;
        process.stdout.write(`\r   Scanning: ${checkedTools}/${toolUrls.length}`);
      } catch (e) { /* skip */ }
    }
    console.log('');

    const newToolLinks = [...toolLinks.keys()].filter(link => !sitemapSet.has(link) && !blogLinks.has(link));
    log(`   Found ${toolLinks.size} internal links (${newToolLinks.length} new)`);

    if (newToolLinks.length > 0) {
      const results = await checkUrlsInBatches(newToolLinks, '   ');
      const broken = results.filter(r => !r.ok);

      if (broken.length > 0) {
        log(`   BROKEN: ${broken.length}`, colors.red);
        broken.forEach(r => {
          log(`     [${r.status}] ${r.url}`, colors.red);
          log(`       Found in: ${toolLinks.get(r.url).join(', ')}`, colors.yellow);
          totalBroken.push({ ...r, sources: toolLinks.get(r.url), type: 'tool' });
        });
      } else {
        log(`   All ${newToolLinks.length} tool page links OK`, colors.green);
      }
    }

    // Final Report
    log('\n========================================', colors.bold);
    log('  RESULTS', colors.bold);
    log('========================================\n', colors.bold);

    const totalChecked = newBlogLinks.length + newToolLinks.length;
    log(`Total content links checked: ${totalChecked}`);

    if (totalBroken.length > 0) {
      log(`\nBROKEN LINKS: ${totalBroken.length}`, colors.red);
      totalBroken.forEach(r => {
        log(`  [${r.status}] ${r.url}`, colors.red);
        log(`    Type: ${r.type}`, colors.yellow);
        log(`    Sources: ${r.sources.join(', ')}`, colors.yellow);
      });
      log('\n❌ Some content links are broken!', colors.red);
      process.exit(1);
    } else {
      log(`\n✅ All ${totalChecked} content links are OK!`, colors.green);
      process.exit(0);
    }

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
