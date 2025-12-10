/**
 * SEO Metadata for all 20 blog posts
 * Generated for SPRINT 1: Immediate Meta Tags Update
 *
 * Each post includes:
 * - metaTitle: 50-60 characters, primary keyword included
 * - metaDescription: 150-160 characters, compelling CTA
 * - keywords: 5-10 targeted keywords
 */

export interface PostSEOMetadata {
  id: string
  slug: string
  title: string
  language: 'it' | 'en'
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

export const seoMetadata: PostSEOMetadata[] = [
  // 1. DIFF CHECKER (IT/EN)
  {
    id: 'diff-it-001',
    slug: 'diff-checker-confronta-testi',
    title: 'Diff Checker: Come Confrontare Testi e Codice Online',
    language: 'it',
    metaTitle: 'Diff Checker Online: Confronta Testi e Codice Gratis',
    metaDescription: 'Strumento gratuito per confrontare file e codice. Trova differenze in tempo reale con evidenziazione riga per riga. 100% privacy, nessun upload.',
    keywords: [
      'diff checker',
      'confronta testi',
      'compare files',
      'diff tool online',
      'confronta codice',
      'text diff',
      'file comparison',
      'diff italiano',
      'compare two texts',
      'version control'
    ]
  },
  {
    id: 'diff-en-001',
    slug: 'diff-checker-compare-texts',
    title: 'Diff Checker: How to Compare Texts and Code Online',
    language: 'en',
    metaTitle: 'Diff Checker: Compare Text & Code Online - Free Tool',
    metaDescription: 'Free online diff tool to compare files and code. Real-time highlighting with line-by-line differences. 100% privacy-first, no uploads required.',
    keywords: [
      'diff checker',
      'compare text online',
      'diff tool',
      'code comparison',
      'text diff',
      'compare files',
      'online diff',
      'file comparison tool',
      'compare two texts',
      'version control'
    ]
  },

  // 2. HASH GENERATOR (IT/EN)
  {
    id: 'hash-gen-it-001',
    slug: 'hash-generator-guida-completa',
    title: 'Hash Generator: Guida Completa a MD5, SHA-1, SHA-256 e SHA-512',
    language: 'it',
    metaTitle: 'Hash Generator: MD5, SHA-256, SHA-512 Online Gratis',
    metaDescription: 'Genera hash crittografici con MD5, SHA-1, SHA-256, SHA-512. Strumento gratuito per checksum, password hashing e verifica integrità file.',
    keywords: [
      'hash generator',
      'generatore hash',
      'md5 generator',
      'sha256 generator',
      'sha512 hash',
      'hash calculator',
      'genera hash online',
      'checksum calculator',
      'password hash',
      'hash crittografico'
    ]
  },
  {
    id: 'hash-gen-en-001',
    slug: 'hash-generator-complete-guide',
    title: 'Hash Generator: Complete Guide to MD5, SHA-1, SHA-256 and SHA-512',
    language: 'en',
    metaTitle: 'Hash Generator: MD5, SHA-256, SHA-512 Online Free',
    metaDescription: 'Generate cryptographic hashes with MD5, SHA-1, SHA-256, SHA-512. Free tool for checksums, password hashing, and file integrity verification.',
    keywords: [
      'hash generator',
      'md5 generator',
      'sha256 hash',
      'sha512 generator',
      'hash calculator',
      'online hash tool',
      'checksum generator',
      'cryptographic hash',
      'password hash',
      'file integrity check'
    ]
  },

  // 3. INTERNATIONALIZATION (IT/EN)
  {
    id: 'i18n-it-001',
    slug: 'internazionalizzazione-sito-multilingue',
    title: 'Internazionalizzazione: THEJORD ora Parla Italiano e Inglese',
    language: 'it',
    metaTitle: 'Come Creare Sito Multilingue: i18n con Next.js 16',
    metaDescription: 'Guida completa all\'internazionalizzazione con Next.js 16 e next-intl. Scopri come implementare i18n, gestire traduzioni e SEO multilingue.',
    keywords: [
      'internazionalizzazione',
      'i18n nextjs',
      'sito multilingue',
      'next-intl',
      'traduzioni nextjs',
      'i18n react',
      'multilingual website',
      'nextjs translations',
      'i18n tutorial',
      'localizzazione'
    ]
  },
  {
    id: 'i18n-en-001',
    slug: 'internationalization-multilingual-website',
    title: 'Internationalization: THEJORD Now Speaks Italian and English',
    language: 'en',
    metaTitle: 'Build Multilingual Website: i18n with Next.js 16',
    metaDescription: 'Complete guide to internationalization with Next.js 16 and next-intl. Learn how to implement i18n, manage translations, and optimize multilingual SEO.',
    keywords: [
      'internationalization',
      'i18n nextjs',
      'multilingual website',
      'next-intl',
      'nextjs translations',
      'i18n react',
      'multilingual seo',
      'nextjs i18n tutorial',
      'localization',
      'translation management'
    ]
  },

  // 4. NEXT.JS MIGRATION (IT/EN)
  {
    id: 'nextjs-it-001',
    slug: 'migrazione-nextjs-16-thejord',
    title: 'THEJORD 2.0: Migrazione a Next.js 16 con Turbopack',
    language: 'it',
    metaTitle: 'Migrazione da Vite a Next.js 16: Guida Completa',
    metaDescription: 'Come migrare da Vite a Next.js 16 con Turbopack. Performance, SSR, API routes e App Router. Esperienza pratica e best practices di migrazione.',
    keywords: [
      'next.js 16',
      'migrazione nextjs',
      'vite to nextjs',
      'turbopack',
      'next.js tutorial',
      'app router',
      'nextjs migration guide',
      'react framework',
      'nextjs performance',
      'ssr nextjs'
    ]
  },
  {
    id: 'nextjs-en-001',
    slug: 'nextjs-16-migration-thejord',
    title: 'THEJORD 2.0: Migration to Next.js 16 with Turbopack',
    language: 'en',
    metaTitle: 'Vite to Next.js 16 Migration: Complete Guide',
    metaDescription: 'How to migrate from Vite to Next.js 16 with Turbopack. Performance gains, SSR, API routes, and App Router. Real-world migration experience and tips.',
    keywords: [
      'next.js 16',
      'nextjs migration',
      'vite to nextjs',
      'turbopack',
      'next.js tutorial',
      'app router',
      'nextjs migration guide',
      'react framework',
      'nextjs performance',
      'server side rendering'
    ]
  },

  // 5. THEJORD LAUNCH (IT/EN)
  {
    id: 'e13c6bdc-b489-43e8-8942-17899e93fa10',
    slug: 'lancio-thejord-it',
    title: 'Benvenuti su THEJORD.IT: Developer Tools Gratuiti e Privacy-First',
    language: 'it',
    metaTitle: 'THEJORD.IT: Strumenti Gratis per Developer Privacy-First',
    metaDescription: 'Suite di 11 strumenti gratuiti per sviluppatori: JSON formatter, Base64, RegEx tester, Hash generator e altro. 100% client-side, open source, Made in Italy.',
    keywords: [
      'developer tools',
      'strumenti sviluppatori',
      'json formatter',
      'base64 encoder',
      'regex tester',
      'hash generator',
      'privacy first tools',
      'open source tools',
      'free developer tools',
      'made in italy'
    ]
  },
  {
    id: 'bf64aed0-8ec8-4c8f-bc28-8b8220e05dc6',
    slug: 'thejord-launch-announcement',
    title: 'Welcome to THEJORD.IT: Free, Privacy-First Developer Tools',
    language: 'en',
    metaTitle: 'THEJORD.IT: Free Privacy-First Developer Tools',
    metaDescription: 'Suite of 11 free developer tools: JSON formatter, Base64, RegEx tester, Hash generator, and more. 100% client-side processing, open source.',
    keywords: [
      'developer tools',
      'free coding tools',
      'json formatter',
      'base64 encoder',
      'regex tester',
      'hash generator',
      'privacy first tools',
      'open source tools',
      'online developer tools',
      'client side tools'
    ]
  },

  // 6. REGEX TESTER (IT/EN)
  {
    id: 'e8e68acc-0e41-4e66-aee2-ac2526b99c0e',
    slug: 'regex-tester-italiano-pattern',
    title: 'RegEx Tester Italiano: Pattern Predefiniti e Guida Completa',
    language: 'it',
    metaTitle: 'RegEx Tester: Pattern Italiani per CF, P.IVA, Email',
    metaDescription: 'Testa espressioni regolari online con 30+ pattern predefiniti: codice fiscale, partita IVA, email, telefono. Real-time matching, evidenziazione gruppi.',
    keywords: [
      'regex tester',
      'espressioni regolari',
      'regex italiano',
      'codice fiscale regex',
      'partita iva regex',
      'regex tester online',
      'regular expressions',
      'regex pattern',
      'test regex',
      'regex validator'
    ]
  },
  {
    id: 'f7c875e7-633f-4247-b7e9-97fd5452b4e7',
    slug: 'regex-tester-patterns-guide',
    title: 'RegEx Tester: Preset Patterns and Complete Guide',
    language: 'en',
    metaTitle: 'RegEx Tester: Test Regular Expressions Online Free',
    metaDescription: 'Test regular expressions online with 30+ preset patterns: email, phone, credit card, URL validation. Real-time matching, capture group highlighting.',
    keywords: [
      'regex tester',
      'regular expressions',
      'regex online',
      'test regex',
      'regex validator',
      'regex pattern',
      'regex tutorial',
      'regular expression tester',
      'regex match',
      'regex examples'
    ]
  },

  // 7. BASE64 (IT/EN)
  {
    id: '640ca7d7-6d39-415f-9f57-c4f819fb55b0',
    slug: 'base64-encoder-decoder-guida',
    title: 'Base64 Encoder/Decoder: Guida Completa e Strumento Gratuito',
    language: 'it',
    metaTitle: 'Base64 Encoder/Decoder: Codifica Online Gratis',
    metaDescription: 'Codifica e decodifica Base64 online. Supporta testo, file e immagini. Scopri come funziona Base64, quando usarlo e use cases pratici per developers.',
    keywords: [
      'base64 encoder',
      'base64 decoder',
      'codifica base64',
      'decode base64',
      'encode base64',
      'base64 online',
      'base64 tool',
      'base64 converter',
      'base64 immagini',
      'data uri'
    ]
  },
  {
    id: '0197f1a1-ec8b-414b-967d-0f52cebe955f',
    slug: 'base64-encoder-decoder-guide',
    title: 'Base64 Encoder/Decoder: Complete Guide and Free Tool',
    language: 'en',
    metaTitle: 'Base64 Encoder/Decoder: Free Online Tool & Guide',
    metaDescription: 'Encode and decode Base64 online. Supports text, files, and images. Learn how Base64 works, when to use it, and practical use cases for developers.',
    keywords: [
      'base64 encoder',
      'base64 decoder',
      'encode base64',
      'decode base64',
      'base64 online',
      'base64 tool',
      'base64 converter',
      'base64 image',
      'data uri',
      'base64 tutorial'
    ]
  },

  // 8. JSON FORMATTER (IT/EN)
  {
    id: '78c9c4bf-f447-4eb7-8221-15c6e6c53e5b',
    slug: 'come-validare-json-online',
    title: 'Come Validare JSON Online: Guida Completa al JSON Formatter',
    language: 'it',
    metaTitle: 'JSON Formatter: Valida, Formatta e Minify JSON Online',
    metaDescription: 'Strumento gratuito per validare, formattare e prettify JSON. Supporta minify, YAML conversion, tree view e confronto JSON. 100% client-side.',
    keywords: [
      'json formatter',
      'validare json',
      'json validator',
      'json prettify',
      'json minify',
      'formattare json',
      'json online',
      'json to yaml',
      'json beautifier',
      'json lint'
    ]
  },
  {
    id: 'e1a6e66a-394e-4757-acb6-8b09c7ba904a',
    slug: 'how-to-validate-json-online',
    title: 'How to Validate JSON Online: Complete JSON Formatter Guide',
    language: 'en',
    metaTitle: 'JSON Formatter: Validate, Format & Minify JSON Online',
    metaDescription: 'Free tool to validate, format, and prettify JSON. Supports minify, YAML conversion, tree view, and JSON comparison. 100% client-side processing.',
    keywords: [
      'json formatter',
      'validate json',
      'json validator',
      'json prettify',
      'json minify',
      'format json',
      'json online',
      'json to yaml',
      'json beautifier',
      'json lint'
    ]
  },

  // 9. JSON SCHEMA (IT/EN)
  {
    id: 'f697d6fb-ca74-449c-be74-735b39090dcc',
    slug: 'json-schema-converter',
    title: 'JSON Schema Converter: Genera Schemi di Validazione Automaticamente',
    language: 'it',
    metaTitle: 'JSON Schema Generator: Crea Schema da JSON Online',
    metaDescription: 'Converti JSON in JSON Schema automaticamente. Genera Draft 2020-12 o Draft 07, rileva formati, documenta API. Perfetto per OpenAPI, Swagger e Ajv.',
    keywords: [
      'json schema',
      'json schema converter',
      'json validation',
      'generate json schema',
      'json schema generator',
      'api documentation',
      'openapi',
      'swagger',
      'ajv',
      'json schema validator'
    ]
  },
  {
    id: 'f86b51fb-e3f7-48f1-bf36-e102449f0e49',
    slug: 'json-schema-converter',
    title: 'JSON Schema Converter: Generate Validation Schemas Automatically',
    language: 'en',
    metaTitle: 'JSON Schema Generator: Create Schema from JSON Online',
    metaDescription: 'Convert JSON to JSON Schema automatically. Generate Draft 2020-12 or Draft 07, detect formats, document APIs. Perfect for OpenAPI, Swagger, and Ajv.',
    keywords: [
      'json schema',
      'json schema converter',
      'json validation',
      'generate json schema',
      'json schema generator',
      'api documentation',
      'openapi',
      'swagger',
      'ajv',
      'json schema validator'
    ]
  },

  // 10. CRON BUILDER (IT/EN)
  {
    id: 'e2f4e586-d92b-456d-8c5a-04a3ba015fc1',
    slug: 'cron-expression-builder',
    title: 'Cron Expression Builder: Pianifica Task Automatici con Facilità',
    language: 'it',
    metaTitle: 'Cron Expression Builder: Genera Cron Schedule Online',
    metaDescription: 'Crea espressioni cron con interfaccia visuale. Pattern predefiniti, validazione real-time, anteprima esecuzioni. Perfetto per Linux, DevOps e automation.',
    keywords: [
      'cron expression',
      'cron builder',
      'cron generator',
      'crontab',
      'task scheduler',
      'automation',
      'devops',
      'linux cron',
      'cron online',
      'schedule tasks'
    ]
  },
  {
    id: '2a1fea92-7511-47fd-a8ec-c3b0441f5645',
    slug: 'cron-expression-builder',
    title: 'Cron Expression Builder: Schedule Automated Tasks with Ease',
    language: 'en',
    metaTitle: 'Cron Expression Builder: Generate Cron Schedule Online',
    metaDescription: 'Create cron expressions with visual interface. Preset patterns, real-time validation, execution preview. Perfect for Linux, DevOps, and task automation.',
    keywords: [
      'cron expression',
      'cron builder',
      'cron generator',
      'crontab',
      'task scheduler',
      'automation',
      'devops',
      'linux cron',
      'cron online',
      'schedule automated tasks'
    ]
  }
]

// Summary stats
export const stats = {
  totalPosts: seoMetadata.length,
  italianPosts: seoMetadata.filter(p => p.language === 'it').length,
  englishPosts: seoMetadata.filter(p => p.language === 'en').length,
  avgKeywordsPerPost: Math.round(
    seoMetadata.reduce((sum, p) => sum + p.keywords.length, 0) / seoMetadata.length
  )
}
