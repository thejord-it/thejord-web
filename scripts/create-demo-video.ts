/**
 * Product Hunt Demo Video Generator
 *
 * Creates a demo video with:
 * - Slideshow intro/transitions
 * - Live demo of tools (JSON, PDF, Base64)
 * - Google TTS voiceover
 *
 * Run: npx playwright test scripts/create-demo-video.ts --headed
 */

import { chromium, Browser, Page } from 'playwright'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

// Video config
const VIDEO_WIDTH = 1920
const VIDEO_HEIGHT = 1080
const SITE_URL = 'https://thejord.it'

// Voiceover script with timings (in seconds)
const VOICEOVER_SEGMENTS = [
  { text: "Meet THE JORD. 14 free developer tools that respect your privacy.", duration: 5 },
  { text: "Unlike other tools, your data never leaves your browser.", duration: 4 },
  { text: "Watch. I'll format this JSON. Instantly. No upload required.", duration: 5 },
  { text: "Need to merge PDFs? Drag, drop, done. All processed locally.", duration: 5 },
  { text: "Base64 encoding? One click. Fast and private.", duration: 4 },
  { text: "No sign up. No tracking. Just tools that work.", duration: 4 },
  { text: "Try it free at the jord dot it", duration: 3 },
]

// Generate TTS audio using Google TTS (via gtts-cli or edge-tts)
async function generateTTS(text: string, outputPath: string): Promise<void> {
  // Try edge-tts first (better quality)
  try {
    await execAsync(`edge-tts --voice en-US-GuyNeural --text "${text}" --write-media "${outputPath}"`)
    console.log(`Generated TTS: ${outputPath}`)
    return
  } catch {
    console.log('edge-tts not available, trying gtts...')
  }

  // Fallback to gtts
  try {
    await execAsync(`gtts-cli "${text}" -l en -o "${outputPath}"`)
    console.log(`Generated TTS (gtts): ${outputPath}`)
    return
  } catch {
    console.log('gtts not available, trying powershell...')
  }

  // Fallback to Windows SAPI
  const psScript = `
    Add-Type -AssemblyName System.Speech
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.SelectVoice('Microsoft David Desktop')
    $synth.SetOutputToWaveFile('${outputPath.replace(/\\/g, '\\\\')}')
    $synth.Speak('${text.replace(/'/g, "''")}')
    $synth.Dispose()
  `
  await execAsync(`powershell -Command "${psScript.replace(/\n/g, ' ')}"`)
  console.log(`Generated TTS (SAPI): ${outputPath}`)
}

// Main demo recording function
async function recordDemo() {
  const outputDir = path.join(process.cwd(), 'demo-output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log('=== THEJORD Product Hunt Demo Video Generator ===\n')

  // Step 1: Generate all TTS audio files
  console.log('Step 1: Generating voiceover audio...\n')
  for (let i = 0; i < VOICEOVER_SEGMENTS.length; i++) {
    const segment = VOICEOVER_SEGMENTS[i]
    const audioPath = path.join(outputDir, `voice_${i}.mp3`)
    if (!fs.existsSync(audioPath)) {
      await generateTTS(segment.text, audioPath)
    } else {
      console.log(`Skipping ${audioPath} (already exists)`)
    }
  }

  // Step 2: Launch browser and record
  console.log('\nStep 2: Recording demo video...\n')

  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
  })

  const context = await browser.newContext({
    viewport: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
    recordVideo: {
      dir: outputDir,
      size: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
    },
  })

  const page = await context.newPage()

  try {
    // Scene 1: Intro slideshow
    console.log('Scene 1: Intro slideshow')
    await page.goto(`${SITE_URL}/demo-slideshow.html`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(5000)

    // Scene 2: Navigate to tools
    console.log('Scene 2: Tools overview')
    await page.goto(`${SITE_URL}/en/tools`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(4000)

    // Scene 3: JSON Formatter demo
    console.log('Scene 3: JSON Formatter demo')
    await page.goto(`${SITE_URL}/en/tools/json-formatter`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Type JSON
    const jsonInput = page.locator('textarea').first()
    if (await jsonInput.isVisible()) {
      await jsonInput.click()
      await page.waitForTimeout(500)
      // Type sample JSON slowly for effect
      const sampleJson = '{"name":"THEJORD","tools":14,"privacy":"client-side","features":["format","validate","convert"]}'
      await jsonInput.fill('')
      await page.keyboard.type(sampleJson, { delay: 30 })
      await page.waitForTimeout(3000)
    }

    // Scene 4: PDF Tools demo
    console.log('Scene 4: PDF Tools demo')
    await page.goto(`${SITE_URL}/en/tools/pdf-merge`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(5000)

    // Scene 5: Base64 demo
    console.log('Scene 5: Base64 demo')
    await page.goto(`${SITE_URL}/en/tools/base64`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    const base64Input = page.locator('textarea').first()
    if (await base64Input.isVisible()) {
      await base64Input.click()
      await page.keyboard.type('Hello THEJORD - Privacy First!', { delay: 50 })
      await page.waitForTimeout(2000)
      // Click encode button if exists
      const encodeBtn = page.locator('button:has-text("Encode")').first()
      if (await encodeBtn.isVisible()) {
        await encodeBtn.click()
        await page.waitForTimeout(2000)
      }
    }

    // Scene 6: Final CTA - back to slideshow
    console.log('Scene 6: CTA slideshow')
    await page.goto(`${SITE_URL}/demo-slideshow.html`, { waitUntil: 'networkidle' })
    // Go to last slide (CTA)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(500)
    }
    await page.waitForTimeout(4000)

  } catch (error) {
    console.error('Error during recording:', error)
  }

  // Close and save video
  await page.close()
  await context.close()
  await browser.close()

  console.log('\n=== Recording complete! ===')
  console.log(`Video saved to: ${outputDir}`)
  console.log('\nNext steps:')
  console.log('1. Find the .webm video file in demo-output/')
  console.log('2. Use ffmpeg to combine video + audio:')
  console.log('   ffmpeg -i video.webm -i voice_combined.mp3 -c:v copy -c:a aac output.mp4')
}

// Run
recordDemo().catch(console.error)
