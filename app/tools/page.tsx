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
  const categories = Array.from(new Set(tools.map(t => t.category)))

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

        {categories.map(category => (
          <div key={category} className="mb-6 md:mb-12">
            <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-3 md:mb-6 border-l-4 border-primary pl-3 md:pl-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {tools
                .filter(tool => tool.category === category)
                .map(tool => (
                  <Link
                    key={tool.slug}
                    href={"/tools/" + tool.slug}
                    className="group relative bg-bg-dark border border-border hover:border-primary rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 active:scale-[0.98]"
                  >
                    <div className={"absolute top-0 left-0 w-full h-1 bg-gradient-to-r " + tool.color + " rounded-t-xl"}></div>

                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={"text-2xl md:text-3xl flex-shrink-0 bg-gradient-to-br " + tool.color + " bg-clip-text text-transparent font-bold"}>
                        {tool.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-text-secondary text-xs md:text-sm line-clamp-1 md:line-clamp-none">
                          {tool.description}
                        </p>
                      </div>

                      <div className="text-text-muted group-hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}

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
