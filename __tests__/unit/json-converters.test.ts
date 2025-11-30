// Jest globals - describe, it, expect
import {
  jsonToCSV,
  jsonToXML,
  jsonToYAML,
  jsonToTypeScript
} from '@/lib/tools/json-converters'

describe('JSON Converters', () => {
  describe('jsonToCSV', () => {
    it('converts simple object to CSV', () => {
      const result = jsonToCSV({ name: 'John', age: 30 })
      expect(result).toContain('name')
      expect(result).toContain('John')
    })

    it('converts array of objects to CSV', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ]
      const result = jsonToCSV(data)
      const lines = result.split('\n')
      expect(lines.length).toBe(3)
    })

    it('returns empty string for empty array', () => {
      const result = jsonToCSV([])
      expect(result).toBe('')
    })

    it('escapes values with commas', () => {
      const result = jsonToCSV({ text: 'hello, world' })
      expect(result).toContain('"hello, world"')
    })

    it('handles null values', () => {
      const result = jsonToCSV({ value: null })
      expect(result).toContain('value')
    })

    it('handles nested objects as JSON strings', () => {
      const result = jsonToCSV({ data: { nested: true } })
      expect(result).toContain('{')
    })
  })

  describe('jsonToXML', () => {
    it('converts simple object to XML', () => {
      const result = jsonToXML({ name: 'John' })
      expect(result).toContain('<?xml version="1.0"')
      expect(result).toContain('<name>John</name>')
    })

    it('uses custom root name', () => {
      const result = jsonToXML({ name: 'John' }, 'person')
      expect(result).toContain('<person>')
      expect(result).toContain('</person>')
    })

    it('handles nested objects', () => {
      const result = jsonToXML({ user: { name: 'John' } })
      expect(result).toContain('<user>')
      expect(result).toContain('<name>John</name>')
    })

    it('handles arrays', () => {
      const result = jsonToXML({ items: [1, 2, 3] })
      expect(result).toContain('<item>')
    })

    it('escapes special XML characters', () => {
      const result = jsonToXML({ text: '<test>' })
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
    })

    it('escapes ampersands', () => {
      const result = jsonToXML({ text: 'a & b' })
      expect(result).toContain('&amp;')
    })

    it('handles boolean values', () => {
      const result = jsonToXML({ active: true })
      expect(result).toContain('<active>true</active>')
    })

    it('handles number values', () => {
      const result = jsonToXML({ count: 42 })
      expect(result).toContain('<count>42</count>')
    })
  })

  describe('jsonToYAML', () => {
    it('converts simple object to YAML', () => {
      const result = jsonToYAML({ name: 'John' })
      expect(result).toContain('name: John')
    })

    it('handles nested objects', () => {
      const result = jsonToYAML({ user: { name: 'John' } })
      expect(result).toContain('user:')
      expect(result).toContain('name: John')
    })

    it('handles arrays', () => {
      const result = jsonToYAML({ items: [1, 2, 3] })
      expect(result).toContain('- 1')
      expect(result).toContain('- 2')
    })

    it('handles null values', () => {
      const result = jsonToYAML({ value: null })
      expect(result).toContain('null')
    })

    it('handles boolean values', () => {
      const result = jsonToYAML({ active: true, deleted: false })
      expect(result).toContain('true')
      expect(result).toContain('false')
    })

    it('handles empty objects', () => {
      const result = jsonToYAML({})
      expect(result).toBe('{}')
    })

    it('handles empty arrays', () => {
      const result = jsonToYAML({ items: [] })
      expect(result).toContain('[]')
    })

    it('uses custom indent', () => {
      const result = jsonToYAML({ user: { name: 'John' } }, 4)
      expect(result).toContain('    ')
    })
  })

  describe('jsonToTypeScript', () => {
    it('generates interface for simple object', () => {
      const result = jsonToTypeScript({ name: 'John', age: 30 })
      expect(result).toContain('interface Root')
      expect(result).toContain('name: string')
      expect(result).toContain('age: number')
    })

    it('uses custom interface name', () => {
      const result = jsonToTypeScript({ name: 'John' }, 'Person')
      expect(result).toContain('interface Person')
    })

    it('handles boolean type', () => {
      const result = jsonToTypeScript({ active: true })
      expect(result).toContain('active: boolean')
    })

    it('handles null type', () => {
      const result = jsonToTypeScript({ value: null })
      expect(result).toContain('value: null')
    })

    it('handles array type', () => {
      const result = jsonToTypeScript({ items: [1, 2, 3] })
      expect(result).toContain('items: number[]')
    })

    it('handles empty array', () => {
      const result = jsonToTypeScript({ items: [] })
      expect(result).toContain('items: any[]')
    })

    it('returns empty string for null input', () => {
      const result = jsonToTypeScript(null)
      expect(result).toBe('')
    })

    it('returns empty string for array input', () => {
      const result = jsonToTypeScript([1, 2, 3])
      expect(result).toBe('')
    })
  })
})
