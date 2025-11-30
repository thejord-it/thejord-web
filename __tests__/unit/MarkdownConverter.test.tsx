// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import MarkdownConverter from '@/components/tools/pages/MarkdownConverter'

describe('MarkdownConverter', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<MarkdownConverter />)
      expect(screen.getByRole('heading', { name: /Markdown to HTML Converter/i, level: 1 })).toBeInTheDocument()
    })

    it('should have markdown input textarea', () => {
      render(<MarkdownConverter />)
      expect(screen.getByPlaceholderText(/Enter your Markdown/i)).toBeInTheDocument()
    })

    it('should have HTML output textarea', () => {
      render(<MarkdownConverter />)
      expect(screen.getByPlaceholderText(/HTML will appear/i)).toBeInTheDocument()
    })

    it('should have Load Example button', () => {
      render(<MarkdownConverter />)
      expect(screen.getByRole('button', { name: /Load Example/i })).toBeInTheDocument()
    })

    it('should have Copy HTML button', () => {
      render(<MarkdownConverter />)
      expect(screen.getByRole('button', { name: /Copy HTML/i })).toBeInTheDocument()
    })

    it('should have Clear All button', () => {
      render(<MarkdownConverter />)
      expect(screen.getByRole('button', { name: /Clear All/i })).toBeInTheDocument()
    })

    it('should have Copy HTML button disabled initially', () => {
      render(<MarkdownConverter />)
      const copyBtn = screen.getByRole('button', { name: /Copy HTML/i })
      expect(copyBtn).toBeDisabled()
    })
  })


  describe('Load Example', () => {
    it('should load example markdown when button is clicked', async () => {
      const user = userEvent.setup()
      render(<MarkdownConverter />)

      const loadExampleBtn = screen.getByRole('button', { name: /Load Example/i })
      await user.click(loadExampleBtn)

      const input = screen.getByPlaceholderText(/Enter your Markdown/i) as HTMLTextAreaElement
      expect(input.value).toContain('# Markdown Example')
    })

    it('should enable Copy HTML button after loading example', async () => {
      const user = userEvent.setup()
      render(<MarkdownConverter />)

      const loadExampleBtn = screen.getByRole('button', { name: /Load Example/i })
      await user.click(loadExampleBtn)

      const copyBtn = screen.getByRole('button', { name: /Copy HTML/i })
      expect(copyBtn).not.toBeDisabled()
    })
  })

  describe('Clear All', () => {
    it('should clear markdown input', async () => {
      const user = userEvent.setup()
      render(<MarkdownConverter />)

      const input = screen.getByPlaceholderText(/Enter your Markdown/i)
      await user.type(input, '# Test')

      const clearBtn = screen.getByRole('button', { name: /Clear All/i })
      await user.click(clearBtn)

      expect(input).toHaveValue('')
    })
  })

  describe('Stats Display', () => {
    it('should show Markdown Length stat', () => {
      render(<MarkdownConverter />)
      expect(screen.getByText(/Markdown Length/i)).toBeInTheDocument()
    })

    it('should show HTML Length stat', () => {
      render(<MarkdownConverter />)
      expect(screen.getByText(/HTML Length/i)).toBeInTheDocument()
    })

    it('should show Lines stat', () => {
      render(<MarkdownConverter />)
      expect(screen.getAllByText(/Lines/i).length).toBeGreaterThan(0)
    })
  })

  describe('Help Section', () => {
    it('should display syntax reference', () => {
      render(<MarkdownConverter />)
      expect(screen.getByText(/Markdown Syntax Quick Reference/i)).toBeInTheDocument()
    })

    it('should show headers syntax', () => {
      render(<MarkdownConverter />)
      expect(screen.getByText(/# H1/i)).toBeInTheDocument()
    })
  })

  describe('Section Headings', () => {
    it('should display Markdown Input heading', () => {
      render(<MarkdownConverter />)
      expect(screen.getByRole('heading', { name: /Markdown Input/i })).toBeInTheDocument()
    })

    it('should display HTML Output heading', () => {
      render(<MarkdownConverter />)
      expect(screen.getByRole('heading', { name: /HTML Output/i })).toBeInTheDocument()
    })
  })
})
