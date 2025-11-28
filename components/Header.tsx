'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/tools', label: 'Tools' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contattaci' },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-bg-dark/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                THEJORD
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={"text-sm font-medium transition-colors hover:text-primary " +
                    (isActive(link.href) ? "text-primary" : "text-text-secondary")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors relative z-50"
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
                href={link.href}
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
