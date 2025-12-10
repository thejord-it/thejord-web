#!/usr/bin/env node
/**
 * Sitemap Checker - Verifica tutti gli URL della sitemap
 *
 * Uso: node scripts/check-sitemap.js
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

async function checkUrlsInBatches(urls) {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(fetchUrl));
    results.push(...batchResults);
    process.stdout.write(`\rChecking: ${results.length}/${urls.length}`);
  }
  console.log('');
  return results;
}

async function main() {
  log('\n========================================', colors.bold);
  log(`  THEJORD Sitemap Checker`, colors.bold);
  log(`  ${new Date().toISOString()}`, colors.bold);
  log('========================================\n', colors.bold);

  try {
    log('Fetching sitemap...', colors.yellow);
    const sitemapUrls = await fetchSitemapUrls();
    log(`Found ${sitemapUrls.length} URLs in sitemap\n`);

    const results = await checkUrlsInBatches(sitemapUrls);
    const broken = results.filter(r => !r.ok);
    const ok = results.filter(r => r.ok);

    log('\n========================================', colors.bold);
    log('  RESULTS', colors.bold);
    log('========================================\n', colors.bold);

    log(`Sitemap URLs checked: ${results.length}`);
    log(`  OK: ${ok.length}`, colors.green);

    if (broken.length > 0) {
      log(`  BROKEN: ${broken.length}`, colors.red);
      log('\nBroken URLs:', colors.red);
      broken.forEach(r => {
        log(`  [${r.status}] ${r.url}`, colors.red);
        if (r.error) log(`    Error: ${r.error}`, colors.red);
      });
      log('\n❌ Some sitemap links are broken!', colors.red);
      process.exit(1);
    } else {
      log('\n✅ All sitemap links are OK!', colors.green);
      process.exit(0);
    }

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
