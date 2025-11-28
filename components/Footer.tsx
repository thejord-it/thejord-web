import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    tools: [
      { href: '/tools/json-formatter', label: 'JSON Formatter' },
      { href: '/tools/base64', label: 'Base64 Encoder' },
      { href: '/tools/regex-tester', label: 'RegEx Tester' },
      { href: '/tools/hash-generator', label: 'Hash Generator' },
    ],
    resources: [
      { href: '/blog', label: 'Blog' },
      { href: '/tools', label: 'All Tools' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/changelog', label: 'Changelog' },
    ],
  }

  return (
    <footer className="border-t border-border bg-bg-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                THEJORD
              </span>
            </Link>
            <p className="text-text-secondary text-sm mb-4 max-w-md">
              Free developer tools and technical blog. 100% privacy-first, all processing happens in your browser.
            </p>
            <p className="text-text-muted text-xs">
              Made in Italy 🇮🇹 by The Jord
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-text-muted text-sm">
              <span>© {currentYear} THEJORD</span>
              <span>•</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="flex items-center gap-4 text-text-muted text-sm">
              <span>🚀 Built with Next.js</span>
              <span>•</span>
              <span>🔒 Privacy-first</span>
              <span>•</span>
              <span>⚡ Server-side rendering</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
