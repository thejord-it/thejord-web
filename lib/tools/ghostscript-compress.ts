/**
 * Ghostscript WASM PDF Compression
 *
 * Uses Ghostscript compiled to WASM for real PDF compression.
 * Preserves text and vector graphics, only recompresses images.
 */

// Ghostscript instance (lazy loaded)
let gsInstance: GhostscriptModule | null = null
let gsLoadPromise: Promise<GhostscriptModule | null> | null = null

// Type definitions for Ghostscript WASM
interface GhostscriptFS {
  writeFile: (path: string, data: Uint8Array) => void
  readFile: (path: string) => Uint8Array
  unlink: (path: string) => void
}

interface GhostscriptModule {
  FS: GhostscriptFS
  callMain: (args: string[]) => number
}

// Compression quality settings matching Ghostscript's -dPDFSETTINGS
export type CompressionQuality = 'screen' | 'ebook' | 'printer' | 'prepress'

export interface CompressionOptions {
  quality: CompressionQuality
  onProgress?: (progress: number) => void
}

// Quality descriptions for UI
export const QUALITY_SETTINGS = {
  screen: {
    label: 'Screen (72 dpi)',
    description: 'Smallest file size, suitable for screen viewing',
    dpi: 72,
  },
  ebook: {
    label: 'eBook (150 dpi)',
    description: 'Good balance of size and quality',
    dpi: 150,
  },
  printer: {
    label: 'Printer (300 dpi)',
    description: 'High quality for printing',
    dpi: 300,
  },
  prepress: {
    label: 'Prepress (300+ dpi)',
    description: 'Maximum quality, preserves all details',
    dpi: 300,
  },
} as const

// CDN URL for Ghostscript WASM
const GS_CDN_BASE = 'https://cdn.jsdelivr.net/npm/@jspawn/ghostscript-wasm@0.0.2'

/**
 * Initialize Ghostscript WASM (lazy load from CDN)
 */
async function initGhostscript(): Promise<GhostscriptModule> {
  if (gsInstance) return gsInstance

  if (gsLoadPromise) {
    const result = await gsLoadPromise
    if (result) return result
  }

  gsLoadPromise = (async () => {
    // Load the ES module from CDN using dynamic import with URL
    const module = await import(/* webpackIgnore: true */ `${GS_CDN_BASE}/gs.mjs`)
    const initGs = module.default as (options: { locateFile: (file: string) => string }) => Promise<GhostscriptModule>

    gsInstance = await initGs({
      locateFile: (file: string) => `${GS_CDN_BASE}/${file}`
    })

    return gsInstance
  })()

  const result = await gsLoadPromise
  if (!result) throw new Error('Failed to initialize Ghostscript')
  return result
}

/**
 * Compress a PDF using Ghostscript WASM
 *
 * @param pdfData - The PDF file as ArrayBuffer or Uint8Array
 * @param options - Compression options
 * @returns Compressed PDF as Uint8Array
 */
export async function compressPdfWithGhostscript(
  pdfData: ArrayBuffer | Uint8Array,
  options: CompressionOptions
): Promise<Uint8Array> {
  const { quality, onProgress } = options

  // Report initial progress
  onProgress?.(10)

  // Initialize Ghostscript
  const gs = await initGhostscript()
  onProgress?.(30)

  // Convert input to Uint8Array if needed
  const inputData = pdfData instanceof ArrayBuffer
    ? new Uint8Array(pdfData)
    : pdfData

  // Write input file to virtual filesystem
  const inputPath = '/input.pdf'
  const outputPath = '/output.pdf'

  gs.FS.writeFile(inputPath, inputData)
  onProgress?.(40)

  // Build Ghostscript command
  // -dPDFSETTINGS options:
  // /screen   - 72 dpi, lowest quality
  // /ebook    - 150 dpi, medium quality
  // /printer  - 300 dpi, high quality
  // /prepress - 300 dpi, maximum quality
  const args = [
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.4',
    `-dPDFSETTINGS=/${quality}`,
    '-dNOPAUSE',
    '-dQUIET',
    '-dBATCH',
    '-dDetectDuplicateImages=true',
    '-dCompressFonts=true',
    '-dSubsetFonts=true',
    `-sOutputFile=${outputPath}`,
    inputPath,
  ]

  // Run Ghostscript
  onProgress?.(50)
  const result = gs.callMain(args)

  if (result !== 0) {
    // Cleanup
    try { gs.FS.unlink(inputPath) } catch { /* ignore */ }
    throw new Error(`Ghostscript compression failed with code ${result}`)
  }

  onProgress?.(80)

  // Read output file
  const outputData = gs.FS.readFile(outputPath)

  // Cleanup virtual filesystem
  try { gs.FS.unlink(inputPath) } catch { /* ignore */ }
  try { gs.FS.unlink(outputPath) } catch { /* ignore */ }

  onProgress?.(100)

  return outputData
}

/**
 * Check if Ghostscript WASM is available/supported
 */
export function isGhostscriptSupported(): boolean {
  // Check for WebAssembly support
  if (typeof WebAssembly === 'undefined') return false

  // Check for dynamic import support (needed for CDN loading)
  try {
    new Function('import("")')
    return true
  } catch {
    return false
  }
}
