#!/usr/bin/env tsx
/**
 * Generate screenshots for Product Hunt thread
 *
 * Usage: npx tsx scripts/generate-screenshots.ts
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://thejord.it/en/tools';
const OUTPUT_DIR = './demo-output/screenshots';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface ToolScreenshot {
  name: string;
  slug: string;
  setup: (page: any) => Promise<void>;
  waitFor?: string;
}

const tools: ToolScreenshot[] = [
  {
    name: '01-json-formatter',
    slug: 'json-formatter',
    setup: async (page) => {
      // Wait for the page to load
      await page.waitForSelector('textarea');

      // Input JSON
      const jsonInput = `{
  "users": [
    {"id": 1, "name": "John Doe", "email": "john@example.com"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
  ],
  "total": 2,
  "page": 1
}`;
      await page.fill('textarea', jsonInput);

      // Click format button
      await page.click('button:has-text("Format")');
      await page.waitForTimeout(500);
    }
  },
  {
    name: '02-pdf-tools',
    slug: 'pdf-tools',
    setup: async (page) => {
      // Click on Compress tab
      await page.waitForSelector('button:has-text("Compress")');
      await page.click('button:has-text("Compress")');
      await page.waitForTimeout(300);
    }
  },
  {
    name: '03-regex-tester',
    slug: 'regex-tester',
    setup: async (page) => {
      await page.waitForSelector('input[placeholder*="regex"], input[type="text"]');

      // Find pattern input and test string
      const inputs = await page.locator('input[type="text"], textarea').all();
      if (inputs.length >= 1) {
        await inputs[0].fill('(\\w+)@(\\w+)\\.(\\w+)');
      }

      // Find textarea for test string
      const textareas = await page.locator('textarea').all();
      if (textareas.length >= 1) {
        await textareas[0].fill('Contact us at hello@thejord.it or support@thejord.it for help');
      }

      await page.waitForTimeout(500);
    }
  },
  {
    name: '04-diff-checker',
    slug: 'diff-checker',
    setup: async (page) => {
      await page.waitForSelector('textarea');
      const textareas = await page.locator('textarea').all();

      if (textareas.length >= 2) {
        await textareas[0].fill(`function greet(name) {
  console.log("Hello, " + name);
  return true;
}`);
        await textareas[1].fill(`function greet(userName) {
  console.log("Hello, " + userName + "!");
  return userName !== null;
}`);
      }

      // Click compare if there's a button
      const compareBtn = page.locator('button:has-text("Compare"), button:has-text("Diff")');
      if (await compareBtn.count() > 0) {
        await compareBtn.first().click();
      }

      await page.waitForTimeout(500);
    }
  },
  {
    name: '05-base64',
    slug: 'base64',
    setup: async (page) => {
      await page.waitForSelector('textarea');
      const textarea = page.locator('textarea').first();
      await textarea.fill('Hello World! This is THEJORD - Privacy-first developer tools.');

      // Click encode
      const encodeBtn = page.locator('button:has-text("Encode")');
      if (await encodeBtn.count() > 0) {
        await encodeBtn.first().click();
      }

      await page.waitForTimeout(500);
    }
  },
  {
    name: '06-hash-generator',
    slug: 'hash-generator',
    setup: async (page) => {
      await page.waitForSelector('textarea, input[type="text"]');

      // Find input
      const input = page.locator('textarea, input[type="text"]').first();
      await input.fill('THEJORD - Privacy-first developer tools');

      await page.waitForTimeout(800);
    }
  },
  {
    name: '07-url-encoder',
    slug: 'url-encoder',
    setup: async (page) => {
      await page.waitForSelector('textarea');
      const textarea = page.locator('textarea').first();
      await textarea.fill('Hello World! Special chars: é à ü ñ & param=value?query=test');

      await page.waitForTimeout(500);
    }
  },
  {
    name: '08-cron-builder',
    slug: 'cron-builder',
    setup: async (page) => {
      await page.waitForTimeout(1000);
      // The cron builder should show default state which is good enough
    }
  },
  {
    name: '09-color-converter',
    slug: 'color-converter',
    setup: async (page) => {
      await page.waitForSelector('input');

      // Try to find hex input and set a nice blue color
      const hexInput = page.locator('input[placeholder*="HEX"], input[value*="#"]').first();
      if (await hexInput.count() > 0) {
        await hexInput.fill('#3B82F6');
        await hexInput.press('Enter');
      }

      await page.waitForTimeout(500);
    }
  },
  {
    name: '10-markdown-converter',
    slug: 'markdown-converter',
    setup: async (page) => {
      await page.waitForSelector('textarea');

      const markdown = `# Welcome to THEJORD

## Privacy-First Tools

Here's what we offer:

- **JSON Formatter** - Format & validate JSON
- **PDF Tools** - Merge, split, compress
- **Regex Tester** - Live pattern matching

\`\`\`javascript
// All processing happens locally
const data = processLocally(input);
\`\`\`

> Your data never leaves your browser.`;

      await page.locator('textarea').first().fill(markdown);
      await page.waitForTimeout(500);
    }
  },
  {
    name: '11-lorem-ipsum',
    slug: 'lorem-ipsum',
    setup: async (page) => {
      await page.waitForTimeout(500);
      // Click generate if available
      const generateBtn = page.locator('button:has-text("Generate")');
      if (await generateBtn.count() > 0) {
        await generateBtn.first().click();
      }
      await page.waitForTimeout(500);
    }
  },
  {
    name: '12-qr-code',
    slug: 'qr-code',
    setup: async (page) => {
      await page.waitForSelector('textarea, input[type="text"]');
      const input = page.locator('textarea, input[type="text"]').first();
      await input.fill('https://thejord.it');
      await page.waitForTimeout(800);
    }
  },
  {
    name: '13-uuid-generator',
    slug: 'uuid-generator',
    setup: async (page) => {
      await page.waitForTimeout(500);
      // Click generate if available
      const generateBtn = page.locator('button:has-text("Generate")');
      if (await generateBtn.count() > 0) {
        await generateBtn.first().click();
      }
      await page.waitForTimeout(500);
    }
  }
];

async function main() {
  console.log('🚀 Starting screenshot generation...\n');

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark',
    locale: 'en-US'
  });

  const page = await context.newPage();

  // First, take homepage screenshot
  console.log('📸 Taking homepage screenshot...');
  await page.goto('https://thejord.it/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '00-homepage.png'),
    fullPage: false
  });
  console.log('   ✅ 00-homepage.png\n');

  // Take tools listing page
  console.log('📸 Taking tools listing screenshot...');
  await page.goto('https://thejord.it/en/tools', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '00-tools-listing.png'),
    fullPage: false
  });
  console.log('   ✅ 00-tools-listing.png\n');

  // Take individual tool screenshots
  for (const tool of tools) {
    console.log(`📸 Taking screenshot: ${tool.name}...`);

    try {
      await page.goto(`${BASE_URL}/${tool.slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Run tool-specific setup
      await tool.setup(page);

      // Take screenshot
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${tool.name}.png`),
        fullPage: false
      });

      console.log(`   ✅ ${tool.name}.png`);
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
  }

  await browser.close();

  console.log('\n✨ Done! Screenshots saved to:', OUTPUT_DIR);
  console.log('\nFiles generated:');
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
  files.forEach(f => console.log(`   - ${f}`));
}

main().catch(console.error);
