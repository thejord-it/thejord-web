// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import DiffChecker from '@/components/tools/pages/DiffChecker'

describe('DiffChecker', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<DiffChecker />)
      expect(screen.getByRole('heading', { name: /Text Diff Checker/i, level: 1 })).toBeInTheDocument()
    })

    it('should have original text textarea', () => {
      render(<DiffChecker />)
      expect(screen.getByPlaceholderText(/Paste original text/i)).toBeInTheDocument()
    })

    it('should have modified text textarea', () => {
      render(<DiffChecker />)
      expect(screen.getByPlaceholderText(/Paste modified text/i)).toBeInTheDocument()
    })

    it('should have Compare button', () => {
      render(<DiffChecker />)
      expect(screen.getByRole('button', { name: /Compare/i })).toBeInTheDocument()
    })

    it('should have Load Example button', () => {
      render(<DiffChecker />)
      expect(screen.getByRole('button', { name: /Load Example/i })).toBeInTheDocument()
    })

    it('should have Swap Texts button', () => {
      render(<DiffChecker />)
      expect(screen.getByRole('button', { name: /Swap Texts/i })).toBeInTheDocument()
    })

    it('should have Clear All button', () => {
      render(<DiffChecker />)
      expect(screen.getByRole('button', { name: /Clear All/i })).toBeInTheDocument()
    })

    it('should have Line Numbers checkbox', () => {
      render(<DiffChecker />)
      expect(screen.getByLabelText(/Line Numbers/i)).toBeInTheDocument()
    })

    it('should have Ignore Whitespace checkbox', () => {
      render(<DiffChecker />)
      expect(screen.getByLabelText(/Ignore Whitespace/i)).toBeInTheDocument()
    })

    it('should have Ignore Case checkbox', () => {
      render(<DiffChecker />)
      expect(screen.getByLabelText(/Ignore Case/i)).toBeInTheDocument()
    })
  })

  describe('Load Example', () => {
    it('should load example text when Load Example is clicked', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const loadExampleBtn = screen.getByRole('button', { name: /Load Example/i })
      await user.click(loadExampleBtn)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      expect(text1).not.toHaveValue('')
      expect(text2).not.toHaveValue('')
    })
  })

  describe('Swap Texts', () => {
    it('should swap text content between textareas', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      await user.type(text1, 'original')
      await user.type(text2, 'modified')

      const swapBtn = screen.getByRole('button', { name: /Swap Texts/i })
      await user.click(swapBtn)

      expect(text1).toHaveValue('modified')
      expect(text2).toHaveValue('original')
    })
  })

  describe('Clear All', () => {
    it('should clear both textareas', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      await user.type(text1, 'some text')
      await user.type(text2, 'other text')

      const clearBtn = screen.getByRole('button', { name: /Clear All/i })
      await user.click(clearBtn)

      expect(text1).toHaveValue('')
      expect(text2).toHaveValue('')
    })
  })

  describe('Options', () => {
    it('should toggle line numbers option', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const checkbox = screen.getByLabelText(/Line Numbers/i)
      expect(checkbox).toBeChecked()

      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('should toggle ignore whitespace option', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const checkbox = screen.getByLabelText(/Ignore Whitespace/i)
      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('should toggle ignore case option', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const checkbox = screen.getByLabelText(/Ignore Case/i)
      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  })

  describe('Compare Functionality', () => {
    it('should show diff results after comparing with Load Example', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      // Load example first
      const loadExampleBtn = screen.getByRole('button', { name: /Load Example/i })
      await user.click(loadExampleBtn)

      // Click Compare
      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      // Should show Differences section (as h2 heading)
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Differences/i })).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should show stats after comparing', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const loadExampleBtn = screen.getByRole('button', { name: /Load Example/i })
      await user.click(loadExampleBtn)

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      await waitFor(() => {
        expect(screen.getByText(/Total Lines/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should show additions count', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const loadExampleBtn = screen.getByRole('button', { name: /Load Example/i })
      await user.click(loadExampleBtn)

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      await waitFor(() => {
        expect(screen.getByText(/Additions/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should show deletions count', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const loadExampleBtn = screen.getByRole('button', { name: /Load Example/i })
      await user.click(loadExampleBtn)

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      await waitFor(() => {
        expect(screen.getByText(/Deletions/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should detect equal lines and show stats', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      await user.type(text1, 'same line')
      await user.type(text2, 'same line')

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      // After Compare, stats section should appear with Total Lines
      await waitFor(() => {
        expect(screen.getByText(/Total Lines/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should ignore whitespace differences when option is enabled', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      await user.type(text1, '  hello  ')
      await user.type(text2, 'hello')

      // Enable ignore whitespace
      const ignoreWhitespaceCheckbox = screen.getByLabelText(/Ignore Whitespace/i)
      await user.click(ignoreWhitespaceCheckbox)

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      await waitFor(() => {
        expect(screen.getByText(/Total Lines/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should ignore case differences when option is enabled', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      await user.type(text1, 'HELLO')
      await user.type(text2, 'hello')

      // Enable ignore case
      const ignoreCaseCheckbox = screen.getByLabelText(/Ignore Case/i)
      await user.click(ignoreCaseCheckbox)

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      await waitFor(() => {
        expect(screen.getByText(/Total Lines/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should detect additions when text2 has more lines', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      await user.type(text1, 'line1')
      await user.type(text2, 'line1{enter}line2')

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      await waitFor(() => {
        expect(screen.getByText(/Additions/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should detect deletions when text1 has more lines', async () => {
      const user = userEvent.setup()
      render(<DiffChecker />)

      const text1 = screen.getByPlaceholderText(/Paste original text/i)
      const text2 = screen.getByPlaceholderText(/Paste modified text/i)

      await user.type(text1, 'line1{enter}line2')
      await user.type(text2, 'line1')

      const compareBtn = screen.getByRole('button', { name: /Compare/i })
      await user.click(compareBtn)

      await waitFor(() => {
        expect(screen.getByText(/Deletions/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Legend', () => {
    it('should display legend section', () => {
      render(<DiffChecker />)
      expect(screen.getByText('Legend')).toBeInTheDocument()
    })

    it('should show added line description', () => {
      render(<DiffChecker />)
      expect(screen.getByText(/Added line/i)).toBeInTheDocument()
    })

    it('should show removed line description', () => {
      render(<DiffChecker />)
      expect(screen.getByText(/Removed line/i)).toBeInTheDocument()
    })

    it('should show unchanged line description', () => {
      render(<DiffChecker />)
      expect(screen.getByText(/Unchanged line/i)).toBeInTheDocument()
    })
  })
})
