import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // API endpoint for blog data
  env: {
    API_URL: process.env.API_URL || 'http://localhost:4000',
  },
  // Enable standalone output for Docker
  output: 'standalone',

  // Performance optimizations
  experimental: {
    // Optimize CSS loading
    optimizeCss: true,
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['@dnd-kit/core', '@dnd-kit/sortable', 'crypto-js', 'jszip'],
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // SEO FIX: Permanent redirect from root to default locale
  // This ensures Google treats /it as the canonical URL, not /
  // next-intl uses 307 (temporary) by default, but we need 301 (permanent) for SEO
  // See: https://github.com/amannn/next-intl/discussions/544
  async redirects() {
    return [
      {
        source: '/',
        destination: '/it',
        permanent: true, // Returns 308 Permanent Redirect
      },
    ]
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://maxcdn.bootstrapcdn.com https://fonts.googleapis.com",
              "img-src 'self' data: http://localhost:4000 https: blob:",
              "font-src 'self' data: https://maxcdn.bootstrapcdn.com https://fonts.gstatic.com",
              "worker-src 'self' blob:",
              "connect-src 'self' http://localhost:4000 https://www.google-analytics.com https://region1.google-analytics.com https://cdn.jsdelivr.net https://api-free.deepl.com https://api.mymemory.translated.net https://fonts.googleapis.com https://fonts.gstatic.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ]
  }
}

export default withNextIntl(nextConfig)
