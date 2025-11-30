// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import UrlTool from '@/components/tools/pages/UrlTool'

describe('UrlTool', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<UrlTool />)
      expect(screen.getByRole('heading', { name: /URL.*Encoder/i, level: 1 })).toBeInTheDocument()
    })

    it('should have input and output textareas', () => {
      render(<UrlTool />)
      const textareas = screen.getAllByRole('textbox')
      expect(textareas.length).toBe(2)
    })

    it('should have mode selector buttons', () => {
      render(<UrlTool />)
      expect(screen.getByRole('button', { name: /Encode URL/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Decode URL/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Encode Component/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Decode Component/i })).toBeInTheDocument()
    })

    it('should have action buttons', () => {
      render(<UrlTool />)
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Swap/i })).toBeInTheDocument()
    })

    it('should have Encode URL selected by default', () => {
      render(<UrlTool />)
      const encodeBtn = screen.getByRole('button', { name: /^Encode URL$/i })
      expect(encodeBtn).toHaveClass('bg-primary')
    })
  })

  describe('encodeURI Mode', () => {
    it('should encode URL with spaces', async () => {
      const user = userEvent.setup()
      render(<UrlTool />)

      const textareas = screen.getAllByRole('textbox')
      const input = textareas[0]
      await user.type(input, 'https://example.com/path with spaces')

      const encodeButtons = screen.getAllByRole('button', { name: /Encode/i })
      const encodeButton = encodeButtons[encodeButtons.length - 1]
      await user.click(encodeButton)

      await waitFor(() => {
        const output = textareas[1] as HTMLTextAreaElement
        expect(output.value).toContain('https://example.com/path%20with%20spaces')
      })
    })
  })

  describe('encodeURIComponent Mode', () => {
    it('should encode all special characters', async () => {
      const user = userEvent.setup()
      render(<UrlTool />)

      const encodeComponentBtn = screen.getByRole('button', { name: /Encode Component/i })
      await user.click(encodeComponentBtn)

      const textareas = screen.getAllByRole('textbox')
      const input = textareas[0]
      await user.type(input, 'hello=world&foo=bar')

      const encodeButtons = screen.getAllByRole('button', { name: /Encode/i })
      const encodeButton = encodeButtons[encodeButtons.length - 1]
      await user.click(encodeButton)

      await waitFor(() => {
        const output = textareas[1] as HTMLTextAreaElement
        expect(output.value).toContain('hello%3Dworld%26foo%3Dbar')
      })
    })
  })

  describe('decodeURI Mode', () => {
    it('should decode encoded URL', async () => {
      const user = userEvent.setup()
      render(<UrlTool />)

      const decodeBtn = screen.getByRole('button', { name: /^Decode URL$/i })
      await user.click(decodeBtn)

      const textareas = screen.getAllByRole('textbox')
      const input = textareas[0]
      await user.type(input, 'https://example.com/path%20with%20spaces')

      const decodeButtons = screen.getAllByRole('button', { name: /Decode/i })
      const decodeButton = decodeButtons[decodeButtons.length - 1]
      await user.click(decodeButton)

      await waitFor(() => {
        const output = textareas[1] as HTMLTextAreaElement
        expect(output.value).toContain('https://example.com/path with spaces')
      })
    })
  })

  describe('Clear Functionality', () => {
    it('should clear input and output', async () => {
      const user = userEvent.setup()
      render(<UrlTool />)

      const textareas = screen.getAllByRole('textbox')
      const input = textareas[0]
      await user.type(input, 'test input')

      const clearButton = screen.getByRole('button', { name: /Clear/i })
      await user.click(clearButton)

      expect(input).toHaveValue('')
    })
  })

  describe('Info Sections', () => {
    it('should display encodeURI info', () => {
      render(<UrlTool />)
      expect(screen.getAllByText(/encodeURI/i).length).toBeGreaterThan(0)
    })

    it('should display encodeURIComponent info', () => {
      render(<UrlTool />)
      expect(screen.getAllByText(/encodeURIComponent/i).length).toBeGreaterThan(0)
    })
  })
})
