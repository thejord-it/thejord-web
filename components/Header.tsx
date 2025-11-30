'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { locales, localeFlags, localeNames, type Locale } from '@/i18n/config'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale() as Locale
  const t = useTranslations('header')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [blogTranslations, setBlogTranslations] = useState<Record<string, string>>({})

  // Get path without locale prefix
  const getPathWithoutLocale = () => {
    const segments = pathname.split('/')
    if (locales.includes(segments[1] as Locale)) {
      return '/' + segments.slice(2).join('/')
    }
    return pathname
  }

  const pathWithoutLocale = getPathWithoutLocale()

  const isActive = (path: string) => {
    if (path === '') {
      return pathWithoutLocale === '' || pathWithoutLocale === '/'
    }
    return pathWithoutLocale.startsWith('/' + path)
  }

  const navLinks = [
    { href: '', label: 'Home' },
    { href: 'blog', label: t('blog') },
    { href: 'tools', label: t('tools') },
    { href: 'about', label: t('about') },
    { href: 'contact', label: t('contact') },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
    setIsLangOpen(false)
  }, [pathname])

  // Fetch blog translations when on a blog post page
  useEffect(() => {
    const isBlogPost = pathWithoutLocale.startsWith('/blog/') && pathWithoutLocale.split('/').length === 3

    if (isBlogPost) {
      const slug = pathWithoutLocale.split('/')[2]
      if (slug) {
        fetch(`${API_URL}/api/posts/${slug}/translations?lang=${locale}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              setBlogTranslations(data.data)
            } else {
              setBlogTranslations({})
            }
          })
          .catch(() => setBlogTranslations({}))
      }
    } else {
      setBlogTranslations({})
    }
  }, [pathname, locale, pathWithoutLocale])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Switch language - handle blog post translations correctly
  const switchLocale = (newLocale: Locale) => {
    setIsLangOpen(false)

    // Check if we're on a blog post and have a translation
    const isBlogPost = pathWithoutLocale.startsWith('/blog/') && pathWithoutLocale.split('/').length === 3

    if (isBlogPost && blogTranslations[newLocale]) {
      // Use the translated slug
      const newPath = `/${newLocale}/blog/${blogTranslations[newLocale]}`
      router.push(newPath)
    } else {
      // Default behavior: just change locale prefix
      const newPath = `/${newLocale}${pathWithoutLocale}`
      router.push(newPath)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-bg-dark/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                THEJORD
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={`/${locale}/${link.href}`}
                    className={"text-sm font-medium transition-colors hover:text-primary " +
                      (isActive(link.href) ? "text-primary" : "text-text-secondary")
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Language Switcher - Desktop */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors border border-border rounded-lg hover:border-primary"
                >
                  <span>{localeFlags[locale]}</span>
                  <span className="uppercase">{locale}</span>
                  <svg className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-bg-dark border border-border rounded-lg shadow-lg py-1 z-50">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          loc === locale
                            ? 'bg-primary/10 text-primary'
                            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                        }`}
                      >
                        <span>{localeFlags[loc]}</span>
                        <span>{localeNames[loc]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {/* Language Switcher - Mobile (compact) */}
              <button
                onClick={() => switchLocale(locale === 'it' ? 'en' : 'it')}
                className="p-2 text-text-secondary hover:text-primary transition-colors"
                aria-label="Switch language"
              >
                <span className="text-lg">{localeFlags[locale === 'it' ? 'en' : 'it']}</span>
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-text-secondary hover:text-primary transition-colors relative z-50"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={"fixed inset-0 z-40 md:hidden transition-opacity duration-300 " +
          (isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-black/80"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu content */}
        <div
          className={"absolute top-16 right-0 w-64 h-[calc(100%-4rem)] bg-bg-dark border-l border-border transform transition-transform duration-300 ease-out " +
            (isMenuOpen ? "translate-x-0" : "translate-x-full")
          }
        >
          <nav className="flex flex-col p-4 pt-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}/${link.href}`}
                onClick={() => setIsMenuOpen(false)}
                className={"py-3 px-4 text-lg font-medium rounded-lg transition-colors mb-1 " +
                  (isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-bg-surface hover:text-text-primary")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
