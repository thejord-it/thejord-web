import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export default function middleware(request: NextRequest) {
  // Handle admin routes - check for auth token
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow login page without auth
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for auth token in cookies
    const token = request.cookies.get('thejord_admin_token')

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next()
  }

  // For all other routes, use the i18n middleware
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for Next.js internals and static files
  matcher: [
    '/((?!api|_next|_vercel|static|uploads|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'
  ]
}
