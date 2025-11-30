// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import RegexTester from '@/components/tools/pages/RegexTester'

describe('RegexTester', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<RegexTester />)
      expect(screen.getByRole('heading', { name: /RegExp.*Tester/i, level: 1 })).toBeInTheDocument()
    })

    it('should have pattern input', () => {
      render(<RegexTester />)
      expect(screen.getByPlaceholderText(/Enter your regex pattern/i)).toBeInTheDocument()
    })

    it('should have test string textarea', () => {
      render(<RegexTester />)
      expect(screen.getByPlaceholderText(/Enter text to test/i)).toBeInTheDocument()
    })

    it('should display flag buttons', () => {
      render(<RegexTester />)
      expect(screen.getByTitle(/Global/i)).toBeInTheDocument()
      expect(screen.getByTitle(/Case insensitive/i)).toBeInTheDocument()
      expect(screen.getByTitle(/Multiline/i)).toBeInTheDocument()
    })

    it('should display pattern library section', () => {
      render(<RegexTester />)
      expect(screen.getByText(/Pattern Library/i)).toBeInTheDocument()
    })

    it('should have pattern search input', () => {
      render(<RegexTester />)
      expect(screen.getByPlaceholderText(/Search patterns/i)).toBeInTheDocument()
    })
  })

  describe('Pattern Matching', () => {
    it('should find matches for simple pattern', async () => {
      const user = userEvent.setup()
      render(<RegexTester />)

      const patternInput = screen.getByPlaceholderText(/Enter your regex pattern/i)
      await user.type(patternInput, 'test')

      const testInput = screen.getByPlaceholderText(/Enter text to test/i)
      await user.type(testInput, 'this is a test string')

      await waitFor(() => {
        expect(screen.getByText(/Matches found/i)).toBeInTheDocument()
      })
    })

    it('should display match details', async () => {
      const user = userEvent.setup()
      render(<RegexTester />)

      const patternInput = screen.getByPlaceholderText(/Enter your regex pattern/i)
      await user.type(patternInput, 'hello')

      const testInput = screen.getByPlaceholderText(/Enter text to test/i)
      await user.type(testInput, 'hello world')

      await waitFor(() => {
        expect(screen.getByText(/Match Details/i)).toBeInTheDocument()
      })
    })
  })

  describe('Flag Toggling', () => {
    it('should toggle case insensitive flag', async () => {
      const user = userEvent.setup()
      render(<RegexTester />)

      const iButton = screen.getByTitle(/Case insensitive/i)
      await user.click(iButton)
      expect(iButton).toHaveClass('bg-primary')
    })
  })


  describe('Pattern Library', () => {
    it('should display category buttons', () => {
      render(<RegexTester />)
      expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument()
    })

    it('should search patterns by name', async () => {
      const user = userEvent.setup()
      render(<RegexTester />)

      const searchInput = screen.getByPlaceholderText(/Search patterns/i)
      await user.type(searchInput, 'email')

      await waitFor(() => {
        const emailPatterns = screen.queryAllByText(/email/i)
        expect(emailPatterns.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Highlighted Matches', () => {
    it('should show highlighted matches section', async () => {
      const user = userEvent.setup()
      render(<RegexTester />)

      const patternInput = screen.getByPlaceholderText(/Enter your regex pattern/i)
      await user.type(patternInput, 'test')

      const testInput = screen.getByPlaceholderText(/Enter text to test/i)
      await user.type(testInput, 'this is a test')

      await waitFor(() => {
        expect(screen.getByText(/Highlighted Matches/i)).toBeInTheDocument()
      })
    })
  })
})
