#!/usr/bin/env node
/**
 * Link Checker - Verifica tutti i link della sitemap e dei blog post
 *
 * Uso: node scripts/check-links.js
 *
 * Questo script può essere eseguito come GitHub Action schedulata
 * per monitorare lo stato dei link del sito.
 */

const https = require('https');
const http = require('http');

const SITE_URL = process.env.SITE_URL || 'https://thejord.it';
const CONCURRENCY = 10; // Richieste parallele
const TIMEOUT = 10000; // 10 secondi

// Colori per output
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

// Fetch URL con timeout
function fetchUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: TIMEOUT }, (res) => {
      // Segui redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        fetchUrl(redirectUrl).then(resolve);
        return;
      }
      resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
    });

    req.on('error', (e) => {
      resolve({ url, status: 'ERROR', error: e.message, ok: false });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT', ok: false });
    });
  });
}

// Fetch pagina e restituisci HTML
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: TIMEOUT }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Estrai tutti gli URL dalla sitemap
async function fetchSitemapUrls() {
  return new Promise((resolve, reject) => {
    https.get(`${SITE_URL}/sitemap.xml`, (res) => {
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

// Estrai link interni da HTML
function extractInternalLinks(html, baseUrl) {
  const links = new Set();
  // Match href attributes
  const hrefMatches = html.matchAll(/href="([^"]+)"/g);
  for (const match of hrefMatches) {
    let href = match[1];
    // Skip external links, anchors, assets, and special paths
    if (href.startsWith('http') && !href.includes('thejord.it')) continue;
    if (href.startsWith('#')) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (href.startsWith('/_next/')) continue;
    if (href.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i)) continue;
    if (href.startsWith('/api/')) continue;
    if (href.startsWith('/cdn-cgi/')) continue;

    // Convert to absolute URL
    if (href.startsWith('/')) {
      links.add(SITE_URL + href);
    } else if (href.includes('thejord.it')) {
      links.add(href);
    }
  }
  return [...links];
}

// Verifica URL in batch
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
  log(`  THEJORD Link Checker`, colors.bold);
  log(`  ${new Date().toISOString()}`, colors.bold);
  log('========================================\n', colors.bold);

  let totalBroken = [];

  try {
    // 1. Fetch sitemap URLs
    log('1. Checking sitemap URLs...', colors.cyan);
    const sitemapUrls = await fetchSitemapUrls();
    log(`   Found ${sitemapUrls.length} URLs in sitemap`);

    const sitemapResults = await checkUrlsInBatches(sitemapUrls, '   ');
    const brokenSitemap = sitemapResults.filter(r => !r.ok);

    if (brokenSitemap.length > 0) {
      log(`   BROKEN: ${brokenSitemap.length}`, colors.red);
      brokenSitemap.forEach(r => log(`     [${r.status}] ${r.url}`, colors.red));
      totalBroken.push(...brokenSitemap.map(r => ({ ...r, source: 'sitemap' })));
    } else {
      log(`   All ${sitemapUrls.length} sitemap URLs OK`, colors.green);
    }

    // 2. Get blog post URLs from sitemap
    const blogUrls = sitemapUrls.filter(url => url.includes('/blog/') && !url.endsWith('/blog'));
    log(`\n2. Checking links inside ${blogUrls.length} blog posts...`, colors.cyan);

    const allBlogLinks = new Set();
    let checkedPosts = 0;

    for (const blogUrl of blogUrls) {
      try {
        const html = await fetchPage(blogUrl);
        const links = extractInternalLinks(html, blogUrl);
        links.forEach(link => allBlogLinks.add(link));
        checkedPosts++;
        process.stdout.write(`\r   Scanning posts: ${checkedPosts}/${blogUrls.length}`);
      } catch (e) {
        // Skip failed fetches
      }
    }
    console.log('');

    // Remove already checked URLs
    const sitemapSet = new Set(sitemapUrls);
    const newLinks = [...allBlogLinks].filter(link => !sitemapSet.has(link));

    log(`   Found ${allBlogLinks.size} internal links (${newLinks.length} not in sitemap)`);

    if (newLinks.length > 0) {
      const blogLinkResults = await checkUrlsInBatches(newLinks, '   ');
      const brokenBlogLinks = blogLinkResults.filter(r => !r.ok);

      if (brokenBlogLinks.length > 0) {
        log(`   BROKEN: ${brokenBlogLinks.length}`, colors.red);
        brokenBlogLinks.forEach(r => log(`     [${r.status}] ${r.url}`, colors.red));
        totalBroken.push(...brokenBlogLinks.map(r => ({ ...r, source: 'blog-content' })));
      } else {
        log(`   All ${newLinks.length} blog content links OK`, colors.green);
      }
    }

    // 3. Check tool pages
    const toolUrls = sitemapUrls.filter(url => url.includes('/tools/') && !url.endsWith('/tools'));
    log(`\n3. Checking links inside ${toolUrls.length} tool pages...`, colors.cyan);

    const allToolLinks = new Set();
    let checkedTools = 0;

    for (const toolUrl of toolUrls) {
      try {
        const html = await fetchPage(toolUrl);
        const links = extractInternalLinks(html, toolUrl);
        links.forEach(link => allToolLinks.add(link));
        checkedTools++;
        process.stdout.write(`\r   Scanning tools: ${checkedTools}/${toolUrls.length}`);
      } catch (e) {
        // Skip failed fetches
      }
    }
    console.log('');

    const newToolLinks = [...allToolLinks].filter(link => !sitemapSet.has(link) && !allBlogLinks.has(link));
    log(`   Found ${allToolLinks.size} internal links (${newToolLinks.length} new)`);

    if (newToolLinks.length > 0) {
      const toolLinkResults = await checkUrlsInBatches(newToolLinks, '   ');
      const brokenToolLinks = toolLinkResults.filter(r => !r.ok);

      if (brokenToolLinks.length > 0) {
        log(`   BROKEN: ${brokenToolLinks.length}`, colors.red);
        brokenToolLinks.forEach(r => log(`     [${r.status}] ${r.url}`, colors.red));
        totalBroken.push(...brokenToolLinks.map(r => ({ ...r, source: 'tool-page' })));
      } else {
        log(`   All ${newToolLinks.length} tool page links OK`, colors.green);
      }
    }

    // 4. Final Report
    log('\n========================================', colors.bold);
    log('  FINAL RESULTS', colors.bold);
    log('========================================\n', colors.bold);

    const totalChecked = sitemapUrls.length + newLinks.length + newToolLinks.length;
    log(`Total URLs checked: ${totalChecked}`);

    if (totalBroken.length > 0) {
      log(`\nBROKEN LINKS: ${totalBroken.length}`, colors.red);
      totalBroken.forEach(r => {
        log(`  [${r.status}] ${r.url}`, colors.red);
        log(`    Source: ${r.source}`, colors.yellow);
      });
      log('\n❌ Some links are broken!', colors.red);
      process.exit(1);
    } else {
      log(`\n✅ All ${totalChecked} links are OK!`, colors.green);
      process.exit(0);
    }

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
