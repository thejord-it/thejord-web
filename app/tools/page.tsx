import { Metadata } from 'next'
import ToolsSearch from '@/components/tools/ToolsSearch'

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
    icon: '{ }',
    color: 'from-blue-500 to-cyan-500',
    category: 'Text Processing'
  },
  {
    slug: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
    category: 'Encoding'
  },
  {
    slug: 'regex-tester',
    name: 'RegEx Tester',
    description: 'Test and debug regular expressions',
    icon: '.*',
    color: 'from-cyan-500 to-teal-500',
    category: 'Development'
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes',
    icon: '#',
    color: 'from-green-500 to-emerald-500',
    category: 'Security'
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs',
    icon: '%',
    color: 'from-orange-500 to-red-500',
    category: 'Encoding'
  },
  {
    slug: 'markdown-converter',
    name: 'Markdown Converter',
    description: 'Convert Markdown to HTML and preview',
    icon: 'MD',
    color: 'from-indigo-500 to-purple-500',
    category: 'Text Processing'
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    category: 'Design'
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text',
    icon: 'Aa',
    color: 'from-amber-500 to-orange-500',
    category: 'Text Processing'
  },
  {
    slug: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare and find differences between texts',
    icon: '+-',
    color: 'from-teal-500 to-cyan-500',
    category: 'Development'
  },
  {
    slug: 'cron-builder',
    name: 'Cron Expression Builder',
    description: 'Build and validate cron expressions',
    icon: '⏰',
    color: 'from-violet-500 to-purple-500',
    category: 'Development'
  },
  {
    slug: 'json-schema',
    name: 'JSON Schema Converter',
    description: 'Generate JSON Schema from JSON',
    icon: '{}',
    color: 'from-sky-500 to-blue-500',
    category: 'Development'
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-bg-darkest">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Developer Tools
          </h1>
          <p className="text-base md:text-xl text-text-secondary max-w-3xl">
            Free, fast, and privacy-focused tools for developers. All processing happens in your browser.
          </p>
        </div>

        <ToolsSearch tools={tools} />

        <div className="hidden md:block mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Why Use Our Tools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Privacy First</h3>
              <p className="text-text-secondary text-sm">
                All processing happens in your browser. Your data never touches our servers.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Lightning Fast</h3>
              <p className="text-text-secondary text-sm">
                No server round-trips means instant results, even with large files.
              </p>
            </div>
            <div className="text-center p-6">
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
