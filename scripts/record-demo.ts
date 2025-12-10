/**
 * Product Hunt Demo Video Recorder - FINAL VERSION
 *
 * Synced with Brian voiceover v2 (~41 seconds)
 * NO Base64, PDF EDIT with page previews
 *
 * TIMING:
 * 0-3s:   "Meet THEJORD - free privacy-first developer tools."
 * 3-6s:   "This is our homepage. Let me show you how it works."
 * 6-10s:  "First, the developer tools. Here's the JSON Formatter."
 * 10-16s: "Watch - I paste some JSON and it formats instantly. No upload needed."
 * 16-20s: "Now for the star feature - PDF Tools."
 * 20-24s: "Here you can merge, split, edit and compress PDFs."
 * 24-29s: "Let me edit a file. See? Page previews appear instantly."
 * 29-35s: "Everything happens in your browser - your files never leave your device."
 * 35-41s: "No sign up. No tracking. No limits. Just tools that work. Try it free at thejord.it"
 *
 * Run: npx tsx scripts/record-demo.ts
 */

import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

const OUTPUT_DIR = path.join(process.cwd(), 'demo-output')
const VIDEO_WIDTH = 1920
const VIDEO_HEIGHT = 1080
const SITE_URL = 'https://thejord.it'
const PDF_TEST_FILE = path.join(process.cwd(), '__tests__', 'file-example_PDF_1MB.pdf')

async function recordDemo() {
  console.log('=== THEJORD Demo Video Recorder (FINAL - 41s) ===\n')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const browser = await chromium.launch({
    headless: false,
  })

  const context = await browser.newContext({
    viewport: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
    },
  })

  const page = await context.newPage()

  try {
    // ========== SCENE 1: Homepage (0-6s) ==========
    // "Meet THEJORD - free privacy-first developer tools."
    // "This is our homepage. Let me show you how it works."
    console.log('Scene 1: Homepage (0-6s)')
    await page.goto(`${SITE_URL}/en`, { waitUntil: 'networkidle' })

    // Accept cookies immediately
    const cookieBtn = page.locator('button:has-text("Accept")').first()
    if (await cookieBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await cookieBtn.click()
    }
    await page.waitForTimeout(3500)

    // ========== SCENE 2: Dev Tools + JSON Formatter (6-11s) ==========
    // "First, the developer tools. Here's the JSON Formatter."
    console.log('Scene 2: Navigate to JSON Formatter (6-11s)')
    await page.goto(`${SITE_URL}/en/tools`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    await page.goto(`${SITE_URL}/en/tools/json-formatter`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(3000) // Arrive at second ~11 when "Watch" is said

    // ========== SCENE 3: JSON Formatter Demo (11-15s) ==========
    // "Watch - I paste some JSON and it formats instantly. No upload needed."
    console.log('Scene 3: JSON Formatter Demo (11-15s) - PASTE + FORMAT')

    // Valid ugly JSON to paste
    const uglyJson = '{"name":"THEJORD","tools":14,"features":["JSON","PDF","Hash"],"free":true}'

    // Use JavaScript to set the Monaco editor content directly
    await page.evaluate((json) => {
      // Monaco stores the model, we can set its value directly
      const monaco = (window as unknown as { monaco?: { editor?: { getModels?: () => Array<{ setValue: (v: string) => void }> } } }).monaco
      if (monaco?.editor?.getModels) {
        const models = monaco.editor.getModels()
        if (models.length > 0) {
          models[0].setValue(json)
        }
      }
    }, uglyJson)

    await page.waitForTimeout(800)
    console.log('  - JSON pasted via Monaco API')

    // Click FORMAT button using JavaScript
    console.log('  - Clicking Format button...')
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      for (const btn of buttons) {
        const text = btn.textContent?.trim()
        if (text === '✨ Format') {
          (btn as HTMLButtonElement).click()
          break
        }
      }
    })

    console.log('  - Format clicked!')
    await page.waitForTimeout(2500) // Show formatted result until second ~15

    // ========== SCENE 4: PDF Tools Landing (16-24s) ==========
    // "Now for the star feature - PDF Tools."
    // "Here you can merge, split, edit and compress PDFs."
    console.log('Scene 4: PDF Tools Landing (16-24s)')
    await page.goto(`${SITE_URL}/en/pdf-tools`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(4000)

    // Click "Open PDF Tools" button
    const openToolBtn = page.locator('a:has-text("Open PDF Tools"), a:has-text("Apri PDF Tools")').first()
    if (await openToolBtn.isVisible()) {
      await openToolBtn.click()
      await page.waitForTimeout(2000)
    } else {
      await page.goto(`${SITE_URL}/en/tools/pdf-tools`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(2000)
    }

    // ========== SCENE 5: Click Edit Tab + Upload PDF (24-35s) ==========
    // "Let me edit a file. See? Page previews appear instantly."
    // "Everything happens in your browser - your files never leave your device."
    console.log('Scene 5: PDF Edit Demo (24-35s)')

    // Click on "Edit" tab
    const editTab = page.locator('button:has-text("Edit")').first()
    if (await editTab.isVisible()) {
      console.log('  - Clicking Edit tab')
      await editTab.click()
      await page.waitForTimeout(1500)
    }

    // Upload PDF in Edit tab
    const fileInput = page.locator('input[type="file"]').first()
    if (await fileInput.count() > 0) {
      console.log('  - Uploading test PDF')
      await fileInput.setInputFiles(PDF_TEST_FILE)
      await page.waitForTimeout(8000) // Wait for PDF to load and show page previews
    } else {
      await page.waitForTimeout(8000)
    }

    // ========== SCENE 6: Final CTA (35-45s) ==========
    // "No sign up. No tracking. No limits. Just tools that work. Try it free at thejord.it"
    console.log('Scene 6: Final CTA (35-45s)')
    await page.goto(`${SITE_URL}/demo-slideshow.html`, { waitUntil: 'networkidle' })
    await page.addStyleTag({
      content: '.controls { display: none !important; } .progress-container { display: none !important; }'
    })

    // Show CTA slide with URL
    await page.evaluate(() => {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'))
      document.getElementById('slide7')?.classList.add('active')
    })

    // Hold for 10 seconds (audio ends at ~41s, extra time for fade out)
    await page.waitForTimeout(10000)

    console.log('\nRecording complete!')

  } catch (error) {
    console.error('Error during recording:', error)
  }

  await page.close()
  await context.close()
  await browser.close()

  console.log('\n=== Done! ===')
  console.log(`Video saved to: ${OUTPUT_DIR}`)
}

recordDemo().catch(console.error)
