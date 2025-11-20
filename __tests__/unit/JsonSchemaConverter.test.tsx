// Jest globals - describe, it, expect
import {
  jsonToJsonSchema,
  validateJSON,
  type JsonSchemaOptions
} from '@/lib/tools/schema-generator'

describe('JSON Schema Generator', () => {
  describe('validateJSON', () => {
    it('validates correct JSON', () => {
      const result = validateJSON('{"name": "test"}')
      expect(result.valid).toBe(true)
      expect(result.parsed).toEqual({ name: 'test' })
    })

    it('rejects invalid JSON', () => {
      const result = validateJSON('{invalid}')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('handles empty string', () => {
      const result = validateJSON('')
      expect(result.valid).toBe(false)
    })
  })

  describe('jsonToJsonSchema', () => {
    it('generates schema for simple object', () => {
      const json = { name: 'John', age: 30 }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.$schema).toBeDefined()
      expect(schema.type).toBe('object')
      expect(schema.properties).toBeDefined()
      expect(schema.properties.name).toEqual({ type: 'string' })
      expect(schema.properties.age).toEqual({ type: 'integer' })
    })

    it('detects integer vs number types', () => {
      const json = { integer: 42, float: 3.14 }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.properties.integer.type).toBe('integer')
      expect(schema.properties.float.type).toBe('number')
    })

    it('handles nested objects', () => {
      const json = {
        user: {
          name: 'John',
          address: {
            city: 'New York'
          }
        }
      }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.properties.user.type).toBe('object')
      expect(schema.properties.user.properties.name.type).toBe('string')
      expect(schema.properties.user.properties.address.type).toBe('object')
      expect(schema.properties.user.properties.address.properties.city.type).toBe('string')
    })

    it('handles arrays', () => {
      const json = { tags: ['a', 'b', 'c'] }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.properties.tags.type).toBe('array')
      expect(schema.properties.tags.items).toEqual({ type: 'string' })
    })

    it('handles array of objects', () => {
      const json = { users: [{ name: 'John', age: 30 }] }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.properties.users.type).toBe('array')
      expect(schema.properties.users.items.type).toBe('object')
      expect(schema.properties.users.items.properties.name.type).toBe('string')
    })

    it('handles empty arrays', () => {
      const json = { tags: [] }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.properties.tags.type).toBe('array')
      expect(schema.properties.tags.items).toEqual({})
    })

    it('handles boolean values', () => {
      const json = { active: true }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.properties.active.type).toBe('boolean')
    })

    it('handles null values', () => {
      const json = { value: null }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.properties.value.type).toBe('null')
    })

    it('adds schema title when provided', () => {
      const json = { name: 'test' }
      const options: JsonSchemaOptions = { title: 'MySchema' }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.title).toBe('MySchema')
    })

    it('makes fields required when option enabled', () => {
      const json = { name: 'John', age: 30 }
      const options: JsonSchemaOptions = { makeRequired: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.required).toEqual(['name', 'age'])
    })

    it('does not require null fields', () => {
      const json = { name: 'John', middleName: null }
      const options: JsonSchemaOptions = { makeRequired: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.required).toEqual(['name'])
    })

    it('detects email format', () => {
      const json = { email: 'user@example.com' }
      const options: JsonSchemaOptions = { addFormatHints: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.properties.email.format).toBe('email')
    })

    it('detects URI format', () => {
      const json = { website: 'https://example.com' }
      const options: JsonSchemaOptions = { addFormatHints: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.properties.website.format).toBe('uri')
    })

    it('detects UUID format', () => {
      const json = { id: '550e8400-e29b-41d4-a716-446655440000' }
      const options: JsonSchemaOptions = { addFormatHints: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.properties.id.format).toBe('uuid')
    })

    it('detects date-time format', () => {
      const json = { created: '2025-11-17T15:30:00Z' }
      const options: JsonSchemaOptions = { addFormatHints: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.properties.created.format).toBe('date-time')
    })

    it('detects date format', () => {
      const json = { birthdate: '2025-11-17' }
      const options: JsonSchemaOptions = { addFormatHints: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.properties.birthdate.format).toBe('date')
    })

    it('detects IPv4 format', () => {
      const json = { ip: '192.168.1.1' }
      const options: JsonSchemaOptions = { addFormatHints: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.properties.ip.format).toBe('ipv4')
    })

    it('uses draft-07 schema when specified', () => {
      const json = { name: 'test' }
      const options: JsonSchemaOptions = { schemaVersion: 'draft-07' }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#')
    })

    it('uses draft-2020-12 schema by default', () => {
      const json = { name: 'test' }
      const schema: any = jsonToJsonSchema(json)

      expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema')
    })

    it('handles complex nested structure', () => {
      const json = {
        user: {
          name: 'John',
          email: 'john@example.com',
          age: 30,
          active: true,
          tags: ['developer', 'typescript'],
          address: {
            street: '123 Main St',
            city: 'New York',
            zipCode: '10001'
          }
        }
      }
      const options: JsonSchemaOptions = { makeRequired: true, addFormatHints: true }
      const schema: any = jsonToJsonSchema(json, options)

      expect(schema.type).toBe('object')
      expect(schema.properties.user.type).toBe('object')
      expect(schema.properties.user.properties.email.format).toBe('email')
      expect(schema.properties.user.properties.tags.type).toBe('array')
      expect(schema.properties.user.properties.address.type).toBe('object')
      expect(schema.properties.user.required).toContain('name')
      expect(schema.properties.user.required).toContain('email')
    })

    it('handles array as root type', () => {
      const json = [{ name: 'John' }, { name: 'Jane' }]
      const schema: any = jsonToJsonSchema(json)

      expect(schema.type).toBe('array')
      expect(schema.items.type).toBe('object')
      expect(schema.items.properties.name.type).toBe('string')
    })

    it('handles primitives as root type', () => {
      expect(jsonToJsonSchema('hello')).toMatchObject({ type: 'string' })
      expect(jsonToJsonSchema(42)).toMatchObject({ type: 'integer' })
      expect(jsonToJsonSchema(3.14)).toMatchObject({ type: 'number' })
      expect(jsonToJsonSchema(true)).toMatchObject({ type: 'boolean' })
      expect(jsonToJsonSchema(null)).toMatchObject({ type: 'null' })
    })
  })
})
