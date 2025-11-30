// Jest globals - describe, it, expect
import {
  validateJSON,
  formatJSON,
  minifyJSON,
  getJSONStats,
  type FormatOptions
} from '@/lib/tools/json-utils'

describe('JSON Utils', () => {
  describe('validateJSON', () => {
    it('validates correct JSON object', () => {
      const result = validateJSON('{"name": "test"}')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('validates correct JSON array', () => {
      const result = validateJSON('[1, 2, 3]')
      expect(result.valid).toBe(true)
    })

    it('validates nested JSON', () => {
      const result = validateJSON('{"user": {"name": "John", "age": 30}}')
      expect(result.valid).toBe(true)
    })

    it('rejects empty input', () => {
      const result = validateJSON('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Empty input')
    })

    it('rejects whitespace only input', () => {
      const result = validateJSON('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Empty input')
    })

    it('rejects invalid JSON with missing brace', () => {
      const result = validateJSON('{"name": "test"')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('rejects invalid JSON with trailing comma', () => {
      const result = validateJSON('{"name": "test",}')
      expect(result.valid).toBe(false)
    })

    it('provides line and column for errors', () => {
      const result = validateJSON('{\n  "name": invalid\n}')
      expect(result.valid).toBe(false)
      expect(result.line).toBeDefined()
    })

    it('handles null values in JSON', () => {
      const result = validateJSON('{"value": null}')
      expect(result.valid).toBe(true)
    })

    it('handles boolean values', () => {
      const result = validateJSON('{"active": true, "deleted": false}')
      expect(result.valid).toBe(true)
    })
  })

  describe('formatJSON', () => {
    const defaultOptions: FormatOptions = {
      indent: 2,
      sortKeys: false,
      trailingComma: false,
      quoteStyle: 'double',
      maxLineLength: 80
    }

    it('formats JSON with default indent', () => {
      const result = formatJSON('{"name":"test"}', defaultOptions)
      expect(result).toContain('\n')
      expect(result).toContain('  ')
    })

    it('formats with custom indent', () => {
      const options = { ...defaultOptions, indent: 4 }
      const result = formatJSON('{"name":"test"}', options)
      expect(result).toContain('    ')
    })

    it('sorts keys when sortKeys is true', () => {
      const options = { ...defaultOptions, sortKeys: true }
      const result = formatJSON('{"z":1,"a":2}', options)
      const lines = result.split('\n')
      const aIndex = lines.findIndex(l => l.includes('"a"'))
      const zIndex = lines.findIndex(l => l.includes('"z"'))
      expect(aIndex).toBeLessThan(zIndex)
    })

    it('converts to single quotes when quoteStyle is single', () => {
      const options = { ...defaultOptions, quoteStyle: 'single' as const }
      const result = formatJSON('{"name":"test"}', options)
      expect(result).toContain("'")
    })

    it('throws error for invalid JSON', () => {
      expect(() => formatJSON('invalid', defaultOptions)).toThrow('Invalid JSON')
    })

    it('handles nested objects', () => {
      const result = formatJSON('{"user":{"name":"John"}}', defaultOptions)
      expect(result.split('\n').length).toBeGreaterThan(3)
    })

    it('handles arrays', () => {
      const result = formatJSON('[1,2,3]', defaultOptions)
      expect(result).toContain('[')
      expect(result).toContain(']')
    })

    it('sorts nested object keys', () => {
      const options = { ...defaultOptions, sortKeys: true }
      const result = formatJSON('{"outer":{"z":1,"a":2}}', options)
      expect(result.indexOf('"a"')).toBeLessThan(result.indexOf('"z"'))
    })
  })

  describe('minifyJSON', () => {
    it('minifies formatted JSON', () => {
      const formatted = '{\n  "name": "test"\n}'
      const result = minifyJSON(formatted)
      expect(result).toBe('{"name":"test"}')
    })

    it('removes all whitespace', () => {
      const result = minifyJSON('{  "a"  :  1  }')
      expect(result).not.toContain(' ')
    })

    it('throws error for invalid JSON', () => {
      expect(() => minifyJSON('invalid')).toThrow('Invalid JSON')
    })

    it('handles arrays', () => {
      const result = minifyJSON('[ 1 , 2 , 3 ]')
      expect(result).toBe('[1,2,3]')
    })

    it('preserves strings with spaces', () => {
      const result = minifyJSON('{"name": "hello world"}')
      expect(result).toContain('hello world')
    })
  })

  describe('getJSONStats', () => {
    it('counts objects correctly', () => {
      const result = getJSONStats('{"a": {"b": {}}}')
      expect(result.objects).toBe(3)
    })

    it('counts arrays correctly', () => {
      const result = getJSONStats('[[], []]')
      expect(result.arrays).toBe(3)
    })

    it('counts keys correctly', () => {
      const result = getJSONStats('{"a": 1, "b": 2, "c": 3}')
      expect(result.keys).toBe(3)
    })

    it('calculates size in bytes', () => {
      const json = '{"name": "test"}'
      const result = getJSONStats(json)
      expect(result.size).toBeGreaterThan(0)
    })

    it('returns zeros for invalid JSON', () => {
      const result = getJSONStats('invalid')
      expect(result.size).toBe(0)
      expect(result.objects).toBe(0)
      expect(result.arrays).toBe(0)
      expect(result.keys).toBe(0)
    })

    it('handles mixed nested structures', () => {
      const result = getJSONStats('{"users": [{"name": "John"}]}')
      expect(result.objects).toBe(2)
      expect(result.arrays).toBe(1)
      expect(result.keys).toBe(2)
    })

    it('handles empty object', () => {
      const result = getJSONStats('{}')
      expect(result.objects).toBe(1)
      expect(result.keys).toBe(0)
    })

    it('handles empty array', () => {
      const result = getJSONStats('[]')
      expect(result.arrays).toBe(1)
      expect(result.objects).toBe(0)
    })
  })
})
