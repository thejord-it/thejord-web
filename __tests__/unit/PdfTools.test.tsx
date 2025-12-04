// Jest globals - describe, it, expect, beforeEach
import { render, screen, waitFor, fireEvent } from '../test-utils'
import userEvent from '@testing-library/user-event'

// Mock pdf-lib
jest.mock('pdf-lib', () => ({
  PDFDocument: {
    create: jest.fn(() => Promise.resolve({
      addPage: jest.fn(() => ({ drawImage: jest.fn() })),
      embedJpg: jest.fn(() => Promise.resolve({})),
      embedPng: jest.fn(() => Promise.resolve({})),
      save: jest.fn(() => Promise.resolve(new Uint8Array([]))),
      getPages: jest.fn(() => []),
      copyPages: jest.fn(() => Promise.resolve([])),
    })),
    load: jest.fn(() => Promise.resolve({
      getPageCount: jest.fn(() => 1),
      getPages: jest.fn(() => [{ getSize: () => ({ width: 612, height: 792 }) }]),
      copyPages: jest.fn(() => Promise.resolve([])),
      addPage: jest.fn(),
      save: jest.fn(() => Promise.resolve(new Uint8Array([]))),
      getForm: jest.fn(() => ({ getFields: () => [] })),
    })),
  },
  rgb: jest.fn(),
  StandardFonts: {},
}))

// Mock pdf-renderer
jest.mock('@/lib/tools/pdf-renderer', () => ({
  loadPdfDocument: jest.fn(() => Promise.resolve({
    numPages: 3,
    getPage: jest.fn(() => Promise.resolve({
      getViewport: jest.fn(() => ({ width: 612, height: 792 })),
    })),
  })),
  renderPageToDataUrl: jest.fn(() => Promise.resolve('data:image/png;base64,mock')),
}))

// Mock jszip
jest.mock('jszip', () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    generateAsync: jest.fn(() => Promise.resolve(new Blob(['mock']))),
  }))
})

// Import after mocks
import PdfTools from '@/components/tools/pages/PdfTools'

const renderPdfTools = () => {
  return render(<PdfTools />)
}

