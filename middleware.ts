import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle root path with permanent redirect (301) for SEO
  // This tells Google that /it is the canonical version, not /
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}`
    return NextResponse.redirect(url, { status: 301 })
  }

  // For all other paths, use next-intl middleware
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - API routes (/api/...)
  // - Static files (/_next/..., /favicon.ico, etc)
  // - Public assets with extensions
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
