'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// Dynamic import for pdfjs
const getPdfRenderer = () => import('@/lib/tools/pdf-renderer')

type EditTool = 'select' | 'text' | 'draw' | 'form'

interface TextAnnotation {
  id: string
  pageNum: number
  x: number
  y: number
  text: string
  fontSize: number
  color: string
  fontFamily: string
  isBold: boolean
  isItalic: boolean
}

interface DrawPath {
  id: string
  pageNum: number
  points: { x: number; y: number }[]
  color: string
  lineWidth: number
}

interface FormField {
  name: string
  type: 'text' | 'checkbox' | 'dropdown' | 'radio'
  pageNum: number
  rect: { x: number; y: number; width: number; height: number }
  value: string | boolean
  options?: string[]
}

interface PdfEditorProps {
  file: File
  onSave: (blob: Blob, filename: string) => void
  onClose: () => void
}

export default function PdfEditor({ file, onSave, onClose }: PdfEditorProps) {
  const t = useTranslations('toolPages.pdfTools')

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageImage, setPageImage] = useState<string>('')
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)

  // Tool state
  const [activeTool, setActiveTool] = useState<EditTool>('select')
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([])
  const [drawPaths, setDrawPaths] = useState<DrawPath[]>([])
  const [formFields, setFormFields] = useState<FormField[]>([])

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
  const [drawColor, setDrawColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)

  // Text state
  const [textColor, setTextColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState('Helvetica')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)

  // Undo/Redo history
  interface HistoryState {
    textAnnotations: TextAnnotation[]
    drawPaths: DrawPath[]
    formFields: FormField[]
  }
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isUndoRedoAction = useRef(false)

  // Available fonts (mapped to PDF standard fonts + Google Fonts)
  const standardFonts = [
    { name: 'Helvetica', css: 'Helvetica, Arial, sans-serif', isGoogle: false },
    { name: 'Times-Roman', css: 'Times New Roman, Times, serif', isGoogle: false },
    { name: 'Courier', css: 'Courier New, Courier, monospace', isGoogle: false },
  ]

  const googleFonts = [
    { name: 'Arimo (Arial)', css: 'Arimo, sans-serif', isGoogle: true, urlName: 'Arimo' },
    { name: 'Roboto', css: 'Roboto, sans-serif', isGoogle: true },
    { name: 'Open Sans', css: 'Open Sans, sans-serif', isGoogle: true },
    { name: 'Lato', css: 'Lato, sans-serif', isGoogle: true },
    { name: 'Montserrat', css: 'Montserrat, sans-serif', isGoogle: true },
    { name: 'Poppins', css: 'Poppins, sans-serif', isGoogle: true },
    { name: 'Oswald', css: 'Oswald, sans-serif', isGoogle: true },
    { name: 'Raleway', css: 'Raleway, sans-serif', isGoogle: true },
    { name: 'Playfair Display', css: 'Playfair Display, serif', isGoogle: true },
  ]

  const availableFonts = [...standardFonts, ...googleFonts]

  // Cache for loaded Google Font data
  const googleFontCache = useRef<Record<string, ArrayBuffer>>({})

  // Load Google Font CSS for preview
  useEffect(() => {
    // Use urlName if available, otherwise use name (for fonts with special characters like parentheses)
    const families = googleFonts.map(f => (f.urlName || f.name).replace(/ /g, '+')).join('&family=')
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${families}:ital,wght@0,400;0,700;1,400&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfDocRef = useRef<any>(null)
  const pdfLibDocRef = useRef<PDFDocument | null>(null)

  // Load PDF and render first page
  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true)
      try {
        const { loadPdfDocument, renderPageToDataUrl } = await getPdfRenderer()
        const arrayBuffer = await file.arrayBuffer()

        // Load with pdfjs for rendering
        const pdfDoc = await loadPdfDocument(arrayBuffer.slice(0))
        pdfDocRef.current = pdfDoc
        setTotalPages(pdfDoc.numPages)

        // Load with pdf-lib for editing
        const pdfLibDoc = await PDFDocument.load(arrayBuffer.slice(0))
        pdfLibDocRef.current = pdfLibDoc

        // Detect form fields
        await detectFormFields(pdfLibDoc)

        // Render first page
        await renderPage(1, pdfDoc)
      } catch (error) {
        console.error('Error loading PDF:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPdf()
  }, [file])

  // Detect form fields in PDF
  const detectFormFields = async (pdfDoc: PDFDocument) => {
    try {
      const form = pdfDoc.getForm()
      const fields = form.getFields()
      const detectedFields: FormField[] = []

      fields.forEach((field) => {
        const widgets = field.acroField.getWidgets()
        widgets.forEach((widget, idx) => {
          const rect = widget.getRectangle()
          const page = pdfDoc.getPages().findIndex((p) => {
            const pageRef = p.ref
            const widgetPage = widget.P()
            return widgetPage && pageRef.objectNumber === widgetPage.objectNumber
          })

          const fieldType = field.constructor.name
          let type: FormField['type'] = 'text'
          let value: string | boolean = ''

          if (fieldType === 'PDFTextField') {
            type = 'text'
            try {
              value = (field as any).getText() || ''
            } catch { value = '' }
          } else if (fieldType === 'PDFCheckBox') {
            type = 'checkbox'
            try {
              value = (field as any).isChecked() || false
            } catch { value = false }
          } else if (fieldType === 'PDFDropdown') {
            type = 'dropdown'
            try {
              value = (field as any).getSelected()?.[0] || ''
            } catch { value = '' }
          } else if (fieldType === 'PDFRadioGroup') {
            type = 'radio'
            try {
              value = (field as any).getSelected() || ''
            } catch { value = '' }
          }

          detectedFields.push({
            name: field.getName(),
            type,
            pageNum: page + 1,
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            value,
            options: type === 'dropdown' ? (field as any).getOptions?.() : undefined,
          })
        })
      })

      setFormFields(detectedFields)
    } catch (error) {
      console.log('No form fields detected or error:', error)
    }
  }

  // Base scale for rendering (without zoom)
  const BASE_SCALE = 1.5

  // Render a specific page
  const renderPage = async (pageNum: number, pdfDoc?: any) => {
    const doc = pdfDoc || pdfDocRef.current
    if (!doc) return

    try {
      const { renderPageToDataUrl } = await getPdfRenderer()
      // Render image at current zoom level
      const scale = BASE_SCALE * zoom
      const image = await renderPageToDataUrl(doc, pageNum, { scale })
      setPageImage(image)

      // Get BASE page dimensions (without zoom) - these stay constant
      const page = await doc.getPage(pageNum)
      const baseViewport = page.getViewport({ scale: BASE_SCALE })
      setPageDimensions({ width: baseViewport.width, height: baseViewport.height })
    } catch (error) {
      console.error('Error rendering page:', error)
    }
  }

  // Re-render when page or zoom changes
  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage)
    }
  }, [currentPage, zoom])

  // Use Alt+scroll for PDF zoom (Ctrl+scroll is browser zoom and can't be intercepted)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.altKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.15 : 0.15
        setZoom((z) => Math.min(3, Math.max(0.25, z + delta)))
      }
    }

    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => document.removeEventListener('wheel', handleWheel)
  }, [])

  // Push state to history when annotations/paths/fields change
  const pushToHistory = useCallback(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false
      return
    }

    const newState: HistoryState = {
      textAnnotations: JSON.parse(JSON.stringify(textAnnotations)),
      drawPaths: JSON.parse(JSON.stringify(drawPaths)),
      formFields: JSON.parse(JSON.stringify(formFields)),
    }

    setHistory((prev) => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, newState]
    })
    setHistoryIndex((prev) => prev + 1)
  }, [textAnnotations, drawPaths, formFields, historyIndex])

  // Track changes and push to history (debounced)
  const lastStateRef = useRef<string>('')
  useEffect(() => {
    const currentState = JSON.stringify({ textAnnotations, drawPaths, formFields })
    if (currentState !== lastStateRef.current && lastStateRef.current !== '') {
      pushToHistory()
    }
    lastStateRef.current = currentState
  }, [textAnnotations, drawPaths, formFields])

  // Initialize history with empty state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ textAnnotations: [], drawPaths: [], formFields: [] }])
      setHistoryIndex(0)
    }
  }, [])

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true
      const prevState = history[historyIndex - 1]
      setTextAnnotations(JSON.parse(JSON.stringify(prevState.textAnnotations)))
      setDrawPaths(JSON.parse(JSON.stringify(prevState.drawPaths)))
      setFormFields(JSON.parse(JSON.stringify(prevState.formFields)))
      setHistoryIndex((prev) => prev - 1)
      setSelectedTextId(null)
    }
  }, [history, historyIndex])

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true
      const nextState = history[historyIndex + 1]
      setTextAnnotations(JSON.parse(JSON.stringify(nextState.textAnnotations)))
      setDrawPaths(JSON.parse(JSON.stringify(nextState.drawPaths)))
      setFormFields(JSON.parse(JSON.stringify(nextState.formFields)))
      setHistoryIndex((prev) => prev + 1)
      setSelectedTextId(null)
    }
  }, [history, historyIndex])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          handleUndo()
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault()
          handleRedo()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Handle canvas click for adding annotations
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'text') return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const newAnnotation: TextAnnotation = {
      id: `text-${Date.now()}`,
      pageNum: currentPage,
      x,
      y,
      text: '',
      fontSize,
      color: textColor,
      fontFamily,
      isBold,
      isItalic,
    }

    setTextAnnotations((prev) => [...prev, newAnnotation])
    setEditingTextId(newAnnotation.id)
  }

  // Handle drawing
  const handleDrawStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'draw') return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    setIsDrawing(true)
    setCurrentPath([{ x, y }])
  }

  const handleDrawMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || activeTool !== 'draw') return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    setCurrentPath((prev) => [...prev, { x, y }])
  }

  const handleDrawEnd = () => {
    if (!isDrawing || currentPath.length < 2) {
      setIsDrawing(false)
      setCurrentPath([])
      return
    }

    const newPath: DrawPath = {
      id: `draw-${Date.now()}`,
      pageNum: currentPage,
      points: currentPath,
      color: drawColor,
      lineWidth,
    }

    setDrawPaths((prev) => [...prev, newPath])
    setIsDrawing(false)
    setCurrentPath([])
  }

  // Update form field value
  const updateFormField = (name: string, value: string | boolean) => {
    setFormFields((fields) =>
      fields.map((f) => (f.name === name ? { ...f, value } : f))
    )
  }

  // Handle text annotation drag start
  const handleTextDragStart = (e: React.MouseEvent, annotationId: string) => {
    e.stopPropagation()
    e.preventDefault()
    const annotation = textAnnotations.find((a) => a.id === annotationId)
    if (!annotation) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    setDraggingTextId(annotationId)
    setSelectedTextId(annotationId)
    setDragOffset({
      x: e.clientX - rect.left - annotation.x * zoom,
      y: e.clientY - rect.top - annotation.y * zoom,
    })
  }

  // Handle text annotation drag move
  const handleTextDragMove = (e: React.MouseEvent) => {
    if (!draggingTextId) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const newX = (e.clientX - rect.left - dragOffset.x) / zoom
    const newY = (e.clientY - rect.top - dragOffset.y) / zoom

    setTextAnnotations((prev) =>
      prev.map((a) =>
        a.id === draggingTextId ? { ...a, x: newX, y: newY } : a
      )
    )
  }

  // Handle text annotation drag end
  const handleTextDragEnd = () => {
    setDraggingTextId(null)
  }

  // Delete text annotation
  const handleDeleteTextAnnotation = (id: string) => {
    setTextAnnotations((prev) => prev.filter((a) => a.id !== id))
    setSelectedTextId(null)
  }

  // Fetch Google Font TTF file
  const fetchGoogleFont = async (fontName: string, weight: number, italic: boolean): Promise<ArrayBuffer> => {
    const cacheKey = `${fontName}-${weight}-${italic}`
    if (googleFontCache.current[cacheKey]) {
      return googleFontCache.current[cacheKey]
    }

    // Google Fonts API v2 - get the CSS first to find the TTF URL
    // Use urlName if available (for fonts with special characters like "Arimo (Arial)")
    const fontConfig = googleFonts.find(f => f.name === fontName)
    const urlFontName = fontConfig?.urlName || fontName
    const family = urlFontName.replace(/ /g, '+')
    const italicParam = italic ? '1' : '0'
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:ital,wght@${italicParam},${weight}&display=swap`

    const cssResponse = await fetch(cssUrl, {
      headers: {
        // Request TTF format by using a user agent that doesn't support woff2
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)'
      }
    })
    const css = await cssResponse.text()

    // Extract URL from CSS
    const urlMatch = css.match(/src:\s*url\(([^)]+)\)/)
    if (!urlMatch) {
      throw new Error(`Could not find font URL for ${fontName}`)
    }

    const fontUrl = urlMatch[1]
    const fontResponse = await fetch(fontUrl)
    const fontData = await fontResponse.arrayBuffer()

    googleFontCache.current[cacheKey] = fontData
    return fontData
  }

  // Check if font is a Google Font
  const isGoogleFont = (fontFamily: string): boolean => {
    return googleFonts.some(f => f.name === fontFamily)
  }

  // Map font names to pdf-lib StandardFonts
  const getFontKey = (fontFamily: string, isBold: boolean, isItalic: boolean): keyof typeof StandardFonts => {
    if (fontFamily === 'Helvetica') {
      if (isBold && isItalic) return 'HelveticaBoldOblique'
      if (isBold) return 'HelveticaBold'
      if (isItalic) return 'HelveticaOblique'
      return 'Helvetica'
    } else if (fontFamily === 'Times-Roman') {
      if (isBold && isItalic) return 'TimesRomanBoldItalic'
      if (isBold) return 'TimesRomanBold'
      if (isItalic) return 'TimesRomanItalic'
      return 'TimesRoman'
    } else if (fontFamily === 'Courier') {
      if (isBold && isItalic) return 'CourierBoldOblique'
      if (isBold) return 'CourierBold'
      if (isItalic) return 'CourierOblique'
      return 'Courier'
    }
    return isBold ? 'HelveticaBold' : 'Helvetica'
  }

  // Save the edited PDF
  const handleSave = async () => {
    if (!pdfLibDocRef.current) return

    try {
      const pdfDoc = pdfLibDocRef.current
      const pages = pdfDoc.getPages()

      // Embed all standard fonts we might need
      const fonts: Record<string, Awaited<ReturnType<typeof pdfDoc.embedFont>>> = {}
      const standardFontNames = [
        'Helvetica', 'HelveticaBold', 'HelveticaOblique', 'HelveticaBoldOblique',
        'TimesRoman', 'TimesRomanBold', 'TimesRomanItalic', 'TimesRomanBoldItalic',
        'Courier', 'CourierBold', 'CourierOblique', 'CourierBoldOblique',
      ] as const
      for (const fontName of standardFontNames) {
        fonts[fontName] = await pdfDoc.embedFont(StandardFonts[fontName])
      }

      // Find which Google Fonts we need to load
      const googleFontsNeeded = new Set<string>()
      for (const annotation of textAnnotations) {
        if (isGoogleFont(annotation.fontFamily)) {
          // We need regular, bold, and italic variants
          googleFontsNeeded.add(`${annotation.fontFamily}-400-false`)
          googleFontsNeeded.add(`${annotation.fontFamily}-700-false`)
          googleFontsNeeded.add(`${annotation.fontFamily}-400-true`)
        }
      }

      // Load and embed Google Fonts
      for (const key of googleFontsNeeded) {
        const [fontName, weightStr, italicStr] = key.split('-')
        const fullName = fontName.includes(' ') ? fontName : textAnnotations.find(a => a.fontFamily.startsWith(fontName))?.fontFamily || fontName
        const weight = parseInt(weightStr)
        const italic = italicStr === 'true'

        try {
          const fontData = await fetchGoogleFont(fullName, weight, italic)
          const embeddedFont = await pdfDoc.embedFont(fontData)
          fonts[key] = embeddedFont
        } catch (error) {
          console.error(`Failed to load font ${fullName}:`, error)
        }
      }

      // Add text annotations
      for (const annotation of textAnnotations) {
        if (!annotation.text.trim()) continue
        const page = pages[annotation.pageNum - 1]
        if (!page) continue

        const pageHeight = page.getHeight()
        const [r, g, b] = hexToRgb(annotation.color)

        let font
        if (isGoogleFont(annotation.fontFamily)) {
          const weight = annotation.isBold ? 700 : 400
          const key = `${annotation.fontFamily}-${weight}-${annotation.isItalic}`
          font = fonts[key]
          // Fallback to regular if specific variant not available
          if (!font) {
            font = fonts[`${annotation.fontFamily}-400-false`] || fonts['Helvetica']
          }
        } else {
          const fontKey = getFontKey(annotation.fontFamily, annotation.isBold, annotation.isItalic)
          font = fonts[fontKey]
        }

        page.drawText(annotation.text, {
          x: annotation.x / BASE_SCALE,
          y: pageHeight - annotation.y / BASE_SCALE,
          size: annotation.fontSize,
          font,
          color: rgb(r / 255, g / 255, b / 255),
        })
      }

      // Add drawings
      for (const path of drawPaths) {
        const page = pages[path.pageNum - 1]
        if (!page || path.points.length < 2) continue

        const pageHeight = page.getHeight()
        const [r, g, b] = hexToRgb(path.color)

        // Draw path as lines (coordinates are already in base scale)
        for (let i = 0; i < path.points.length - 1; i++) {
          const start = path.points[i]
          const end = path.points[i + 1]

          page.drawLine({
            start: { x: start.x / BASE_SCALE, y: pageHeight - start.y / BASE_SCALE },
            end: { x: end.x / BASE_SCALE, y: pageHeight - end.y / BASE_SCALE },
            thickness: path.lineWidth,
            color: rgb(r / 255, g / 255, b / 255),
          })
        }
      }

      // Fill form fields
      try {
        const form = pdfDoc.getForm()
        for (const field of formFields) {
          try {
            const pdfField = form.getField(field.name)
            if (field.type === 'text' && typeof field.value === 'string') {
              (pdfField as any).setText(field.value)
            } else if (field.type === 'checkbox' && typeof field.value === 'boolean') {
              if (field.value) {
                (pdfField as any).check()
              } else {
                (pdfField as any).uncheck()
              }
            } else if (field.type === 'dropdown' && typeof field.value === 'string') {
              (pdfField as any).select(field.value)
            }
          } catch (e) {
            console.log('Error filling field:', field.name, e)
          }
        }
      } catch (e) {
        console.log('No form or error filling form:', e)
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      const baseName = file.name.replace(/\.pdf$/i, '')
      onSave(blob, `${baseName}_edited.pdf`)
    } catch (error) {
      console.error('Error saving PDF:', error)
    }
  }

  // Helper to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0]
  }

  // Clear all annotations on current page
  const clearCurrentPage = () => {
    setTextAnnotations((prev) => prev.filter((a) => a.pageNum !== currentPage))
    setDrawPaths((prev) => prev.filter((p) => p.pageNum !== currentPage))
  }

  // Get annotations for current page
  const currentPageAnnotations = textAnnotations.filter((a) => a.pageNum === currentPage)
  const currentPagePaths = drawPaths.filter((p) => p.pageNum === currentPage)
  const currentPageFields = formFields.filter((f) => f.pageNum === currentPage)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-bg-darkest z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-primary">{t('common.processing')}</p>
        </div>
      </div>
    )
  }

  return (
    <div data-pdf-editor className="fixed inset-0 bg-bg-darkest z-50 flex flex-col overflow-hidden" style={{ zoom: 1, transform: 'none' }}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-bg-dark" style={{ zoom: 1, transform: 'none' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-bg-elevated rounded-lg text-text-muted hover:text-text-primary"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary truncate max-w-[300px]">
                {file.name.replace(/\.pdf$/i, '')}_edited.pdf
              </span>
              <span className="text-xs text-text-muted">{t('editor.title')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCurrentPage}
            className="px-3 py-1.5 text-sm text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            {t('editor.clearPage')}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('editor.save')}
          </button>
        </div>
      </div>

      {/* Toolbar - Dark theme */}
      <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-border bg-bg-elevated" style={{ zoom: 1, transform: 'none' }}>
        {/* Undo/Redo group */}
        <div className="flex items-center border-r border-border pr-2 mr-1">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded ${
              canUndo
                ? 'text-text-muted hover:bg-bg-dark hover:text-text-primary'
                : 'text-text-muted/30 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 0 1 5 5v2M3 10l4-4M3 10l4 4" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded ${
              canRedo
                ? 'text-text-muted hover:bg-bg-dark hover:text-text-primary'
                : 'text-text-muted/30 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 0 0-5 5v2M21 10l-4-4M21 10l-4 4" />
            </svg>
          </button>
        </div>

        {/* Tools group */}
        <div className="flex items-center border-r border-border pr-2 mr-1">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-1.5 rounded ${activeTool === 'select' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-dark hover:text-text-primary'}`}
            title={t('editor.tools.select')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </button>
          <button
            onClick={() => setActiveTool('text')}
            className={`p-1.5 rounded ${activeTool === 'text' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-dark hover:text-text-primary'}`}
            title={t('editor.tools.text')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 5v3h5.5v12h3V8H19V5z"/>
            </svg>
          </button>
          <button
            onClick={() => setActiveTool('draw')}
            className={`p-1.5 rounded ${activeTool === 'draw' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-dark hover:text-text-primary'}`}
            title={t('editor.tools.draw')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {formFields.length > 0 && (
            <button
              onClick={() => setActiveTool('form')}
              className={`p-1.5 rounded ${activeTool === 'form' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-dark hover:text-text-primary'}`}
              title={t('editor.tools.form')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
        </div>

        {/* Text formatting - always visible when text tool active */}
        {activeTool === 'text' && (
          <>
            {/* Font family */}
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="h-7 px-2 bg-bg-dark border border-border rounded text-text-primary text-sm hover:border-text-muted focus:border-primary focus:outline-none"
            >
              {availableFonts.map((font) => (
                <option key={font.name} value={font.name}>{font.name}</option>
              ))}
            </select>

            <div className="border-r border-border h-6 mx-1" />

            {/* Font size group */}
            <div className="flex items-center">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="h-7 w-16 px-1 bg-bg-dark border border-border rounded-l text-text-primary text-sm text-center focus:outline-none"
              >
                {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <button
                onClick={() => setFontSize((s) => Math.max(8, s - 2))}
                className="h-7 w-6 flex items-center justify-center border-y border-border bg-bg-dark text-text-muted hover:bg-bg-darkest hover:text-text-primary text-xs font-medium"
                title="Decrease font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(72, s + 2))}
                className="h-7 w-6 flex items-center justify-center rounded-r border border-border bg-bg-dark text-text-muted hover:bg-bg-darkest hover:text-text-primary text-sm font-medium"
                title="Increase font size"
              >
                A
              </button>
            </div>

            <div className="border-r border-border h-6 mx-1" />

            {/* Bold & Italic */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`h-7 w-7 flex items-center justify-center rounded text-sm font-bold ${
                  isBold
                    ? 'bg-primary text-white'
                    : 'bg-bg-dark text-text-muted hover:bg-bg-darkest hover:text-text-primary'
                }`}
                title="Bold (Ctrl+B)"
              >
                B
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`h-7 w-7 flex items-center justify-center rounded text-sm italic ${
                  isItalic
                    ? 'bg-primary text-white'
                    : 'bg-bg-dark text-text-muted hover:bg-bg-darkest hover:text-text-primary'
                }`}
                title="Italic (Ctrl+I)"
              >
                I
              </button>
            </div>

            <div className="border-r border-border h-6 mx-1" />

            {/* Color picker */}
            <div className="relative">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Text color"
              />
              <div className="h-7 w-7 flex items-center justify-center rounded bg-bg-dark hover:bg-bg-darkest">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-text-primary">A</span>
                  <div className="w-4 h-1 -mt-0.5 rounded-sm" style={{ backgroundColor: textColor }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Draw options */}
        {activeTool === 'draw' && (
          <>
            {/* Stroke color */}
            <div className="relative">
              <input
                type="color"
                value={drawColor}
                onChange={(e) => setDrawColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Stroke color"
              />
              <div className="h-7 w-7 flex items-center justify-center rounded bg-bg-dark hover:bg-bg-darkest">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: drawColor }} />
              </div>
            </div>

            <div className="border-r border-border h-6 mx-1" />

            {/* Line width */}
            <select
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="h-7 px-2 bg-bg-dark border border-border rounded text-text-primary text-sm hover:border-text-muted focus:border-primary focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 8, 10].map((width) => (
                <option key={width} value={width}>{width}px</option>
              ))}
            </select>
          </>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Zoom controls */}
        <div className="flex items-center border-l border-border pl-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
            className="h-7 w-7 flex items-center justify-center rounded text-text-muted hover:bg-bg-dark hover:text-text-primary"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span className="text-text-primary text-sm min-w-[3.5rem] text-center font-medium">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="h-7 w-7 flex items-center justify-center rounded text-text-muted hover:bg-bg-dark hover:text-text-primary"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-bg-darkest p-4">
        <div className="inline-flex justify-center min-w-full">
          <div
            ref={containerRef}
            className="relative bg-white shadow-xl flex-shrink-0"
            style={{
              width: pageDimensions.width * zoom,
              height: pageDimensions.height * zoom,
              minWidth: pageDimensions.width * zoom,
              minHeight: pageDimensions.height * zoom,
              cursor: draggingTextId ? 'grabbing' : activeTool === 'text' ? 'text' : activeTool === 'draw' ? 'crosshair' : 'default',
            }}
            onClick={(e) => {
              handleCanvasClick(e)
              // Deselect text if clicking outside
              if (!draggingTextId) setSelectedTextId(null)
            }}
            onMouseDown={handleDrawStart}
            onMouseMove={(e) => {
              handleDrawMove(e)
              handleTextDragMove(e)
            }}
            onMouseUp={() => {
              handleDrawEnd()
              handleTextDragEnd()
            }}
            onMouseLeave={() => {
              handleDrawEnd()
              handleTextDragEnd()
            }}
          >
            {/* PDF page image */}
            {pageImage && (
              <img
                src={pageImage}
                alt={`Page ${currentPage}`}
                className="absolute inset-0 w-full h-full"
                draggable={false}
              />
            )}

            {/* Drawing canvas overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ width: pageDimensions.width * zoom, height: pageDimensions.height * zoom }}
            >
              {/* Existing paths */}
              {currentPagePaths.map((path) => (
                <path
                  key={path.id}
                  d={`M ${path.points.map((p) => `${p.x * zoom} ${p.y * zoom}`).join(' L ')}`}
                  fill="none"
                  stroke={path.color}
                  strokeWidth={path.lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {/* Current drawing path */}
              {isDrawing && currentPath.length > 1 && (
                <path
                  d={`M ${currentPath.map((p) => `${p.x * zoom} ${p.y * zoom}`).join(' L ')}`}
                  fill="none"
                  stroke={drawColor}
                  strokeWidth={lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {/* Text annotations */}
            {currentPageAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className={`absolute group ${selectedTextId === annotation.id ? 'z-20' : 'z-10'}`}
                style={{
                  left: annotation.x * zoom,
                  top: annotation.y * zoom,
                  transform: 'translate(-2px, -50%)',
                }}
              >
                {/* Selection toolbar - Dark theme (enlarged 30%) */}
                {selectedTextId === annotation.id && editingTextId !== annotation.id && (
                  <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-bg-dark rounded-lg shadow-lg border border-border px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Drag handle */}
                    <div
                      onMouseDown={(e) => handleTextDragStart(e, annotation.id)}
                      className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-bg-elevated rounded text-text-muted"
                      title="Drag to move"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Font selector */}
                    <select
                      value={annotation.fontFamily}
                      onChange={(e) => {
                        e.stopPropagation()
                        setTextAnnotations((prev) =>
                          prev.map((a) => (a.id === annotation.id ? { ...a, fontFamily: e.target.value } : a))
                        )
                      }}
                      className="h-8 px-2 bg-bg-elevated border-none text-text-primary text-sm focus:outline-none cursor-pointer hover:bg-bg-darkest rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {availableFonts.map((font) => (
                        <option key={font.name} value={font.name}>{font.name}</option>
                      ))}
                    </select>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Font size */}
                    <select
                      value={annotation.fontSize}
                      onChange={(e) => {
                        e.stopPropagation()
                        setTextAnnotations((prev) =>
                          prev.map((a) => (a.id === annotation.id ? { ...a, fontSize: Number(e.target.value) } : a))
                        )
                      }}
                      className="h-8 w-14 px-1 bg-bg-elevated border-none text-text-primary text-sm text-center focus:outline-none cursor-pointer rounded-l"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72].map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setTextAnnotations((prev) =>
                          prev.map((a) => (a.id === annotation.id ? { ...a, fontSize: Math.max(8, a.fontSize - 2) } : a))
                        )
                      }}
                      className="h-8 w-7 flex items-center justify-center bg-bg-elevated text-text-muted hover:bg-bg-darkest hover:text-text-primary text-xs font-medium"
                      title="Decrease font size"
                    >
                      A
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setTextAnnotations((prev) =>
                          prev.map((a) => (a.id === annotation.id ? { ...a, fontSize: Math.min(72, a.fontSize + 2) } : a))
                        )
                      }}
                      className="h-8 w-7 flex items-center justify-center rounded-r bg-bg-elevated text-text-muted hover:bg-bg-darkest hover:text-text-primary text-sm font-medium"
                      title="Increase font size"
                    >
                      A
                    </button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Bold toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setTextAnnotations((prev) =>
                          prev.map((a) => (a.id === annotation.id ? { ...a, isBold: !a.isBold } : a))
                        )
                      }}
                      className={`h-8 w-8 flex items-center justify-center rounded text-sm font-bold ${
                        annotation.isBold ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                      }`}
                      title="Bold"
                    >
                      B
                    </button>

                    {/* Italic toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setTextAnnotations((prev) =>
                          prev.map((a) => (a.id === annotation.id ? { ...a, isItalic: !a.isItalic } : a))
                        )
                      }}
                      className={`h-8 w-8 flex items-center justify-center rounded text-sm italic ${
                        annotation.isItalic ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                      }`}
                      title="Italic"
                    >
                      I
                    </button>

                    {/* Color picker */}
                    <div className="relative h-8 w-8">
                      <input
                        type="color"
                        value={annotation.color}
                        onChange={(e) => {
                          setTextAnnotations((prev) =>
                            prev.map((a) => (a.id === annotation.id ? { ...a, color: e.target.value } : a))
                          )
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Text color"
                      />
                      <div className="h-8 w-8 flex items-center justify-center rounded hover:bg-bg-elevated">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-text-primary">A</span>
                          <div className="w-4 h-1 -mt-0.5 rounded-sm" style={{ backgroundColor: annotation.color }} />
                        </div>
                      </div>
                    </div>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingTextId(annotation.id)
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded text-text-muted hover:bg-bg-elevated hover:text-primary"
                      title="Edit text"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTextAnnotation(annotation.id)
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded text-text-muted hover:bg-red-500/20 hover:text-red-400"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}

                {editingTextId === annotation.id ? (
                  <input
                    type="text"
                    value={annotation.text}
                    onChange={(e) => {
                      setTextAnnotations((prev) =>
                        prev.map((a) => (a.id === annotation.id ? { ...a, text: e.target.value } : a))
                      )
                    }}
                    onBlur={() => setEditingTextId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingTextId(null)
                      if (e.key === 'Escape') setEditingTextId(null)
                    }}
                    autoFocus
                    className="bg-yellow-100 border-2 border-primary px-1 outline-none rounded"
                    style={{
                      fontSize: annotation.fontSize * zoom,
                      color: annotation.color,
                      fontFamily: availableFonts.find((f) => f.name === annotation.fontFamily)?.css || 'sans-serif',
                      fontWeight: annotation.isBold ? 'bold' : 'normal',
                      fontStyle: annotation.isItalic ? 'italic' : 'normal',
                      minWidth: '100px',
                    }}
                  />
                ) : (
                  <div className="relative">
                    {/* Draggable border frame - only visible when selected */}
                    {selectedTextId === annotation.id && (
                      <>
                        {/* Top border */}
                        <div
                          onMouseDown={(e) => handleTextDragStart(e, annotation.id)}
                          className="absolute -top-2 -left-2 -right-2 h-2 cursor-move border-t-2 border-l-2 border-r-2 border-primary border-dashed rounded-t"
                        />
                        {/* Bottom border */}
                        <div
                          onMouseDown={(e) => handleTextDragStart(e, annotation.id)}
                          className="absolute -bottom-2 -left-2 -right-2 h-2 cursor-move border-b-2 border-l-2 border-r-2 border-primary border-dashed rounded-b"
                        />
                        {/* Left border */}
                        <div
                          onMouseDown={(e) => handleTextDragStart(e, annotation.id)}
                          className="absolute -left-2 top-0 bottom-0 w-2 cursor-move border-l-2 border-primary border-dashed"
                        />
                        {/* Right border */}
                        <div
                          onMouseDown={(e) => handleTextDragStart(e, annotation.id)}
                          className="absolute -right-2 top-0 bottom-0 w-2 cursor-move border-r-2 border-primary border-dashed"
                        />
                      </>
                    )}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTextId(annotation.id)
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        setEditingTextId(annotation.id)
                      }}
                      className={`cursor-pointer px-1 rounded ${
                        selectedTextId === annotation.id
                          ? 'bg-yellow-100/30'
                          : 'hover:bg-yellow-100/50'
                      }`}
                      style={{
                        fontSize: annotation.fontSize * zoom,
                        color: annotation.color,
                        fontFamily: availableFonts.find((f) => f.name === annotation.fontFamily)?.css || 'sans-serif',
                        fontWeight: annotation.isBold ? 'bold' : 'normal',
                        fontStyle: annotation.isItalic ? 'italic' : 'normal',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {annotation.text || '(click to edit)'}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Form fields overlay */}
            {activeTool === 'form' && currentPageFields.map((field) => {
              const scale = 1.5
              return (
                <div
                  key={field.name}
                  className="absolute bg-blue-100/50 border border-blue-400"
                  style={{
                    left: field.rect.x * scale * zoom,
                    bottom: field.rect.y * scale * zoom,
                    width: field.rect.width * scale * zoom,
                    height: field.rect.height * scale * zoom,
                  }}
                >
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={field.value as string}
                      onChange={(e) => updateFormField(field.name, e.target.value)}
                      className="w-full h-full px-1 bg-transparent text-xs"
                      placeholder={field.name}
                    />
                  )}
                  {field.type === 'checkbox' && (
                    <input
                      type="checkbox"
                      checked={field.value as boolean}
                      onChange={(e) => updateFormField(field.name, e.target.checked)}
                      className="w-full h-full"
                    />
                  )}
                  {field.type === 'dropdown' && (
                    <select
                      value={field.value as string}
                      onChange={(e) => updateFormField(field.name, e.target.value)}
                      className="w-full h-full text-xs bg-transparent"
                    >
                      <option value="">--</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer - Page navigation */}
      <div className="flex-shrink-0 flex items-center justify-center gap-4 p-4 border-t border-border bg-bg-dark" style={{ zoom: 1, transform: 'none' }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="p-2 hover:bg-bg-elevated disabled:opacity-30 rounded-lg text-text-muted"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-text-primary">
          {t('edit.page')} {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="p-2 hover:bg-bg-elevated disabled:opacity-30 rounded-lg text-text-muted"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
