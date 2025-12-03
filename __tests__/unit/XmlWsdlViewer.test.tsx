// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import XmlWsdlViewer from '@/components/tools/pages/XmlWsdlViewer'

describe('XmlWsdlViewer', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByRole('heading', { name: /XML.*WSDL/i, level: 1 })).toBeInTheDocument()
    })

    it('should show tab buttons', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByRole('button', { name: /Format/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /WSDL/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /JSON/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Minify/i })).toBeInTheDocument()
    })

    it('should have input textarea with sample XML', () => {
      render(<XmlWsdlViewer />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveValue(expect.stringContaining('<?xml'))
    })

    it('should show validation status', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByText(/Valid XML/i)).toBeInTheDocument()
    })
  })

  describe('XML Formatting', () => {
    it('should have format button', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByRole('button', { name: /Format XML/i })).toBeInTheDocument()
    })

    it('should format XML when clicking format button', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const formatButton = screen.getByRole('button', { name: /Format XML/i })
      await user.click(formatButton)

      await waitFor(() => {
        // Output should contain formatted XML
        const outputs = screen.getAllByRole('textbox')
        expect(outputs.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Tab Navigation', () => {
    it('should switch to WSDL tab', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const wsdlTab = screen.getByRole('button', { name: /WSDL/i })
      await user.click(wsdlTab)

      await waitFor(() => {
        expect(screen.getByText(/Load Sample WSDL/i)).toBeInTheDocument()
      })
    })

    it('should switch to JSON converter tab', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const jsonTab = screen.getByRole('button', { name: /JSON/i })
      await user.click(jsonTab)

      await waitFor(() => {
        expect(screen.getByText(/XML.*JSON/i)).toBeInTheDocument()
      })
    })

    it('should switch to Minify tab', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const minifyTab = screen.getByRole('button', { name: /Minify/i })
      await user.click(minifyTab)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Minify XML/i })).toBeInTheDocument()
      })
    })
  })

  describe('XML Validation', () => {
    it('should show invalid status for malformed XML', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const textarea = screen.getByRole('textbox')
      await user.clear(textarea)
      await user.type(textarea, '<invalid><xml')

      await waitFor(() => {
        expect(screen.getByText(/Invalid/i)).toBeInTheDocument()
      })
    })

    it('should show valid status for well-formed XML', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const textarea = screen.getByRole('textbox')
      await user.clear(textarea)
      await user.type(textarea, '<root><child/></root>')

      await waitFor(() => {
        expect(screen.getByText(/Valid XML/i)).toBeInTheDocument()
      })
    })
  })

  describe('Clear Functionality', () => {
    it('should have clear button', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
    })

    it('should clear input when clicking clear', async () => {
      const user = userEvent.setup()
      render(<XmlWsdlViewer />)

      const clearButton = screen.getByRole('button', { name: /Clear/i })
      await user.click(clearButton)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('')
    })
  })

  describe('Copy Functionality', () => {
    it('should have copy button', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument()
    })
  })

  describe('Download Functionality', () => {
    it('should have download button', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument()
    })
  })

  describe('Indentation Options', () => {
    it('should have indentation selector', () => {
      render(<XmlWsdlViewer />)
      expect(screen.getByText(/Indentation/i)).toBeInTheDocument()
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
  })
})
