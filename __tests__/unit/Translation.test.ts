import { generateSlug } from '@/lib/translation'

describe('Translation', () => {
  describe('generateSlug', () => {
    it('should generate slug from title', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
      expect(generateSlug('Test Post')).toBe('test-post')
    })

    it('should handle accented characters', () => {
      expect(generateSlug('Caffè italiano')).toBe('caffe-italiano')
      expect(generateSlug('Ñoño español')).toBe('nono-espanol')
    })

    it('should remove special characters', () => {
      expect(generateSlug('Hello! World?')).toBe('hello-world')
      expect(generateSlug('Test@Post#123')).toBe('test-post-123')
    })

    it('should add language suffix when provided', () => {
      expect(generateSlug('Hello World', 'en')).toBe('hello-world-en')
      expect(generateSlug('Ciao Mondo', 'it')).toBe('ciao-mondo-it')
    })

    it('should handle multiple spaces', () => {
      expect(generateSlug('Hello    World')).toBe('hello-world')
    })

    it('should trim leading/trailing dashes', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world')
      expect(generateSlug('---Hello---')).toBe('hello')
    })
  })
})
