#!/usr/bin/env tsx
/**
 * Fix missing screenshots - simple version (no interaction)
 */

import { chromium } from 'playwright';
import * as path from 'path';

const OUTPUT_DIR = './demo-output/screenshots';

async function main() {
  console.log('🔧 Fixing missing screenshots (simple mode)...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark',
    locale: 'en-US'
  });
  const page = await context.newPage();

  // 1. JSON Formatter - just take the page as-is
  console.log('📸 01-json-formatter...');
  await page.goto('https://thejord.it/en/tools/json-formatter', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-json-formatter.png') });
  console.log('   ✅ 01-json-formatter.png');

  // 2. Color Converter
  console.log('📸 09-color-converter...');
  await page.goto('https://thejord.it/en/tools/color-converter', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09-color-converter.png') });
  console.log('   ✅ 09-color-converter.png');

  // 3. QR Code
  console.log('📸 12-qr-code...');
  await page.goto('https://thejord.it/en/tools/qr-code', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12-qr-code.png') });
  console.log('   ✅ 12-qr-code.png');

  await browser.close();
  console.log('\n✨ Done!');

  // List all files
  const fs = await import('fs');
  console.log('\n📁 All screenshots:');
  const files = fs.readdirSync(OUTPUT_DIR).filter((f: string) => f.endsWith('.png')).sort();
  files.forEach((f: string) => console.log(`   - ${f}`));
}

main().catch(console.error);
