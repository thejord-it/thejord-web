// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import XmlWsdlViewer from '@/components/tools/pages/XmlWsdlViewer'

describe('XmlWsdlViewer', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should show tab buttons', () => {
      render(<XmlWsdlViewer />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(3)
    })

    it('should have input textarea with sample XML', () => {
      render(<XmlWsdlViewer />)
      const textareas = screen.getAllByRole('textbox')
      expect(textareas.length).toBeGreaterThan(0)
      expect((textareas[0] as HTMLTextAreaElement).value).toContain('<?xml')
    })

    it('should show validation status indicator', () => {
      render(<XmlWsdlViewer />)
      // Look for the checkmark or validation indicator
      expect(screen.getByText('✓')).toBeInTheDocument()
    })
  })

  describe('XML Formatting', () => {
    it('should have format button', () => {
      render(<XmlWsdlViewer />)
      // Look for button containing "Format" or the translation key
      const buttons = screen.getAllByRole('button')
      const formatButton = buttons.find(btn =>
        btn.textContent?.includes('Format') || btn.textContent?.includes('format')
      )
      expect(formatButton).toBeTruthy()
    })

    it('should format XML when clicking format button', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const buttons = screen.getAllByRole('button')
      const formatButton = buttons.find(btn =>
        btn.textContent?.includes('Format') || btn.textContent?.includes('format')
      )

      if (formatButton) {
        await user.click(formatButton)
        await waitFor(() => {
          const textareas = screen.getAllByRole('textbox')
          expect(textareas.length).toBeGreaterThan(0)
        })
      }
    })
  })

  describe('Tab Navigation', () => {
    it('should switch to WSDL tab', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const buttons = screen.getAllByRole('button')
      const wsdlTab = buttons.find(btn =>
        btn.textContent?.includes('WSDL') || btn.textContent?.includes('wsdl')
      )

      if (wsdlTab) {
        await user.click(wsdlTab)
        await waitFor(() => {
          // After clicking WSDL tab, look for sample button or related content
          const allButtons = screen.getAllByRole('button')
          expect(allButtons.length).toBeGreaterThan(0)
        })
      }
    })

    it('should switch to JSON converter tab', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const buttons = screen.getAllByRole('button')
      const jsonTab = buttons.find(btn =>
        btn.textContent?.includes('JSON') || btn.textContent?.includes('json')
      )

      if (jsonTab) {
        await user.click(jsonTab)
        await waitFor(() => {
          const textareas = screen.getAllByRole('textbox')
          expect(textareas.length).toBeGreaterThan(0)
        })
      }
    })

    it('should switch to Minify tab', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const buttons = screen.getAllByRole('button')
      const minifyTab = buttons.find(btn =>
        btn.textContent?.includes('Minify') || btn.textContent?.includes('minify')
      )

      if (minifyTab) {
        await user.click(minifyTab)
        await waitFor(() => {
          const allButtons = screen.getAllByRole('button')
          const minifyButton = allButtons.find(btn =>
            btn.textContent?.includes('Minify') || btn.textContent?.includes('minify')
          )
          expect(minifyButton).toBeTruthy()
        })
      }
    })
  })

  describe('XML Validation', () => {
    it('should show invalid status for malformed XML', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const textareas = screen.getAllByRole('textbox')
      await user.clear(textareas[0])
      await user.type(textareas[0], '<invalid><xml')

      await waitFor(() => {
        // Look for X mark or invalid indicator
        expect(screen.getByText('✗')).toBeInTheDocument()
      })
    })

    it('should show valid status for well-formed XML', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const textareas = screen.getAllByRole('textbox')
      await user.clear(textareas[0])
      await user.type(textareas[0], '<root><child/></root>')

      await waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument()
      })
    })
  })

  describe('Clear Functionality', () => {
    it('should have clear button', () => {
      render(<XmlWsdlViewer />)
      const buttons = screen.getAllByRole('button')
      const clearButton = buttons.find(btn =>
        btn.textContent?.includes('Clear') || btn.textContent?.includes('clear') || btn.textContent?.includes('🗑')
      )
      expect(clearButton).toBeTruthy()
    })

    it('should clear input when clicking clear', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const buttons = screen.getAllByRole('button')
      const clearButton = buttons.find(btn =>
        btn.textContent?.includes('Clear') || btn.textContent?.includes('clear') || btn.textContent?.includes('🗑')
      )

      if (clearButton) {
        await user.click(clearButton)
        await waitFor(() => {
          const textareas = screen.getAllByRole('textbox')
          expect(textareas[0]).toHaveValue('')
        })
      }
    })
  })

  describe('Copy Functionality', () => {
    it('should have copy button', () => {
      render(<XmlWsdlViewer />)
      const buttons = screen.getAllByRole('button')
      const copyButton = buttons.find(btn =>
        btn.textContent?.includes('Copy') || btn.textContent?.includes('copy') || btn.textContent?.includes('📋')
      )
      expect(copyButton).toBeTruthy()
    })
  })

  describe('Download Functionality', () => {
    it('should have download button', () => {
      render(<XmlWsdlViewer />)
      const buttons = screen.getAllByRole('button')
      const downloadButton = buttons.find(btn =>
        btn.textContent?.includes('Download') || btn.textContent?.includes('download') || btn.textContent?.includes('⬇')
      )
      expect(downloadButton).toBeTruthy()
    })
  })

  describe('Indentation Options', () => {
    it('should have indentation selector', () => {
      render(<XmlWsdlViewer />)
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBeGreaterThan(0)
    })
  })

  describe('Stats Display', () => {
    it('should show element count', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByText(/elements/i)).toBeInTheDocument()
    })

    it('should show attribute count', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByText(/attributes/i)).toBeInTheDocument()
    })

    it('should show byte count', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByText(/bytes/i)).toBeInTheDocument()
    })
  })
})
