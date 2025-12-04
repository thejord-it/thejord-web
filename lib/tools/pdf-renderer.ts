// PDF Renderer utilities - Client-side only
// Uses dynamic import to avoid SSR issues with pdfjs-dist

export interface RenderOptions {
  scale?: number
  format?: 'png' | 'jpg'
  quality?: number // 0-1 for jpg
}

export interface PDFDocumentProxy {
  numPages: number
  getPage: (pageNumber: number) => Promise<any>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLib: any = null

/**
 * Initialize pdfjs library (client-side only)
 */
async function initPdfjs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF rendering is only available on the client side')
  }

  if (!pdfjsLib) {
    // Dynamic import to avoid SSR issues
    const pdfjs = await import('pdfjs-dist')
    pdfjsLib = pdfjs
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
  }

  return pdfjsLib
}

/**
 * Load a PDF document from ArrayBuffer
 */
export async function loadPdfDocument(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await initPdfjs()
  const loadingTask = pdfjs.getDocument({ data })
  return await loadingTask.promise as PDFDocumentProxy
}

/**
 * Render a single PDF page to a data URL
 */
export async function renderPageToDataUrl(
  pdfDoc: PDFDocumentProxy,
  pageNumber: number,
  options: RenderOptions = {}
): Promise<string> {
  const { scale = 1, format = 'png', quality = 0.92 } = options

  const page = await pdfDoc.getPage(pageNumber)
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not get canvas context')

  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({
    canvasContext: context,
    viewport,
  }).promise

  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
  return canvas.toDataURL(mimeType, quality)
}

/**
 * Render a PDF page to a Blob
 */
export async function renderPageToBlob(
  pdfDoc: PDFDocumentProxy,
  pageNumber: number,
  options: RenderOptions = {}
): Promise<Blob> {
  const { scale = 1.5, format = 'png', quality = 0.92 } = options

  const page = await pdfDoc.getPage(pageNumber)
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not get canvas context')

  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({
    canvasContext: context,
    viewport,
  }).promise

  return new Promise((resolve, reject) => {
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to create blob'))
      },
      mimeType,
      quality
    )
  })
}

/**
 * Generate thumbnail for a PDF page (smaller scale)
 */
export async function generateThumbnail(
  pdfDoc: PDFDocumentProxy,
  pageNumber: number,
  maxWidth: number = 150
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber)
  const originalViewport = page.getViewport({ scale: 1 })

  const scale = maxWidth / originalViewport.width
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not get canvas context')

  canvas.width = viewport.width
  canvas.height = viewport.height

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)

  await page.render({
    canvasContext: context,
    viewport,
  }).promise

  return canvas.toDataURL('image/png')
}
