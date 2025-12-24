'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const tTools = useTranslations('tools.list')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    tools: [
      { href: 'tools/json-formatter', key: 'jsonFormatter' },
      { href: 'tools/base64', key: 'base64' },
      { href: 'tools/regex-tester', key: 'regexTester' },
      { href: 'tools/hash-generator', key: 'hashGenerator' },
    ],
    resources: [
      { href: 'blog', labelKey: 'blog' },
      { href: 'tools', labelKey: 'devTools' },
      { href: 'pdf-tools', labelKey: 'pdfTools' },
      { href: 'about', labelKey: 'about' },
      { href: 'contact', labelKey: 'contact' },
      { href: 'changelog', labelKey: 'changelog' },
    ],
  }

  return (
    <footer className="border-t border-border bg-bg-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                THEJORD
              </span>
            </Link>
            <p className="text-text-secondary text-sm mb-4 max-w-md">
              {t('tagline')}
            </p>
            <p className="text-text-muted text-xs">
              Made in Italy by The Jord
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">{t('tools')}</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}/${link.href}`}
                    className="text-text-secondary hover:text-primary text-sm transition-colors"
                  >
                    {tTools(`${link.key}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">{t('navigation')}</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}/${link.href}`}
                    className="text-text-secondary hover:text-primary text-sm transition-colors"
                  >
                    {t(link.labelKey)}
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
              <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">
                {t('privacy')}
              </Link>
            </div>
            <div className="flex items-center gap-4 text-text-muted text-sm">
              <span>Next.js</span>
              <span>•</span>
              <span>Privacy-first</span>
              <span>•</span>
              <span>SSR</span>
              <span>•</span>
              <a
                href={`/api/rss?lang=${locale}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors flex items-center gap-1"
                title={locale === 'it' ? 'Feed RSS del Blog' : 'Blog RSS Feed'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/>
                </svg>
                RSS
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
