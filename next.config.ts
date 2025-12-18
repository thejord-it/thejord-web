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

  // SEO FIX: Redirects for legacy URLs and locale handling
  async redirects() {
    return [
      { source: '/', destination: '/it', permanent: true },
      // Legacy tool URLs without /tools/ prefix
      { source: '/json-formatter', destination: '/it/tools/json-formatter', permanent: true },
      { source: '/base64', destination: '/it/tools/base64', permanent: true },
      { source: '/regex-tester', destination: '/it/tools/regex-tester', permanent: true },
      { source: '/regex', destination: '/it/tools/regex-tester', permanent: true },
      { source: '/hash-generator', destination: '/it/tools/hash-generator', permanent: true },
      { source: '/hash', destination: '/it/tools/hash-generator', permanent: true },
      { source: '/url-encoder', destination: '/it/tools/url-encoder', permanent: true },
      { source: '/url-tool', destination: '/it/tools/url-encoder', permanent: true },
      { source: '/url', destination: '/it/tools/url-encoder', permanent: true },
      { source: '/markdown-converter', destination: '/it/tools/markdown-converter', permanent: true },
      { source: '/markdown', destination: '/it/tools/markdown-converter', permanent: true },
      { source: '/color-converter', destination: '/it/tools/color-converter', permanent: true },
      { source: '/color', destination: '/it/tools/color-converter', permanent: true },
      { source: '/lorem-ipsum', destination: '/it/tools/lorem-ipsum', permanent: true },
      { source: '/diff-checker', destination: '/it/tools/diff-checker', permanent: true },
      { source: '/diff', destination: '/it/tools/diff-checker', permanent: true },
      { source: '/cron-builder', destination: '/it/tools/cron-builder', permanent: true },
      { source: '/json-schema', destination: '/it/tools/json-schema', permanent: true },
      { source: '/xml-wsdl-viewer', destination: '/it/tools/xml-wsdl-viewer', permanent: true },
      { source: '/pdf-tools', destination: '/it/pdf-tools', permanent: true },
      { source: '/uuid-generator', destination: '/it/tools/uuid-generator', permanent: true },
      // Legacy /tools/slug without locale
      { source: '/tools/:slug', destination: '/it/tools/:slug', permanent: true },
      // Legacy /blog/slug without locale
      { source: '/blog/:slug', destination: '/it/blog/:slug', permanent: true },
      // Non-existent tools redirect to tools page
      { source: '/tools/qr-code', destination: '/it/tools', permanent: false },
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