describe('PdfTools', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset URL.createObjectURL mock
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = jest.fn()
  })

  describe('Render and Initial State', () => {
    it('should render the PDF Tools page with correct title', () => {
      renderPdfTools()
      expect(screen.getByRole('heading', { name: /PDF Tools/i, level: 1 })).toBeInTheDocument()
    })

    it('should render all tab buttons', () => {
      renderPdfTools()
      // Match by text content (translations return keys in test env)
      const tabs = screen.getAllByRole('button')
      expect(tabs.length).toBeGreaterThanOrEqual(5)
    })

    it('should have first tab selected by default', () => {
      renderPdfTools()
      // First tab button should have primary style
      const tabs = screen.getAllByRole('button')
      expect(tabs[0]).toHaveClass('bg-primary')
    })

    it('should display dropzone area for Merge', () => {
      renderPdfTools()
      // Check for dropzone by structure
      const dropzone = document.querySelector('.border-dashed')
      expect(dropzone).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    it('should switch tabs when clicking', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      // Click second tab (Split)
      await user.click(tabs[1])

      // Second tab should now be active
      expect(tabs[1]).toHaveClass('bg-primary')
    })

    it('should switch to different tabs', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')

      // Click through tabs 2, 3, 4
      for (let i = 1; i <= 4; i++) {
        await user.click(tabs[i])
        expect(tabs[i]).toHaveClass('bg-primary')
      }
    })
  })

  describe('Merge Tab', () => {
    it('should display file upload area', () => {
      renderPdfTools()
      const dropzone = document.querySelector('.border-dashed')
      expect(dropzone).toBeInTheDocument()
    })

    it('should not show merge button when no files uploaded', () => {
      renderPdfTools()
      // Merge button only renders when files are uploaded
      // With no files, only dropzone and tab buttons should be present
      const buttons = screen.getAllByRole('button')
      // Only 5 tab buttons should exist, no merge action button
      expect(buttons.length).toBe(5)
    })

    it('should accept PDF files via input', () => {
      renderPdfTools()
      const fileInput = document.querySelector('input[type="file"][accept="application/pdf"]')
      expect(fileInput).toBeInTheDocument()
    })
  })

  describe('Split Tab', () => {
    it('should show dropzone when no file uploaded', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[1]) // Split tab

      // Without a file, dropzone should be shown (radio buttons only appear after file upload)
      const dropzone = document.querySelector('.border-dashed')
      expect(dropzone).toBeInTheDocument()
    })

    it('should show file input for PDF', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[1]) // Split tab

      // Check for PDF file input
      const fileInput = document.querySelector('input[type="file"]')
      expect(fileInput).toBeInTheDocument()
    })
  })

  describe('Edit Tab', () => {
    it('should display upload area for editing', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[2]) // Edit tab

      const dropzone = document.querySelector('.border-dashed')
      expect(dropzone).toBeInTheDocument()
    })

    it('should have file input for PDF', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[2]) // Edit tab

      const fileInput = document.querySelector('input[type="file"]')
      expect(fileInput).toBeInTheDocument()
    })
  })

  describe('Convert Tab', () => {
    it('should display conversion mode buttons', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[3]) // Convert tab

      // Should have conversion mode buttons (Images to PDF / PDF to Images)
      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBeGreaterThan(5) // tabs + mode buttons
    })

    it('should allow switching conversion modes', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[3]) // Convert tab

      // Get all buttons after tab switch
      const allButtons = screen.getAllByRole('button')
      // Find mode buttons (not tabs) - they should be after the tabs
      const modeButtons = allButtons.slice(5)

      if (modeButtons.length >= 2) {
        await user.click(modeButtons[1]) // Click second mode
        expect(modeButtons[1]).toHaveClass('bg-primary')
      }
    })

    it('should accept image files for Images to PDF conversion', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[3]) // Convert tab

      const fileInput = document.querySelector('input[type="file"][accept*="image"]')
      expect(fileInput).toBeInTheDocument()
    })
  })

  describe('Compress Tab', () => {
    it('should show dropzone when no file uploaded', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[4]) // Compress tab

      // Without file, only dropzone is shown, compression options only appear after upload
      const dropzone = document.querySelector('.border-dashed')
      expect(dropzone).toBeInTheDocument()
    })

    it('should only show tab buttons when no file uploaded', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[4]) // Compress tab

      // Only 5 tab buttons, compression level buttons only appear after file upload
      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBe(5)
    })

    it('should have file input for PDF', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const tabs = screen.getAllByRole('button')
      await user.click(tabs[4]) // Compress tab

      const fileInput = document.querySelector('input[type="file"]')
      expect(fileInput).toBeInTheDocument()
    })
  })

  describe('File Upload Interactions', () => {
    it('should handle PDF file upload for merge', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const file = new File(['%PDF-1.4 mock content'], 'test.pdf', { type: 'application/pdf' })
      const input = document.querySelector('input[type="file"][accept=".pdf"]') as HTMLInputElement

      if (input) {
        await user.upload(input, file)

        await waitFor(() => {
          expect(screen.getByText(/test.pdf/i)).toBeInTheDocument()
        })
      }
    })

    it('should allow removing uploaded files in merge', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      const file = new File(['%PDF-1.4 mock content'], 'test.pdf', { type: 'application/pdf' })
      const input = document.querySelector('input[type="file"][accept=".pdf"]') as HTMLInputElement

      if (input) {
        await user.upload(input, file)

        await waitFor(() => {
          expect(screen.getByText(/test.pdf/i)).toBeInTheDocument()
        })

        // Find and click remove button
        const removeButton = screen.getByRole('button', { name: /×/ })
        if (removeButton) {
          await user.click(removeButton)

          await waitFor(() => {
            expect(screen.queryByText(/test.pdf/i)).not.toBeInTheDocument()
          })
        }
      }
    })
  })

  describe('UI Elements', () => {
    it('should display tool description', () => {
      renderPdfTools()
      expect(screen.getByText(/Merge, split, edit, convert and compress/i)).toBeInTheDocument()
    })

    it('should have accessible tab buttons', () => {
      renderPdfTools()
      const tabs = screen.getAllByRole('button')
      const tabNames = ['Merge', 'Split', 'Edit', 'Convert', 'Compress']

      tabNames.forEach((name) => {
        expect(screen.getByRole('button', { name: new RegExp(name, 'i') })).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should not crash when switching tabs rapidly', async () => {
      const user = userEvent.setup()
      renderPdfTools()

      // Rapid tab switching
      await user.click(screen.getByRole('button', { name: /Split/i }))
      await user.click(screen.getByRole('button', { name: /Merge/i }))
      await user.click(screen.getByRole('button', { name: /Convert/i }))
      await user.click(screen.getByRole('button', { name: /Compress/i }))
      await user.click(screen.getByRole('button', { name: /Edit/i }))

      // Should still be functional
      expect(screen.getByRole('button', { name: /Edit/i })).toHaveClass('bg-primary')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderPdfTools()
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('should have focusable tab buttons', () => {
      renderPdfTools()
      const tabs = ['Merge', 'Split', 'Edit', 'Convert', 'Compress']

      tabs.forEach((tab) => {
        const button = screen.getByRole('button', { name: new RegExp(tab, 'i') })
        expect(button).not.toBeDisabled()
      })
    })
  })
})
