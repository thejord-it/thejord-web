'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/components/ToastProvider'
import { trackToolUsage, trackError } from '@/lib/tools/analytics'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PDFDocument, degrees } from 'pdf-lib'
import JSZip from 'jszip'
// Types for pdf-renderer (dynamic import to avoid SSR issues)
type RenderOptions = {
  scale?: number
  format?: 'png' | 'jpg'
  quality?: number
}

type PDFDocumentProxy = {
  numPages: number
  getPage: (pageNumber: number) => Promise<any>
}

// Dynamic import helper - only loads pdfjs on client side
const getPdfRenderer = () => import('@/lib/tools/pdf-renderer')

type TabType = 'merge' | 'split' | 'edit' | 'convert' | 'compress'
type CompressionLevel = 'light' | 'medium' | 'aggressive'
type ConvertMode = 'imagesToPdf' | 'pdfToImages'
type PageSize = 'a4' | 'letter' | 'fit'

interface PdfFile {
  id: string
  file: File
  name: string
  pageCount: number
  size: number
  thumbnail?: string
}

interface PageInfo {
  id: string
  pageNumber: number
  rotation: number
  selected: boolean
  thumbnail?: string
}

// Sortable item for merge list
function SortableMergeItem({ file, onRemove }: { file: PdfFile; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-bg-dark border border-border rounded-lg group"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-text-primary">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <div className="w-10 h-12 bg-red-500/20 rounded flex items-center justify-center text-red-400 text-xs font-bold">
        PDF
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate">{file.name}</p>
        <p className="text-text-muted text-xs">
          {file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'} • {formatFileSize(file.size)}
        </p>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="p-1 text-text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// Sortable thumbnail for edit mode
function SortablePageThumbnail({
  page,
  onRotate,
  onToggleSelect,
  onDelete,
  onPreview,
  t,
}: {
  page: PageInfo
  onRotate: (id: string, direction: 'left' | 'right') => void
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
  onPreview: (thumbnail: string, pageNum: number) => void
  t: ReturnType<typeof useTranslations>
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-bg-dark border-2 rounded-lg overflow-hidden transition-colors ${
        page.selected ? 'border-primary' : 'border-border hover:border-border-light'
      }`}
    >
      {/* Thumbnail */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing aspect-[3/4] bg-white flex items-center justify-center"
        style={{ transform: `rotate(${page.rotation}deg)` }}
      >
        {page.thumbnail ? (
          <img src={page.thumbnail} alt={`Page ${page.pageNumber}`} className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-400 text-4xl font-bold">{page.pageNumber}</div>
        )}
      </div>

      {/* Page number */}
      <div className="absolute bottom-0 left-0 right-0 bg-bg-darkest/80 px-2 py-1 text-center">
        <span className="text-text-primary text-xs font-medium">
          {t('edit.page')} {page.pageNumber}
        </span>
      </div>

      {/* Selection checkbox */}
      <button
        onClick={() => onToggleSelect(page.id)}
        className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          page.selected ? 'bg-primary border-primary' : 'bg-bg-dark/80 border-border hover:border-primary'
        }`}
      >
        {page.selected && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {page.thumbnail && (
          <button
            onClick={() => onPreview(page.thumbnail!, page.pageNumber)}
            className="p-1 bg-bg-dark/80 rounded hover:bg-primary/20 text-text-muted hover:text-primary"
            title={t('edit.preview')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onRotate(page.id, 'left')}
          className="p-1 bg-bg-dark/80 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary"
          title={t('edit.rotateLeft')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={() => onRotate(page.id, 'right')}
          className="p-1 bg-bg-dark/80 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary"
          title={t('edit.rotateRight')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(page.id)}
          className="p-1 bg-bg-dark/80 rounded hover:bg-red-500/20 text-text-muted hover:text-red-400"
          title={t('edit.delete')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function PdfTools() {
  const t = useTranslations('toolPages.pdfTools')
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<TabType>('merge')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<PdfFile[]>([])

  // Split state
  const [splitFile, setSplitFile] = useState<PdfFile | null>(null)
  const [splitPages, setSplitPages] = useState<PageInfo[]>([])
  const [splitRange, setSplitRange] = useState('')
  const [splitMode, setSplitMode] = useState<'all' | 'custom'>('all')

  // Edit state
  const [editFile, setEditFile] = useState<PdfFile | null>(null)
  const [editPages, setEditPages] = useState<PageInfo[]>([])

  // Convert state
  const [convertMode, setConvertMode] = useState<ConvertMode>('imagesToPdf')
  const [convertImages, setConvertImages] = useState<{ id: string; file: File; preview: string }[]>([])
  const [convertPdf, setConvertPdf] = useState<PdfFile | null>(null)
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg'>('png')
  const [outputQuality, setOutputQuality] = useState(90)
  // Convert results
  const [convertedPdfBlob, setConvertedPdfBlob] = useState<Blob | null>(null)
  const [convertedPdfName, setConvertedPdfName] = useState('')
  const [convertedImagesBlob, setConvertedImagesBlob] = useState<Blob | null>(null)
  const [convertedImagesName, setConvertedImagesName] = useState('')

  // Compress state
  const [compressFile, setCompressFile] = useState<PdfFile | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium')
  const [preserveText, setPreserveText] = useState(true)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
  const [compressOutputName, setCompressOutputName] = useState('')

  // Preview state
  const [previewPage, setPreviewPage] = useState<{ image: string; pageNum: number; loading: boolean } | null>(null)
  const [previewZoom, setPreviewZoom] = useState(1)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load PDF and get page count
  const loadPdfInfo = async (file: File): Promise<PdfFile> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pageCount = pdfDoc.getPageCount()

    return {
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      pageCount,
      size: file.size,
    }
  }

  // Generate page infos with real thumbnails using pdfjs
  const generatePageInfosWithThumbnails = async (
    file: File,
    onProgress?: (current: number, total: number) => void
  ): Promise<PageInfo[]> => {
    const { loadPdfDocument, generateThumbnail } = await getPdfRenderer()
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await loadPdfDocument(arrayBuffer)
    const numPages = pdfDoc.numPages
    const pages: PageInfo[] = []

    for (let i = 1; i <= numPages; i++) {
      const thumbnail = await generateThumbnail(pdfDoc, i, 150)
      pages.push({
        id: `page-${i}`,
        pageNumber: i,
        rotation: 0,
        selected: false,
        thumbnail,
      })
      onProgress?.(i, numPages)
    }

    return pages
  }

  // Generate page infos without thumbnails (faster)
  const generatePageInfos = (pageCount: number): PageInfo[] => {
    return Array.from({ length: pageCount }, (_, i) => ({
      id: `page-${i + 1}`,
      pageNumber: i + 1,
      rotation: 0,
      selected: false,
    }))
  }

  // Handle file drop/select for merge
  const handleMergeFilesSelect = async (files: FileList | null) => {
    if (!files) return
    setIsProcessing(true)
    try {
      const pdfFiles = Array.from(files).filter((f) => f.type === 'application/pdf')
      const loadedFiles = await Promise.all(pdfFiles.map(loadPdfInfo))
      setMergeFiles((prev) => [...prev, ...loadedFiles])
      trackToolUsage('PDF Tools', 'files_added', `${loadedFiles.length} files`)
    } catch (error) {
      trackError('PDF_LOAD_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle single PDF select for split/edit/compress
  const handleSinglePdfSelect = async (files: FileList | null, mode: 'split' | 'edit' | 'compress' | 'convert') => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (file.type !== 'application/pdf') return

    setIsProcessing(true)
    setProgress(0)
    try {
      const pdfInfo = await loadPdfInfo(file)

      // Generate thumbnails for split and edit modes
      if (mode === 'split' || mode === 'edit') {
        const pageInfos = await generatePageInfosWithThumbnails(file, (current, total) => {
          setProgress((current / total) * 100)
        })

        if (mode === 'split') {
          setSplitFile(pdfInfo)
          setSplitPages(pageInfos)
        } else {
          setEditFile(pdfInfo)
          setEditPages(pageInfos)
        }
      } else if (mode === 'compress') {
        setCompressFile(pdfInfo)
        setCompressedSize(null)
        setCompressedBlob(null)
        // Set default output name
        const baseName = pdfInfo.name.replace(/\.pdf$/i, '')
        setCompressOutputName(`${baseName}_compressed.pdf`)
      } else if (mode === 'convert') {
        setConvertPdf(pdfInfo)
        setConvertedImagesBlob(null)
        const baseName = pdfInfo.name.replace(/\.pdf$/i, '')
        setConvertedImagesName(`${baseName}_images.zip`)
      }

      trackToolUsage('PDF Tools', `${mode}_file_loaded`, pdfInfo.name)
    } catch (error) {
      trackError('PDF_LOAD_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Handle images select for convert
  const handleImagesSelect = async (files: FileList | null) => {
    if (!files) return
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const newImages = imageFiles.map((file) => ({
      id: `img-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }))
    setConvertImages((prev) => [...prev, ...newImages])
    // Set default name and reset result
    if (convertImages.length === 0 && newImages.length > 0) {
      setConvertedPdfName('images_to_pdf.pdf')
    }
    setConvertedPdfBlob(null)
  }

  // Merge PDFs
  const handleMerge = async () => {
    if (mergeFiles.length < 2) return
    setIsProcessing(true)
    setProgress(0)

    try {
      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < mergeFiles.length; i++) {
        const arrayBuffer = await mergeFiles[i].file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
        setProgress(((i + 1) / mergeFiles.length) * 100)
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' })
      downloadBlob(blob, 'merged.pdf')

      trackToolUsage('PDF Tools', 'merge_complete', `${mergeFiles.length} files`)
      showToast(t('common.success'), 'success')
    } catch (error) {
      trackError('PDF_MERGE_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Split PDF
  const handleSplit = async (downloadAsZip: boolean) => {
    if (!splitFile) return
    setIsProcessing(true)
    setProgress(0)

    try {
      const arrayBuffer = await splitFile.file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Parse page selection
      let selectedPages: number[] = []
      if (splitMode === 'all') {
        selectedPages = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i)
      } else {
        // Parse custom range like "1-3, 5, 7-9"
        const ranges = splitRange.split(',').map((r) => r.trim())
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map((n) => parseInt(n.trim()) - 1)
            for (let i = start; i <= end && i < pdfDoc.getPageCount(); i++) {
              if (i >= 0) selectedPages.push(i)
            }
          } else {
            const page = parseInt(range) - 1
            if (page >= 0 && page < pdfDoc.getPageCount()) {
              selectedPages.push(page)
            }
          }
        }
      }

      if (selectedPages.length === 0) {
        showToast('No pages selected', 'error')
        return
      }

      if (downloadAsZip) {
        const zip = new JSZip()

        for (let i = 0; i < selectedPages.length; i++) {
          const newPdf = await PDFDocument.create()
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [selectedPages[i]])
          newPdf.addPage(copiedPage)
          const pdfBytes = await newPdf.save()
          zip.file(`page_${selectedPages[i] + 1}.pdf`, pdfBytes)
          setProgress(((i + 1) / selectedPages.length) * 100)
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        downloadBlob(zipBlob, 'split_pages.zip')
      } else {
        // Download each page separately
        for (let i = 0; i < selectedPages.length; i++) {
          const newPdf = await PDFDocument.create()
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [selectedPages[i]])
          newPdf.addPage(copiedPage)
          const pdfBytes = await newPdf.save()
          const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
          downloadBlob(blob, `page_${selectedPages[i] + 1}.pdf`)
          setProgress(((i + 1) / selectedPages.length) * 100)
        }
      }

      trackToolUsage('PDF Tools', 'split_complete', `${selectedPages.length} pages`)
      showToast(t('common.success'), 'success')
    } catch (error) {
      trackError('PDF_SPLIT_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Save edited PDF
  const handleSaveEdit = async () => {
    if (!editFile || editPages.length === 0) return
    setIsProcessing(true)
    setProgress(0)

    try {
      const arrayBuffer = await editFile.file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const newPdf = await PDFDocument.create()

      for (let i = 0; i < editPages.length; i++) {
        const pageInfo = editPages[i]
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageInfo.pageNumber - 1])

        // Apply rotation
        if (pageInfo.rotation !== 0) {
          copiedPage.setRotation(degrees(pageInfo.rotation))
        }

        newPdf.addPage(copiedPage)
        setProgress(((i + 1) / editPages.length) * 100)
      }

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      downloadBlob(blob, `edited_${editFile.name}`)

      trackToolUsage('PDF Tools', 'edit_complete', `${editPages.length} pages`)
      showToast(t('common.success'), 'success')
    } catch (error) {
      trackError('PDF_EDIT_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Convert images to PDF
  const handleImagesToPdf = async () => {
    if (convertImages.length === 0) return
    setIsProcessing(true)
    setProgress(0)

    try {
      const pdfDoc = await PDFDocument.create()

      for (let i = 0; i < convertImages.length; i++) {
        const img = convertImages[i]
        const arrayBuffer = await img.file.arrayBuffer()

        let image
        if (img.file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer)
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer)
        }

        // Determine page dimensions
        let pageWidth: number, pageHeight: number
        if (pageSize === 'a4') {
          pageWidth = 595.28
          pageHeight = 841.89
        } else if (pageSize === 'letter') {
          pageWidth = 612
          pageHeight = 792
        } else {
          // Fit to image
          pageWidth = image.width
          pageHeight = image.height
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight])

        // Scale image to fit page while maintaining aspect ratio
        const imgAspect = image.width / image.height
        const pageAspect = pageWidth / pageHeight

        let drawWidth: number, drawHeight: number
        if (imgAspect > pageAspect) {
          drawWidth = pageWidth
          drawHeight = pageWidth / imgAspect
        } else {
          drawHeight = pageHeight
          drawWidth = pageHeight * imgAspect
        }

        const x = (pageWidth - drawWidth) / 2
        const y = (pageHeight - drawHeight) / 2

        page.drawImage(image, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        })

        setProgress(((i + 1) / convertImages.length) * 100)
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      setConvertedPdfBlob(blob)

      trackToolUsage('PDF Tools', 'images_to_pdf', `${convertImages.length} images`)
      showToast(t('common.success'), 'success')
    } catch (error) {
      trackError('PDF_CONVERT_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Convert PDF to images
  const handlePdfToImages = async () => {
    if (!convertPdf) return
    setIsProcessing(true)
    setProgress(0)

    try {
      const { loadPdfDocument, renderPageToBlob } = await getPdfRenderer()
      const arrayBuffer = await convertPdf.file.arrayBuffer()
      const pdfDoc = await loadPdfDocument(arrayBuffer)
      const numPages = pdfDoc.numPages

      const renderOptions: RenderOptions = {
        scale: outputQuality / 50, // scale 0.2 to 2.0 based on quality
        format: outputFormat,
        quality: outputQuality / 100,
      }

      const zip = new JSZip()

      for (let i = 1; i <= numPages; i++) {
        const blob = await renderPageToBlob(pdfDoc, i, renderOptions)
        const ext = outputFormat === 'jpg' ? 'jpg' : 'png'
        zip.file(`page_${i}.${ext}`, blob)
        setProgress((i / numPages) * 100)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      setConvertedImagesBlob(zipBlob)

      trackToolUsage('PDF Tools', 'pdf_to_images', `${numPages} pages`)
      showToast(t('common.success'), 'success')
    } catch (error) {
      trackError('PDF_CONVERT_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Compress PDF
  const handleCompress = async () => {
    if (!compressFile) return
    setIsProcessing(true)
    setProgress(0)

    try {
      const arrayBuffer = await compressFile.file.arrayBuffer()
      const settings = {
        light: { scale: 1.5, quality: 0.85 },
        medium: { scale: 1.2, quality: 0.7 },
        aggressive: { scale: 1.0, quality: 0.5 },
      }
      const { scale, quality } = settings[compressionLevel]

      if (preserveText) {
        // Hybrid mode: analyze each page and only convert image-only pages
        // This preserves text on text pages while compressing scanned/image pages
        const { loadPdfDocument } = await getPdfRenderer()
        // Create copies of ArrayBuffer since pdfjs detaches the original
        const arrayBufferForPdfJs = arrayBuffer.slice(0)
        const arrayBufferForPdfLib = arrayBuffer.slice(0)
        const pdfJsDoc = await loadPdfDocument(arrayBufferForPdfJs)
        const pdfLibDoc = await PDFDocument.load(arrayBufferForPdfLib, { ignoreEncryption: true })
        const totalPages = pdfJsDoc.numPages

        // Create new PDF document
        const newPdfDoc = await PDFDocument.create()

        for (let i = 1; i <= totalPages; i++) {
          setProgress(Math.round((i / totalPages) * 100))

          const page = await pdfJsDoc.getPage(i)

          // Try to extract text content to determine if page has real text
          let hasSignificantText = false
          try {
            const textContent = await page.getTextContent()
            hasSignificantText = textContent.items && textContent.items.length > 10
          } catch {
            // If text extraction fails, assume it's an image page
            hasSignificantText = false
          }

          if (hasSignificantText) {
            // Copy original page to preserve text
            const [copiedPage] = await newPdfDoc.copyPages(pdfLibDoc, [i - 1])
            newPdfDoc.addPage(copiedPage)
          } else {
            // Image-only page: render and compress as JPEG
            const viewport = page.getViewport({ scale })
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            if (!context) throw new Error('Could not get canvas context')

            canvas.width = viewport.width
            canvas.height = viewport.height
            context.fillStyle = 'white'
            context.fillRect(0, 0, canvas.width, canvas.height)

            await page.render({ canvasContext: context, viewport }).promise

            const jpegDataUrl = canvas.toDataURL('image/jpeg', quality)
            const jpegBase64 = jpegDataUrl.split(',')[1]
            const jpegBytes = Uint8Array.from(atob(jpegBase64), (c) => c.charCodeAt(0))

            const jpegImage = await newPdfDoc.embedJpg(jpegBytes)
            const newPage = newPdfDoc.addPage([jpegImage.width, jpegImage.height])
            newPage.drawImage(jpegImage, { x: 0, y: 0, width: jpegImage.width, height: jpegImage.height })
          }
        }

        const pdfBytes = await newPdfDoc.save({ useObjectStreams: true })
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
        setCompressedSize(blob.size)
        setCompressedBlob(blob)
      } else {
        // Maximum compression mode: convert ALL pages to compressed JPEG images
        const { loadPdfDocument } = await getPdfRenderer()
        const pdfDoc = await loadPdfDocument(arrayBuffer)
        const totalPages = pdfDoc.numPages

        const newPdfDoc = await PDFDocument.create()

        for (let i = 1; i <= totalPages; i++) {
          setProgress(Math.round((i / totalPages) * 100))

          const page = await pdfDoc.getPage(i)
          const viewport = page.getViewport({ scale })

          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          if (!context) throw new Error('Could not get canvas context')

          canvas.width = viewport.width
          canvas.height = viewport.height
          context.fillStyle = 'white'
          context.fillRect(0, 0, canvas.width, canvas.height)

          await page.render({ canvasContext: context, viewport }).promise

          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality)
          const jpegBase64 = jpegDataUrl.split(',')[1]
          const jpegBytes = Uint8Array.from(atob(jpegBase64), (c) => c.charCodeAt(0))

          const jpegImage = await newPdfDoc.embedJpg(jpegBytes)
          const newPage = newPdfDoc.addPage([jpegImage.width, jpegImage.height])
          newPage.drawImage(jpegImage, { x: 0, y: 0, width: jpegImage.width, height: jpegImage.height })
        }

        const pdfBytes = await newPdfDoc.save()
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
        setCompressedSize(blob.size)
        setCompressedBlob(blob)
      }

      trackToolUsage('PDF Tools', 'compress_complete', `${compressionLevel}_${preserveText ? 'hybrid' : 'image'}`)
      showToast(t('common.success'), 'success')
    } catch (error) {
      console.error('PDF Compress Error:', error)
      trackError('PDF_COMPRESS_ERROR', String(error), 'PDF Tools')
      showToast(t('common.error'), 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Download blob helper
  const downloadBlob = (blob: Blob, filename: string) => {
    // Force download by using octet-stream MIME type
    const downloadBlob = new Blob([blob], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(downloadBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Drag end handlers
  const handleMergeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setMergeFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleEditDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setEditPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Edit page handlers
  const handleRotatePage = (id: string, direction: 'left' | 'right') => {
    setEditPages((pages) =>
      pages.map((p) =>
        p.id === id
          ? { ...p, rotation: (p.rotation + (direction === 'right' ? 90 : -90) + 360) % 360 }
          : p
      )
    )
  }

  const handleTogglePageSelect = (id: string) => {
    setEditPages((pages) => pages.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  const handleDeletePage = (id: string) => {
    setEditPages((pages) => pages.filter((p) => p.id !== id))
  }

  const handleSelectAll = () => {
    setEditPages((pages) => pages.map((p) => ({ ...p, selected: true })))
  }

  const handleDeselectAll = () => {
    setEditPages((pages) => pages.map((p) => ({ ...p, selected: false })))
  }

  const handleDeleteSelected = () => {
    setEditPages((pages) => pages.filter((p) => !p.selected))
  }

  // Generate high-res preview
  const handlePreviewPage = async (pageNum: number) => {
    if (!editFile) return

    // Show loading state and reset zoom
    setPreviewPage({ image: '', pageNum, loading: true })
    setPreviewZoom(1)

    try {
      const { loadPdfDocument, renderPageToDataUrl } = await getPdfRenderer()
      const arrayBuffer = await editFile.file.arrayBuffer()
      const pdfDoc = await loadPdfDocument(arrayBuffer)

      // Render at higher scale for better quality
      const highResImage = await renderPageToDataUrl(pdfDoc, pageNum, { scale: 2.5 })
      setPreviewPage({ image: highResImage, pageNum, loading: false })
    } catch (error) {
      console.error('Preview error:', error)
      setPreviewPage(null)
    }
  }

  // Navigate preview pages
  const handlePreviewNav = (direction: 'prev' | 'next') => {
    if (!previewPage || !editFile) return
    const totalPages = editPages.length
    let newPageNum = previewPage.pageNum

    if (direction === 'prev' && previewPage.pageNum > 1) {
      newPageNum = previewPage.pageNum - 1
    } else if (direction === 'next' && previewPage.pageNum < totalPages) {
      newPageNum = previewPage.pageNum + 1
    }

    if (newPageNum !== previewPage.pageNum) {
      handlePreviewPage(newPageNum)
    }
  }

  // Tab content renderers
  const tabs: { key: TabType; label: string }[] = [
    { key: 'merge', label: t('tabs.merge') },
    { key: 'split', label: t('tabs.split') },
    { key: 'edit', label: t('tabs.edit') },
    { key: 'convert', label: t('tabs.convert') },
    { key: 'compress', label: t('tabs.compress') },
  ]

  // Dropzone component
  const Dropzone = ({
    onDrop,
    accept,
    multiple = false,
    children,
  }: {
    onDrop: (files: FileList | null) => void
    accept: string
    multiple?: boolean
    children: React.ReactNode
  }) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    }

    const handleDragLeave = () => {
      setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      onDrop(e.dataTransfer.files)
    }

    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => onDrop(e.target.files)}
          className="hidden"
        />
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">PDF Tools</h1>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-bg-dark text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        {isProcessing && progress > 0 && (
          <div className="mb-6">
            <div className="h-2 bg-bg-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-text-muted text-sm mt-2">{t('common.processing')}</p>
          </div>
        )}

        {/* Tab content */}
        <div className="bg-bg-dark rounded-xl border border-border p-6">
          {/* MERGE TAB */}
          {activeTab === 'merge' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">{t('merge.title')}</h2>
                <p className="text-text-secondary text-sm">{t('merge.description')}</p>
              </div>

              <Dropzone onDrop={handleMergeFilesSelect} accept="application/pdf" multiple>
                <div className="text-red-400 text-4xl mb-3">PDF</div>
                <p className="text-text-primary font-medium">{t('dropzone.title')}</p>
                <p className="text-text-muted text-sm">{t('dropzone.subtitle')}</p>
                <p className="text-text-muted text-xs mt-2">{t('dropzone.acceptedFormats')}: PDF</p>
              </Dropzone>

              {mergeFiles.length > 0 && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-text-secondary text-sm">{t('merge.dragToReorder')}</p>
                      <button
                        onClick={() => setMergeFiles([])}
                        className="text-text-muted hover:text-red-400 text-sm"
                      >
                        {t('common.clear')}
                      </button>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleMergeDragEnd}>
                      <SortableContext items={mergeFiles.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {mergeFiles.map((file) => (
                            <SortableMergeItem
                              key={file.id}
                              file={file}
                              onRemove={(id) => setMergeFiles((files) => files.filter((f) => f.id !== id))}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>

                  <button
                    onClick={handleMerge}
                    disabled={mergeFiles.length < 2 || isProcessing}
                    className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {t('merge.mergeButton')}
                  </button>
                </>
              )}
            </div>
          )}

          {/* SPLIT TAB */}
          {activeTab === 'split' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">{t('split.title')}</h2>
                <p className="text-text-secondary text-sm">{t('split.description')}</p>
              </div>

              {!splitFile ? (
                <Dropzone onDrop={(files) => handleSinglePdfSelect(files, 'split')} accept="application/pdf">
                  <div className="text-red-400 text-4xl mb-3">PDF</div>
                  <p className="text-text-primary font-medium">{t('dropzone.title')}</p>
                  <p className="text-text-muted text-sm">{t('dropzone.subtitle')}</p>
                </Dropzone>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 bg-bg-darkest rounded-lg">
                    <div className="w-12 h-14 bg-red-500/20 rounded flex items-center justify-center text-red-400 font-bold">
                      PDF
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{splitFile.name}</p>
                      <p className="text-text-muted text-sm">
                        {splitFile.pageCount} {t('common.pages')} • {formatFileSize(splitFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSplitFile(null)
                        setSplitPages([])
                      }}
                      className="text-text-muted hover:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-text-primary font-medium">{t('split.selectPages')}</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={splitMode === 'all'}
                          onChange={() => setSplitMode('all')}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-text-secondary">{t('split.allPages')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={splitMode === 'custom'}
                          onChange={() => setSplitMode('custom')}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-text-secondary">{t('split.customRange')}</span>
                      </label>
                    </div>
                    {splitMode === 'custom' && (
                      <input
                        type="text"
                        value={splitRange}
                        onChange={(e) => setSplitRange(e.target.value)}
                        placeholder={t('split.rangePlaceholder')}
                        className="w-full px-4 py-2 bg-bg-darkest border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      />
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSplit(true)}
                      disabled={isProcessing}
                      className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                    >
                      {t('split.downloadAll')}
                    </button>
                    <button
                      onClick={() => handleSplit(false)}
                      disabled={isProcessing}
                      className="flex-1 py-3 bg-bg-elevated hover:bg-bg-surface text-text-primary font-medium rounded-lg transition-colors"
                    >
                      {t('split.downloadSingle')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* EDIT TAB */}
          {activeTab === 'edit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">{t('edit.title')}</h2>
                <p className="text-text-secondary text-sm">{t('edit.description')}</p>
              </div>

              {!editFile ? (
                <Dropzone onDrop={(files) => handleSinglePdfSelect(files, 'edit')} accept="application/pdf">
                  <div className="text-red-400 text-4xl mb-3">PDF</div>
                  <p className="text-text-primary font-medium">{t('dropzone.title')}</p>
                  <p className="text-text-muted text-sm">{t('dropzone.subtitle')}</p>
                </Dropzone>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-red-500/20 rounded flex items-center justify-center text-red-400 text-xs font-bold">
                        PDF
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{editFile.name}</p>
                        <p className="text-text-muted text-sm">{editPages.length} {t('common.pages')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectAll}
                        className="px-3 py-1 text-sm text-text-muted hover:text-text-primary"
                      >
                        {t('edit.selectAll')}
                      </button>
                      <button
                        onClick={handleDeselectAll}
                        className="px-3 py-1 text-sm text-text-muted hover:text-text-primary"
                      >
                        {t('edit.deselectAll')}
                      </button>
                      {editPages.some((p) => p.selected) && (
                        <button
                          onClick={handleDeleteSelected}
                          className="px-3 py-1 text-sm text-red-400 hover:text-red-300"
                        >
                          {t('edit.delete')}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditFile(null)
                          setEditPages([])
                        }}
                        className="px-3 py-1 text-sm text-text-muted hover:text-red-400"
                      >
                        {t('common.clear')}
                      </button>
                    </div>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEditDragEnd}>
                    <SortableContext items={editPages.map((p) => p.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {editPages.map((page) => (
                          <SortablePageThumbnail
                            key={page.id}
                            page={page}
                            onRotate={handleRotatePage}
                            onToggleSelect={handleTogglePageSelect}
                            onDelete={handleDeletePage}
                            onPreview={(_, pageNum) => handlePreviewPage(pageNum)}
                            t={t}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <button
                    onClick={handleSaveEdit}
                    disabled={editPages.length === 0 || isProcessing}
                    className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                  >
                    {t('edit.saveChanges')}
                  </button>
                </>
              )}
            </div>
          )}

          {/* CONVERT TAB */}
          {activeTab === 'convert' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">{t('convert.title')}</h2>
              </div>

              {/* Convert mode toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setConvertMode('imagesToPdf')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    convertMode === 'imagesToPdf'
                      ? 'bg-primary text-white'
                      : 'bg-bg-darkest text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t('convert.imagesToPdf')}
                </button>
                <button
                  onClick={() => setConvertMode('pdfToImages')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    convertMode === 'pdfToImages'
                      ? 'bg-primary text-white'
                      : 'bg-bg-darkest text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t('convert.pdfToImages')}
                </button>
              </div>

              {convertMode === 'imagesToPdf' ? (
                <>
                  <Dropzone onDrop={handleImagesSelect} accept="image/*" multiple>
                    <div className="text-green-400 text-4xl mb-3">IMG</div>
                    <p className="text-text-primary font-medium">{t('convert.addImages')}</p>
                    <p className="text-text-muted text-sm">PNG, JPG, WebP</p>
                  </Dropzone>

                  {convertImages.length > 0 && (
                    <>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {convertImages.map((img) => (
                          <div key={img.id} className="relative aspect-square group">
                            <img src={img.preview} alt="" className="w-full h-full object-cover rounded-lg" />
                            <button
                              onClick={() => {
                                URL.revokeObjectURL(img.preview)
                                setConvertImages((images) => images.filter((i) => i.id !== img.id))
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <div>
                          <label className="text-text-secondary text-sm block mb-1">{t('convert.pageSize')}</label>
                          <select
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value as PageSize)}
                            className="px-3 py-2 bg-bg-darkest border border-border rounded-lg text-text-primary"
                          >
                            <option value="a4">{t('convert.a4')}</option>
                            <option value="letter">{t('convert.letter')}</option>
                            <option value="fit">{t('convert.fitToImage')}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-text-secondary text-sm">{t('compress.outputFilename')}</label>
                        <input
                          type="text"
                          value={convertedPdfName}
                          onChange={(e) => setConvertedPdfName(e.target.value)}
                          className="w-full px-3 py-2 bg-bg-darkest border border-border rounded-lg text-text-primary focus:border-primary focus:outline-none"
                        />
                      </div>

                      {convertedPdfBlob && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-text-secondary text-sm">{t('convert.resultSize')}</p>
                              <p className="text-text-primary text-xl font-bold">{formatFileSize(convertedPdfBlob.size)}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handleImagesToPdf}
                          disabled={isProcessing || !convertedPdfName.trim()}
                          className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                        >
                          {t('convert.convertButton')}
                        </button>
                        {convertedPdfBlob && (
                          <button
                            onClick={() => downloadBlob(convertedPdfBlob, convertedPdfName || 'converted.pdf')}
                            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                          >
                            {t('common.download')}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {!convertPdf ? (
                    <Dropzone onDrop={(files) => handleSinglePdfSelect(files, 'convert')} accept="application/pdf">
                      <div className="text-red-400 text-4xl mb-3">PDF</div>
                      <p className="text-text-primary font-medium">{t('dropzone.title')}</p>
                      <p className="text-text-muted text-sm">{t('dropzone.subtitle')}</p>
                    </Dropzone>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-bg-darkest rounded-lg">
                        <div className="w-12 h-14 bg-red-500/20 rounded flex items-center justify-center text-red-400 font-bold">
                          PDF
                        </div>
                        <div className="flex-1">
                          <p className="text-text-primary font-medium">{convertPdf.name}</p>
                          <p className="text-text-muted text-sm">
                            {convertPdf.pageCount} {t('common.pages')} • {formatFileSize(convertPdf.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => setConvertPdf(null)}
                          className="text-text-muted hover:text-red-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div>
                          <label className="text-text-secondary text-sm block mb-1">{t('convert.outputFormat')}</label>
                          <select
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpg')}
                            className="px-3 py-2 bg-bg-darkest border border-border rounded-lg text-text-primary"
                          >
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                          </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <label className="text-text-secondary text-sm block mb-1">
                            {t('convert.quality')}: {outputQuality}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={outputQuality}
                            onChange={(e) => setOutputQuality(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-text-secondary text-sm">{t('compress.outputFilename')}</label>
                        <input
                          type="text"
                          value={convertedImagesName}
                          onChange={(e) => setConvertedImagesName(e.target.value)}
                          className="w-full px-3 py-2 bg-bg-darkest border border-border rounded-lg text-text-primary focus:border-primary focus:outline-none"
                        />
                      </div>

                      {convertedImagesBlob && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-text-secondary text-sm">{t('convert.resultSize')}</p>
                              <p className="text-text-primary text-xl font-bold">{formatFileSize(convertedImagesBlob.size)}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handlePdfToImages}
                          disabled={isProcessing || !convertedImagesName.trim()}
                          className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                        >
                          {t('convert.convertButton')}
                        </button>
                        {convertedImagesBlob && (
                          <button
                            onClick={() => downloadBlob(convertedImagesBlob, convertedImagesName || 'images.zip')}
                            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                          >
                            {t('common.download')}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* COMPRESS TAB */}
          {activeTab === 'compress' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">{t('compress.title')}</h2>
                <p className="text-text-secondary text-sm">{t('compress.description')}</p>
              </div>

              {!compressFile ? (
                <Dropzone onDrop={(files) => handleSinglePdfSelect(files, 'compress')} accept="application/pdf">
                  <div className="text-red-400 text-4xl mb-3">PDF</div>
                  <p className="text-text-primary font-medium">{t('dropzone.title')}</p>
                  <p className="text-text-muted text-sm">{t('dropzone.subtitle')}</p>
                </Dropzone>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 bg-bg-darkest rounded-lg">
                    <div className="w-12 h-14 bg-red-500/20 rounded flex items-center justify-center text-red-400 font-bold">
                      PDF
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{compressFile.name}</p>
                      <p className="text-text-muted text-sm">
                        {t('compress.originalSize')}: {formatFileSize(compressFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCompressFile(null)
                        setCompressedSize(null)
                        setCompressedBlob(null)
                      }}
                      className="text-text-muted hover:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-text-primary font-medium">{t('compress.level')}</p>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'medium', 'aggressive'] as CompressionLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setCompressionLevel(level)}
                          className={`p-3 rounded-lg border-2 transition-colors text-left ${
                            compressionLevel === level
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-border-light'
                          }`}
                        >
                          <p className="text-text-primary font-medium">{t(`compress.${level}`)}</p>
                          <p className="text-text-muted text-xs">{t(`compress.${level}Desc`)}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-bg-darkest rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveText}
                        onChange={(e) => setPreserveText(e.target.checked)}
                        className="w-5 h-5 accent-primary"
                      />
                      <div>
                        <p className="text-text-primary font-medium">{t('compress.preserveText')}</p>
                        <p className="text-text-muted text-xs">{t('compress.preserveTextDesc')}</p>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-text-secondary text-sm">{t('compress.outputFilename')}</label>
                    <input
                      type="text"
                      value={compressOutputName}
                      onChange={(e) => setCompressOutputName(e.target.value)}
                      className="w-full px-3 py-2 bg-bg-darkest border border-border rounded-lg text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  {compressedSize !== null && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-text-secondary text-sm">{t('compress.compressedSize')}</p>
                          <p className="text-text-primary text-xl font-bold">{formatFileSize(compressedSize)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-text-secondary text-sm">{t('compress.savings')}</p>
                          <p className="text-green-400 text-xl font-bold">
                            {Math.round((1 - compressedSize / compressFile.size) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleCompress}
                      disabled={isProcessing || !compressOutputName.trim()}
                      className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                    >
                      {t('compress.compressButton')}
                    </button>
                    {compressedBlob && (
                      <button
                        onClick={() => downloadBlob(compressedBlob, compressOutputName || 'compressed.pdf')}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                      >
                        {t('common.download')}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewPage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          onClick={() => { setPreviewPage(null); setPreviewZoom(1) }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4">
              {/* Zoom controls */}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 hover:bg-white/20 rounded"
                  title="Zoom out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm min-w-[4rem] text-center">{Math.round(previewZoom * 100)}%</span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1 hover:bg-white/20 rounded"
                  title="Zoom in"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={() => setPreviewZoom(1)}
                  className="p-1 hover:bg-white/20 rounded text-xs"
                  title="Reset zoom"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Page indicator */}
            <div className="text-sm">
              {t('edit.page')} {previewPage.pageNum} / {editPages.length}
            </div>

            {/* Close button */}
            <button
              onClick={() => { setPreviewPage(null); setPreviewZoom(1) }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image container */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {previewPage.loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white">{t('common.processing')}</p>
              </div>
            ) : (
              <img
                src={previewPage.image}
                alt={`${t('edit.page')} ${previewPage.pageNum}`}
                className="max-w-none transition-transform duration-200"
                style={{ transform: `scale(${previewZoom})` }}
              />
            )}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePreviewNav('prev') }}
            disabled={previewPage.pageNum <= 1 || previewPage.loading}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handlePreviewNav('next') }}
            disabled={previewPage.pageNum >= editPages.length || previewPage.loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
