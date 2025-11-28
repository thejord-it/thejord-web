import Link from 'next/link'

export default function HomePage() {
  const featuredTools = [
    {
      name: 'JSON Formatter',
      description: 'Validate, format, and beautify JSON with syntax highlighting',
      icon: '{ }',
      href: '/tools/json-formatter',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Base64 Encoder',
      description: 'Encode and decode text and files to/from Base64',
      icon: '⚡',
      href: '/tools/base64',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'RegEx Tester',
      description: 'Test regular expressions with real-time highlighting',
      icon: '.*',
      href: '/tools/regex-tester',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes',
      icon: '#',
      href: '/tools/hash-generator',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Cron Builder',
      description: 'Build and validate cron expressions visually',
      icon: '⏰',
      href: '/tools/cron-builder',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Diff Checker',
      description: 'Compare text differences with side-by-side view',
      icon: '⚖️',
      href: '/tools/diff-checker',
      color: 'from-teal-500 to-cyan-500'
    }
  ]

  const stats = [
    { value: '11', label: 'Developer Tools', icon: '🛠️' },
    { value: '100%', label: 'Privacy-First', icon: '🔒' },
    { value: '0ms', label: 'Server Processing', icon: '⚡' },
    { value: 'Free', label: 'Forever', icon: '💎' }
  ]

  return (
    <div className="min-h-screen bg-bg-darkest">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-darkest to-secondary/10 animate-gradient"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12 md:py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Developer Tools
              </span>
              <br />
              <span className="text-text-primary">Built for Speed</span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto mb-8">
              Privacy-first developer utilities that process everything in your browser.
              No servers, no tracking, no BS.
            </p>

            <p className="text-sm text-text-muted mb-12">
              Made in Italy 🇮🇹 by The Jord
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/tools"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary text-bg-darkest font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50"
              >
                Explore Tools →
              </Link>

              <Link
                href="/blog"
                className="px-8 py-4 border-2 border-border hover:border-primary text-text-primary font-semibold rounded-lg transition-all"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-bg-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl sm:text-2xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
              Popular Tools
            </h2>
            <p className="text-xl text-text-secondary">
              Everything runs locally in your browser for maximum privacy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="group relative bg-bg-dark border border-border hover:border-primary rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tool.color} rounded-t-xl`}></div>

                <div className="flex items-start gap-4">
                  <div className={`text-4xl flex-shrink-0 bg-gradient-to-br ${tool.color} bg-clip-text text-transparent font-bold`}>
                    {tool.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now →
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center text-primary hover:text-primary-light font-semibold transition-colors"
            >
              View all 11 tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-bg-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-3xl md:text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Privacy-First
              </h3>
              <p className="text-text-secondary">
                All tools process data 100% client-side. Your data never leaves your browser.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl md:text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Lightning Fast
              </h3>
              <p className="text-text-secondary">
                No server round-trips. Everything happens instantly in your browser.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl md:text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Developer-Focused
              </h3>
              <p className="text-text-secondary">
                Built by developers, for developers. Clean UIs and powerful features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog CTA Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
            Technical Blog
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Deep dives into web development, architecture, and engineering best practices
          </p>
          <Link
            href="/blog"
            className="inline-flex px-8 py-4 bg-bg-dark border border-border hover:border-primary text-text-primary font-semibold rounded-lg transition-all"
          >
            Read Latest Articles →
          </Link>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 md:py-20 border-t border-border bg-bg-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-text-primary mb-4">
              Built with Modern Tech
            </h2>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-text-muted">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              <span className="font-semibold">React 19</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">▲</span>
              <span className="font-semibold">Next.js 16</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📘</span>
              <span className="font-semibold">TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span className="font-semibold">Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-semibold">Turbopack</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
