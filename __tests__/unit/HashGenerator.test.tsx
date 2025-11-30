// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import HashGenerator from '@/components/tools/pages/HashGenerator'

describe('HashGenerator', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<HashGenerator />)
      expect(screen.getByRole('heading', { name: /Hash.*Generator/i, level: 1 })).toBeInTheDocument()
    })

    it('should show algorithm buttons', () => {
      render(<HashGenerator />)
      expect(screen.getByRole('button', { name: /MD5/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /SHA256/i })).toBeInTheDocument()
    })

    it('should have input textarea', () => {
      render(<HashGenerator />)
      expect(screen.getByPlaceholderText(/Enter text to hash/i)).toBeInTheDocument()
    })

    it('should show HMAC toggle', () => {
      render(<HashGenerator />)
      expect(screen.getByText(/Use HMAC/i)).toBeInTheDocument()
    })
  })

  describe('Hash Generation', () => {
    it('should show hash results section after input', async () => {
      const user = userEvent.setup()
      render(<HashGenerator />)

      const input = screen.getByPlaceholderText(/Enter text to hash/i)
      await user.type(input, 'hello')

      await waitFor(() => {
        expect(screen.getByText(/Hash Results/i)).toBeInTheDocument()
      })
    })
  })

  describe('Algorithm Selection', () => {
    it('should have algorithm buttons', () => {
      render(<HashGenerator />)
      expect(screen.getByRole('button', { name: /SHA512/i })).toBeInTheDocument()
    })
  })

  describe('HMAC Mode', () => {
    it('should show HMAC key input when enabled', async () => {
      const user = userEvent.setup()
      render(<HashGenerator />)

      const hmacCheckbox = screen.getByRole('checkbox')
      await user.click(hmacCheckbox)

      expect(screen.getByPlaceholderText(/Enter secret key for HMAC/i)).toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    it('should have copy buttons when hash is generated', async () => {
      const user = userEvent.setup()
      render(<HashGenerator />)

      const input = screen.getByPlaceholderText(/Enter text to hash/i)
      await user.type(input, 'hello')

      await waitFor(() => {
        const copyButtons = screen.getAllByRole('button', { name: /Copy/i })
        expect(copyButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Clear Functionality', () => {
    it('should have clear button', () => {
      render(<HashGenerator />)
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
    })

    it('should clear input when clicking clear', async () => {
      const user = userEvent.setup()
      render(<HashGenerator />)

      const input = screen.getByPlaceholderText(/Enter text to hash/i)
      await user.type(input, 'test')

      const clearButton = screen.getByRole('button', { name: /Clear/i })
      await user.click(clearButton)

      expect(input).toHaveValue('')
    })
  })

  describe('Info Section', () => {
    it('should display about hashing section', () => {
      render(<HashGenerator />)
      expect(screen.getByText(/About Hashing/i)).toBeInTheDocument()
    })
  })
})
