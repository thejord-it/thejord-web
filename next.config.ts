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

      // Long-tail SEO redirects (IT)
      { source: '/it/json-to-yaml', destination: '/it/tools/json-formatter', permanent: true },
      { source: '/it/json-to-csv', destination: '/it/tools/json-formatter', permanent: true },
      { source: '/it/json-to-xml', destination: '/it/tools/json-formatter', permanent: true },
      { source: '/it/validatore-json', destination: '/it/tools/json-formatter', permanent: true },
      { source: '/it/formattatore-json', destination: '/it/tools/json-formatter', permanent: true },
      { source: '/it/cron-ogni-5-minuti', destination: '/it/tools/cron-builder', permanent: true },
      { source: '/it/cron-expression-generator', destination: '/it/tools/cron-builder', permanent: true },
      { source: '/it/regex-email', destination: '/it/tools/regex-tester', permanent: true },
      { source: '/it/regex-telefono', destination: '/it/tools/regex-tester', permanent: true },
      { source: '/it/regex-codice-fiscale', destination: '/it/tools/regex-tester', permanent: true },
      { source: '/it/hash-md5-online', destination: '/it/tools/hash-generator', permanent: true },
      { source: '/it/hash-sha256-online', destination: '/it/tools/hash-generator', permanent: true },
      { source: '/it/base64-immagine', destination: '/it/tools/base64', permanent: true },
      { source: '/it/codifica-url', destination: '/it/tools/url-encoder', permanent: true },
      { source: '/it/decodifica-url', destination: '/it/tools/url-encoder', permanent: true },
      { source: '/it/uuid-v4', destination: '/it/tools/uuid-generator', permanent: true },
      { source: '/it/uuid-online', destination: '/it/tools/uuid-generator', permanent: true },
      { source: '/it/confronta-testi', destination: '/it/tools/diff-checker', permanent: true },
      { source: '/it/unire-pdf', destination: '/it/pdf-tools', permanent: true },
      { source: '/it/dividere-pdf', destination: '/it/pdf-tools', permanent: true },
      { source: '/it/comprimere-pdf', destination: '/it/pdf-tools', permanent: true },

      // Long-tail SEO redirects (EN)
      { source: '/en/json-to-yaml', destination: '/en/tools/json-formatter', permanent: true },
      { source: '/en/json-to-csv', destination: '/en/tools/json-formatter', permanent: true },
      { source: '/en/json-validator', destination: '/en/tools/json-formatter', permanent: true },
      { source: '/en/cron-every-5-minutes', destination: '/en/tools/cron-builder', permanent: true },
      { source: '/en/cron-expression-generator', destination: '/en/tools/cron-builder', permanent: true },
      { source: '/en/regex-email', destination: '/en/tools/regex-tester', permanent: true },
      { source: '/en/regex-phone', destination: '/en/tools/regex-tester', permanent: true },
      { source: '/en/md5-hash-online', destination: '/en/tools/hash-generator', permanent: true },
      { source: '/en/sha256-hash-online', destination: '/en/tools/hash-generator', permanent: true },
      { source: '/en/base64-image', destination: '/en/tools/base64', permanent: true },
      { source: '/en/uuid-v4-generator', destination: '/en/tools/uuid-generator', permanent: true },
      { source: '/en/compare-text', destination: '/en/tools/diff-checker', permanent: true },
      { source: '/en/merge-pdf', destination: '/en/pdf-tools', permanent: true },
      { source: '/en/split-pdf', destination: '/en/pdf-tools', permanent: true },
      { source: '/en/compress-pdf', destination: '/en/pdf-tools', permanent: true },

      // Additional tool shortcuts (404 fixes)
      { source: '/lorem', destination: '/it/tools/lorem-ipsum', permanent: true },

      // Blog 404 fixes: EN slugs incorrectly used in IT locale
      { source: '/it/blog/lorem-ipsum-generator-complete-guide', destination: '/it/blog/lorem-ipsum-generator-guida-completa', permanent: true },
      { source: '/it/blog/cron-expression-builder', destination: '/it/blog/cron-expression-builder-guida', permanent: true },
      { source: '/it/blog/crontab-linux-complete-guide-examples', destination: '/it/blog/crontab-linux-guida-completa-esempi', permanent: true },
      { source: '/it/blog/diff-checker-compare-texts', destination: '/it/blog/diff-merge-confrontare-codice', permanent: true },
      { source: '/it/blog/uuid-generator-complete-guide', destination: '/it/blog/uuid-generator-guida-completa', permanent: true },
      { source: '/it/blog/markdown-converter-complete-guide', destination: '/it/blog/markdown-converter-guida-completa', permanent: true },
      { source: '/it/blog/pdf-tools-complete-guide', destination: '/it/blog/pdf-tools-guida-completa', permanent: true },
      { source: '/it/blog/url-encoder-decoder-complete-guide', destination: '/it/blog/url-encoder-decoder-guida-completa', permanent: true },
      { source: '/it/blog/xml-wsdl-viewer-formatter-validator', destination: '/it/blog/xml-wsdl-viewer-formattatore-validatore', permanent: true },
      { source: '/it/blog/internationalization-multilingual-website', destination: '/it/blog/internazionalizzazione-i18n-nextjs', permanent: true },
      { source: '/it/blog/thejord-launch-announcement', destination: '/it/blog/benvenuto-su-thejord-piattaforma-developer-tools', permanent: true },
      { source: '/it/blog/regex-tester-regular-expressions', destination: '/it/blog/regex-tester-espressioni-regolari', permanent: true },
      { source: '/it/blog/color-converter-complete-guide', destination: '/it/blog/color-converter-guida-completa', permanent: true },
      { source: '/it/blog/nextjs-16-migration-performance-turbopack', destination: '/it/blog/migrazione-nextjs-16-performance-turbopack', permanent: true },
      { source: '/it/blog/json-formatter-validator-guide', destination: '/it/blog/json-formatter-validator-guida', permanent: true },
      { source: '/it/blog/nextjs-16-migration-thejord', destination: '/it/blog/migrazione-nextjs-16-performance-turbopack', permanent: true },
      { source: '/it/blog/regex-tester-patterns-guide', destination: '/it/blog/regex-tester-espressioni-regolari', permanent: true },
      { source: '/it/blog/welcome-to-thejord-developer-tools-platform', destination: '/it/blog/benvenuto-su-thejord-piattaforma-developer-tools', permanent: true },
      { source: '/it/blog/how-to-validate-json-online', destination: '/it/blog/come-validare-json-guida-completa', permanent: true },
      { source: '/it/blog/migrazione-nextjs-16-thejord', destination: '/it/blog/migrazione-nextjs-16-performance-turbopack', permanent: true },

      // Blog 404 fixes: IT slugs incorrectly used in EN locale
      { source: '/en/blog/url-encoder-decoder-guida-completa', destination: '/en/blog/url-encoder-decoder-complete-guide', permanent: true },
      { source: '/en/blog/crontab-linux-guida-completa-esempi', destination: '/en/blog/crontab-linux-complete-guide-examples', permanent: true },
      { source: '/en/blog/base64-encoder-decoder-guida', destination: '/en/blog/base64-encoding-guide-when-to-use', permanent: true },
      { source: '/en/blog/regex-tester-italiano-pattern', destination: '/en/blog/regex-tester-regular-expressions', permanent: true },
      { source: '/en/blog/color-converter-guida-completa', destination: '/en/blog/color-converter-complete-guide', permanent: true },
      { source: '/en/blog/markdown-converter-guida-completa', destination: '/en/blog/markdown-converter-complete-guide', permanent: true },
      { source: '/en/blog/xml-wsdl-viewer-formattatore-validatore', destination: '/en/blog/xml-wsdl-viewer-formatter-validator', permanent: true },
      { source: '/en/blog/uuid-generator-guida-completa', destination: '/en/blog/uuid-generator-complete-guide', permanent: true },
      { source: '/en/blog/lancio-thejord-it', destination: '/en/blog/welcome-to-thejord-developer-tools-platform', permanent: true },
      { source: '/en/blog/hash-generator-guida-completa', destination: '/en/tools/hash-generator', permanent: true },
      { source: '/en/blog/lorem-ipsum-generator-guida-completa', destination: '/en/blog/lorem-ipsum-generator-complete-guide', permanent: true },
      { source: '/en/blog/diff-checker-confronta-testi', destination: '/en/blog/diff-merge-compare-code', permanent: true },
      { source: '/en/blog/regex-tester-patterns-guide', destination: '/en/blog/regex-tester-regular-expressions', permanent: true },
      { source: '/en/blog/cron-expression-builder-guida', destination: '/en/blog/cron-expression-builder-guide', permanent: true },
      { source: '/en/blog/backup-db', destination: '/en/blog', permanent: true },
      { source: '/en/blog/internazionalizzazione-i18n-nextjs', destination: '/en/blog/internationalization-i18n-nextjs', permanent: true },
      { source: '/en/blog/come-validare-json-online', destination: '/en/blog/how-to-validate-json-complete-guide', permanent: true },
      { source: '/en/blog/json-formatter-validator-guida', destination: '/en/blog/json-formatter-validator-guide', permanent: true },
      { source: '/en/blog/internazionalizzazione-sito-multilingue', destination: '/en/blog/internationalization-i18n-nextjs', permanent: true },

      // Blog 404 fixes: Old/wrong slugs without locale (redirected to IT by wildcard, but slug doesn't exist)
      { source: '/it/blog/json-schema-converter', destination: '/it/blog/json-schema-validare-api-pro', permanent: true },
      { source: '/it/blog/come-validare-json-online', destination: '/it/blog/come-validare-json-guida-completa', permanent: true },
      { source: '/it/blog/regex-tester-italiano-pattern', destination: '/it/blog/regex-tester-espressioni-regolari', permanent: true },
      { source: '/it/blog/base64-encoder-decoder-guide', destination: '/it/blog/base64-encoding-guida-quando-usarlo', permanent: true },
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
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
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
