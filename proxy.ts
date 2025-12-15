import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
  alternateLinks: true
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
  const response = intlMiddleware(request)

  // SEO FIX: Convert 307 (Temporary) redirects to 308 (Permanent)
  // next-intl uses 307 by default, but 308 is better for SEO
  // as Google will transfer page ranking to the new URL
  // See: https://github.com/amannn/next-intl/discussions/544
  if (response.status === 307) {
    const location = response.headers.get('location')
    if (location) {
      return NextResponse.redirect(new URL(location, request.url), {
        status: 308,
        headers: response.headers
      })
    }
  }

  return response
}

export const config = {
  // Match all pathnames except for Next.js internals and static files
  matcher: [
    '/((?!api|_next|_vercel|static|uploads|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'
  ]
}
