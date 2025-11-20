export interface JsonSchemaOptions {
  title?: string
  makeRequired?: boolean
  addFormatHints?: boolean
  schemaVersion?: 'draft-2020-12' | 'draft-07'
}

const FORMAT_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uri: /^https?:\/\/.+/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  dateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}:\d{2}$/,
  ipv4: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ipv6: /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$/
}

function detectFormat(value: string): string | undefined {
  if (FORMAT_PATTERNS.email.test(value)) return 'email'
  if (FORMAT_PATTERNS.uri.test(value)) return 'uri'
  if (FORMAT_PATTERNS.uuid.test(value)) return 'uuid'
  if (FORMAT_PATTERNS.dateTime.test(value)) return 'date-time'
  if (FORMAT_PATTERNS.date.test(value)) return 'date'
  if (FORMAT_PATTERNS.time.test(value)) return 'time'
  if (FORMAT_PATTERNS.ipv4.test(value)) return 'ipv4'
  if (FORMAT_PATTERNS.ipv6.test(value)) return 'ipv6'
  return undefined
}

function detectType(value: any): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number'
  }
  return typeof value
}

function generatePropertySchema(value: any, options: JsonSchemaOptions, seen = new WeakSet()): any {
  const type = detectType(value)
  const propSchema: any = { type }

  // Detect circular references
  if (type === 'object' && value !== null && !Array.isArray(value)) {
    if (seen.has(value)) {
      return { type: 'object', description: 'Circular reference detected' }
    }
    seen.add(value)
  }

  // Add format hints for strings
  if (type === 'string' && options.addFormatHints) {
    const format = detectFormat(value)
    if (format) {
      propSchema.format = format
    }
  }

  // Handle objects
  if (type === 'object' && value !== null) {
    propSchema.properties = {}
    const required: string[] = []

    for (const [key, val] of Object.entries(value)) {
      propSchema.properties[key] = generatePropertySchema(val, options, seen)

      if (options.makeRequired && val !== null && val !== undefined) {
        required.push(key)
      }
    }

    if (required.length > 0) {
      propSchema.required = required
    }

    propSchema.additionalProperties = false
  }

  // Handle arrays
  if (type === 'array' && Array.isArray(value)) {
    if (value.length > 0) {
      // Try to infer type from first non-null element
      const firstNonNull = value.find(v => v !== null && v !== undefined)
      if (firstNonNull !== undefined) {
        propSchema.items = generatePropertySchema(firstNonNull, options, seen)
      } else {
        propSchema.items = {}
      }
    } else {
      propSchema.items = {}
    }
  }

  return propSchema
}

export function jsonToJsonSchema(json: any, options: JsonSchemaOptions = {}): object {
  const schemaUri = options.schemaVersion === 'draft-07'
    ? 'http://json-schema.org/draft-07/schema#'
    : 'https://json-schema.org/draft/2020-12/schema'

  const schema: any = {
    $schema: schemaUri,
    type: detectType(json)
  }

  if (options.title) {
    schema.title = options.title
  }

  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    schema.properties = {}
    const required: string[] = []

    for (const [key, value] of Object.entries(json)) {
      schema.properties[key] = generatePropertySchema(value, options)

      if (options.makeRequired && value !== null && value !== undefined) {
        required.push(key)
      }
    }

    if (required.length > 0) {
      schema.required = required
    }

    schema.additionalProperties = false
  }

  if (Array.isArray(json) && json.length > 0) {
    const firstNonNull = json.find(v => v !== null && v !== undefined)
    if (firstNonNull !== undefined) {
      schema.items = generatePropertySchema(firstNonNull, options)
    } else {
      schema.items = {}
    }
  }

  return schema
}

export function validateJSON(jsonString: string): { valid: boolean; error?: string; parsed?: any } {
  try {
    const parsed = JSON.parse(jsonString)
    return { valid: true, parsed }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON'
    }
  }
}
