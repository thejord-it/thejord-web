// Jest globals - describe, it, expect
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import LoremIpsumGenerator from '@/components/tools/pages/LoremIpsumGenerator'

describe('LoremIpsumGenerator', () => {
  describe('Render and Initial State', () => {
    it('should render with correct title', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('heading', { name: /Lorem Ipsum Generator/i, level: 1 })).toBeInTheDocument()
    })

    it('should have type selection buttons', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('button', { name: /Paragraphs/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sentences/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Words/i })).toBeInTheDocument()
    })

    it('should have paragraphs selected by default', () => {
      render(<LoremIpsumGenerator />)
      const paragraphsBtn = screen.getByRole('button', { name: /Paragraphs/i })
      expect(paragraphsBtn.className).toContain('from-purple-500')
    })

    it('should have count input', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    })

    it('should have Generate button', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('button', { name: /Generate Lorem Ipsum/i })).toBeInTheDocument()
    })

    it('should have Copy button', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument()
    })

    it('should have Clear button', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
    })

    it('should have start with Lorem checkbox', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByText(/Start with/i)).toBeInTheDocument()
    })
  })

  describe('Generate Functionality', () => {
    it('should generate text when Generate is clicked', async () => {
      const user = userEvent.setup()
      render(<LoremIpsumGenerator />)

      const generateBtn = screen.getByRole('button', { name: /Generate Lorem Ipsum/i })
      await user.click(generateBtn)

      const output = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(output.value.length).toBeGreaterThan(0)
    })

    it('should start with Lorem ipsum when option is enabled', async () => {
      const user = userEvent.setup()
      render(<LoremIpsumGenerator />)

      const generateBtn = screen.getByRole('button', { name: /Generate Lorem Ipsum/i })
      await user.click(generateBtn)

      const output = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(output.value).toContain('Lorem')
    })
  })

  describe('Type Selection', () => {
    it('should switch to sentences mode', async () => {
      const user = userEvent.setup()
      render(<LoremIpsumGenerator />)

      const sentencesBtn = screen.getByRole('button', { name: /Sentences/i })
      await user.click(sentencesBtn)

      expect(sentencesBtn.className).toContain('from-purple-500')
    })

    it('should switch to words mode', async () => {
      const user = userEvent.setup()
      render(<LoremIpsumGenerator />)

      const wordsBtn = screen.getByRole('button', { name: /Words/i })
      await user.click(wordsBtn)

      expect(wordsBtn.className).toContain('from-purple-500')
    })
  })

  describe('Clear Functionality', () => {
    it('should clear output when Clear is clicked', async () => {
      const user = userEvent.setup()
      render(<LoremIpsumGenerator />)

      const generateBtn = screen.getByRole('button', { name: /Generate Lorem Ipsum/i })
      await user.click(generateBtn)

      const output = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(output.value.length).toBeGreaterThan(0)

      const clearBtn = screen.getByRole('button', { name: /Clear/i })
      await user.click(clearBtn)

      expect(output.value).toBe('')
    })
  })

  describe('Copy Button', () => {
    it('should have copy button disabled when no output', () => {
      render(<LoremIpsumGenerator />)
      const copyBtn = screen.getByRole('button', { name: /Copy/i })
      expect(copyBtn).toBeDisabled()
    })

    it('should enable copy button after generating', async () => {
      const user = userEvent.setup()
      render(<LoremIpsumGenerator />)

      const generateBtn = screen.getByRole('button', { name: /Generate Lorem Ipsum/i })
      await user.click(generateBtn)

      const copyBtn = screen.getByRole('button', { name: /Copy/i })
      expect(copyBtn).not.toBeDisabled()
    })
  })

  describe('Stats Display', () => {
    it('should show characters count', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByText(/Characters/i)).toBeInTheDocument()
    })

    it('should show words count label', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getAllByText(/Words/i).length).toBeGreaterThan(0)
    })
  })

  describe('Info Section', () => {
    it('should display What is Lorem Ipsum section', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByText(/What is Lorem Ipsum/i)).toBeInTheDocument()
    })
  })

  describe('Generated Text Section', () => {
    it('should display Generated Text heading', () => {
      render(<LoremIpsumGenerator />)
      expect(screen.getByRole('heading', { name: /Generated Text/i })).toBeInTheDocument()
    })
  })
})
