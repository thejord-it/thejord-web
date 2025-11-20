import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Developer Tools - THEJORD',
  description: 'Free online developer tools: JSON formatter, Base64 encoder/decoder, RegEx tester, Hash generator, and more. Privacy-focused, 100% client-side processing.',
  keywords: ['developer tools', 'json formatter', 'base64', 'regex tester', 'hash generator', 'url encoder', 'markdown converter'],
  openGraph: {
    title: 'Free Developer Tools | THEJORD',
    description: 'Modern, fast, and free tools for developers. 100% client-side, privacy-focused.',
    type: 'website',
  },
}

const tools = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    icon: '📄',
    category: 'Text Processing'
  },
  {
    slug: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: '🔐',
    category: 'Encoding'
  },
  {
    slug: 'regex-tester',
    name: 'RegEx Tester',
    description: 'Test and debug regular expressions',
    icon: '🔍',
    category: 'Development'
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes',
    icon: '🔒',
    category: 'Security'
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs',
    icon: '🔗',
    category: 'Encoding'
  },
  {
    slug: 'markdown-converter',
    name: 'Markdown Converter',
    description: 'Convert Markdown to HTML and preview',
    icon: '📝',
    category: 'Text Processing'
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    icon: '🎨',
    category: 'Design'
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text',
    icon: '📋',
    category: 'Text Processing'
  },
  {
    slug: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare and find differences between texts',
    icon: '⚖️',
    category: 'Development'
  },
  {
    slug: 'cron-builder',
    name: 'Cron Expression Builder',
    description: 'Build and validate cron expressions',
    icon: '⏰',
    category: 'Development'
  },
  {
    slug: 'json-schema',
    name: 'JSON Schema Converter',
    description: 'Generate JSON Schema from JSON',
    icon: '📐',
    category: 'Development'
  },
]

export default function ToolsPage() {
  // Group tools by category
  const categories = Array.from(new Set(tools.map(t => t.category)))

  return (
    <div className="min-h-screen bg-bg-darkest">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Developer Tools
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl">
            Free, fast, and privacy-focused tools for developers. All processing happens in your browser - your data never leaves your device.
          </p>
        </div>

        {/* Tools Grid by Category */}
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-l-4 border-primary pl-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool.category === category)
                .map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group bg-bg-dark border border-border hover:border-primary rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="text-4xl mb-4">{tool.icon}</div>
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {tool.description}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        ))}

        {/* Features */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Why Use Our Tools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Privacy First</h3>
              <p className="text-text-secondary text-sm">
                All processing happens in your browser. Your data never touches our servers.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Lightning Fast</h3>
              <p className="text-text-secondary text-sm">
                No server round-trips means instant results, even with large files.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">100% Free</h3>
              <p className="text-text-secondary text-sm">
                No subscriptions, no limits, no ads. Free forever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
