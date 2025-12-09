// Configuration for all tools - SEO metadata and routing

export interface ToolConfig {
  slug: string
  name: string
  description: string
  icon: string
  category: string
  keywords: string[]
  metaDescription: string
  component: string // Component filename
}

export const TOOLS: ToolConfig[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, minify and beautify JSON data with syntax highlighting',
    icon: '📄',
    category: 'Text Processing',
    keywords: ['json', 'formatter', 'validator', 'beautify', 'minify', 'syntax highlighting'],
    metaDescription: 'Free online JSON formatter and validator. Format, validate, minify JSON with syntax highlighting. Tree view, diff checker, convert to CSV/XML/YAML.',
    component: 'JsonFormatter'
  },
  {
    slug: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: '🔐',
    category: 'Encoding',
    keywords: ['base64', 'encode', 'decode', 'encryption', 'decoder', 'encoder'],
    metaDescription: 'Free Base64 encoder and decoder. Encode text to Base64 or decode Base64 to text instantly in your browser.',
    component: 'Base64Tool'
  },
  {
    slug: 'regex-tester',
    name: 'Regular Expression Tester',
    description: 'Test and debug regular expressions with real-time matching',
    icon: '🔍',
    category: 'Development',
    keywords: ['regex', 'regular expression', 'pattern matching', 'regexp', 'tester'],
    metaDescription: 'Test regular expressions online. Real-time regex testing with matches highlighting and explanation.',
    component: 'RegexTester'
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes',
    icon: '🔒',
    category: 'Security',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'checksum', 'generator'],
    metaDescription: 'Generate cryptographic hashes online. MD5, SHA-1, SHA-256, SHA-512 hash generator for text and files.',
    component: 'HashGenerator'
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components',
    icon: '🔗',
    category: 'Encoding',
    keywords: ['url', 'encoder', 'decoder', 'uri', 'percent encoding', 'escape'],
    metaDescription: 'Free URL encoder and decoder. Encode URLs for web use or decode encoded URLs instantly.',
    component: 'UrlTool'
  },
  {
    slug: 'markdown-converter',
    name: 'Markdown to HTML Converter',
    description: 'Convert Markdown to HTML with live preview',
    icon: '📝',
    category: 'Text Processing',
    keywords: ['markdown', 'html', 'converter', 'md', 'preview', 'editor'],
    metaDescription: 'Convert Markdown to HTML online. Live preview markdown editor with GitHub-flavored markdown support.',
    component: 'MarkdownConverter'
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    icon: '🎨',
    category: 'Design',
    keywords: ['color', 'converter', 'hex', 'rgb', 'hsl', 'color picker', 'palette'],
    metaDescription: 'Convert colors between HEX, RGB, and HSL formats. Color picker and palette generator for designers.',
    component: 'ColorConverter'
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs',
    icon: '📋',
    category: 'Text Processing',
    keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'filler', 'generator'],
    metaDescription: 'Generate Lorem Ipsum placeholder text. Customizable word, sentence, and paragraph generator.',
    component: 'LoremIpsumGenerator'
  },
  {
    slug: 'diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare texts and find differences side-by-side',
    icon: '⚖️',
    category: 'Development',
    keywords: ['diff', 'compare', 'difference', 'merge', 'text comparison'],
    metaDescription: 'Compare two texts and find differences. Side-by-side diff checker with highlighting.',
    component: 'DiffChecker'
  },
  {
    slug: 'cron-builder',
    name: 'Cron Expression Builder',
    description: 'Build and validate cron expressions visually',
    icon: '⏰',
    category: 'Development',
    keywords: ['cron', 'crontab', 'scheduler', 'expression', 'builder', 'validator'],
    metaDescription: 'Build cron expressions visually. Cron job scheduler with syntax validation and human-readable description.',
    component: 'CronBuilder'
  },
  {
    slug: 'json-schema',
    name: 'JSON Schema Converter',
    description: 'Generate JSON Schema from JSON data',
    icon: '📐',
    category: 'Development',
    keywords: ['json schema', 'validator', 'generator', 'swagger', 'openapi'],
    metaDescription: 'Generate JSON Schema from JSON. Automatic schema generation for API validation and documentation.',
    component: 'JsonSchemaConverter'
  },
  {
    slug: 'xml-wsdl-viewer',
    name: 'XML & WSDL Viewer',
    description: 'Format, validate, and parse XML and WSDL files',
    icon: '📄',
    category: 'Development',
    keywords: ['xml', 'wsdl', 'parser', 'validator', 'soap', 'web service', 'formatter'],
    metaDescription: 'Format, validate, and view XML and WSDL files online. XML formatter with WSDL parser and XML to JSON converter. 100% privacy-first.',
    component: 'XmlWsdlViewer'
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, edit, convert and compress PDF files',
    icon: '📑',
    category: 'Documents',
    keywords: ['pdf', 'merge', 'split', 'compress', 'convert', 'rotate', 'edit', 'images'],
    metaDescription: 'Free online PDF tools. Merge, split, compress, rotate and convert PDF files. Convert images to PDF and PDF to images. 100% privacy-first, works offline.',
    component: 'PdfTools'
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate and validate UUIDs (v1, v4)',
    icon: '🔑',
    category: 'Development',
    keywords: ['uuid', 'guid', 'unique id', 'generator', 'v4', 'v1', 'identifier'],
    metaDescription: 'Generate UUIDs online. Create UUID v1 (timestamp) and v4 (random) identifiers. Validate and parse existing UUIDs. 100% privacy-first.',
    component: 'UuidGenerator'
  },
]

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS.find(tool => tool.slug === slug)
}

export function getToolsByCategory(category: string): ToolConfig[] {
  return TOOLS.filter(tool => tool.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(TOOLS.map(t => t.category)))
}
