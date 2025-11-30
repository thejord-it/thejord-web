import { getIconEmoji, ICON_OPTIONS } from '@/lib/icons'

describe('Icons', () => {
  describe('ICON_OPTIONS', () => {
    it('should have icons defined', () => {
      expect(ICON_OPTIONS.length).toBeGreaterThan(0)
    })

    it('should have unique IDs', () => {
      const ids = ICON_OPTIONS.map(i => i.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have all required properties', () => {
      ICON_OPTIONS.forEach(icon => {
        expect(icon).toHaveProperty('id')
        expect(icon).toHaveProperty('emoji')
        expect(icon).toHaveProperty('label')
        expect(icon).toHaveProperty('category')
      })
    })
  })

  describe('getIconEmoji', () => {
    it('should return emoji for valid icon ID', () => {
      expect(getIconEmoji('lock')).toBe('🔐')
      expect(getIconEmoji('rocket')).toBe('🚀')
      expect(getIconEmoji('code')).toBe('💻')
    })

    it('should return null for invalid icon ID', () => {
      expect(getIconEmoji('nonexistent')).toBeNull()
      expect(getIconEmoji('invalid-id')).toBeNull()
    })

    it('should return null for null/undefined', () => {
      expect(getIconEmoji(null)).toBeNull()
      expect(getIconEmoji(undefined)).toBeNull()
    })

    it('should return null for empty string', () => {
      expect(getIconEmoji('')).toBeNull()
    })
  })
})
