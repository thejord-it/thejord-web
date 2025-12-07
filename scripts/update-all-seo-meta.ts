#!/usr/bin/env tsx
/**
 * Update SEO Meta Tags for ALL blog posts
 *
 * This script:
 * 1. Fetches all posts from the API
 * 2. Generates appropriate metaTitle, metaDescription, keywords
 * 3. Updates each post via PUT API
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/update-all-seo-meta.ts
 */

const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

interface Post {
  id: string
  slug: string
  title: string
  language: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

interface SEOData {
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

// SEO metadata generator based on slug/title patterns
function generateSEO(post: Post): SEOData {
  const isItalian = post.language === 'it'
  const slug = post.slug.toLowerCase()

  // UUID Generator
  if (slug.includes('uuid')) {
    return isItalian ? {
      metaTitle: 'UUID Generator: Genera Identificatori Univoci Online',
      metaDescription: 'Genera UUID v1, v4, v5 online gratis. Crea identificatori univoci per database, API e applicazioni. 100% client-side, privacy garantita.',
      keywords: ['uuid generator', 'genera uuid', 'uuid online', 'uuid v4', 'uuid v1', 'identificatori univoci', 'guid generator']
    } : {
      metaTitle: 'UUID Generator: Create Unique Identifiers Online Free',
      metaDescription: 'Generate UUID v1, v4, v5 online for free. Create unique identifiers for databases, APIs, and applications. 100% client-side, privacy guaranteed.',
      keywords: ['uuid generator', 'generate uuid', 'uuid online', 'uuid v4', 'uuid v1', 'unique identifiers', 'guid generator']
    }
  }

  // PDF Tools
  if (slug.includes('pdf')) {
    return isItalian ? {
      metaTitle: 'PDF Tools: Unisci, Dividi e Modifica PDF Online Gratis',
      metaDescription: 'Strumenti PDF gratuiti: merge, split, ruota pagine, converti immagini. Tutto nel browser, nessun upload su server. Privacy 100%.',
      keywords: ['pdf tools', 'unisci pdf', 'dividi pdf', 'merge pdf', 'split pdf', 'pdf editor online', 'modifica pdf gratis']
    } : {
      metaTitle: 'PDF Tools: Merge, Split & Edit PDF Online Free',
      metaDescription: 'Free PDF tools: merge, split, rotate pages, convert images. All in browser, no server upload. 100% privacy guaranteed.',
      keywords: ['pdf tools', 'merge pdf', 'split pdf', 'pdf editor online', 'combine pdf', 'pdf converter', 'edit pdf free']
    }
  }

  // Lorem Ipsum
  if (slug.includes('lorem')) {
    return isItalian ? {
      metaTitle: 'Lorem Ipsum Generator: Genera Testo Placeholder',
      metaDescription: 'Genera testo Lorem Ipsum per design e sviluppo. Paragrafi, frasi, parole personalizzabili. Perfetto per mockup e prototipi.',
      keywords: ['lorem ipsum', 'generatore testo', 'placeholder text', 'dummy text', 'testo finto', 'lorem ipsum generator']
    } : {
      metaTitle: 'Lorem Ipsum Generator: Create Placeholder Text',
      metaDescription: 'Generate Lorem Ipsum text for design and development. Customizable paragraphs, sentences, words. Perfect for mockups and prototypes.',
      keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'lorem ipsum generator', 'filler text', 'sample text']
    }
  }

  // Color Converter
  if (slug.includes('color')) {
    return isItalian ? {
      metaTitle: 'Color Converter: Converti HEX, RGB, HSL Online',
      metaDescription: 'Converti colori tra formati HEX, RGB, HSL, HSB. Color picker interattivo con palette generator. Perfetto per web design e CSS.',
      keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker', 'colori css', 'conversione colori']
    } : {
      metaTitle: 'Color Converter: Convert HEX, RGB, HSL Online',
      metaDescription: 'Convert colors between HEX, RGB, HSL, HSB formats. Interactive color picker with palette generator. Perfect for web design and CSS.',
      keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker', 'css colors', 'color conversion']
    }
  }

  // Markdown Converter
  if (slug.includes('markdown')) {
    return isItalian ? {
      metaTitle: 'Markdown Editor: Converti Markdown in HTML Online',
      metaDescription: 'Editor Markdown con preview live. Converti MD in HTML, esporta in diversi formati. Syntax highlighting e tabelle supportate.',
      keywords: ['markdown editor', 'markdown to html', 'md converter', 'markdown preview', 'markdown online', 'markdown italiano']
    } : {
      metaTitle: 'Markdown Editor: Convert Markdown to HTML Online',
      metaDescription: 'Markdown editor with live preview. Convert MD to HTML, export to various formats. Syntax highlighting and tables supported.',
      keywords: ['markdown editor', 'markdown to html', 'md converter', 'markdown preview', 'markdown online', 'markdown tool']
    }
  }

  // URL Encoder
  if (slug.includes('url')) {
    return isItalian ? {
      metaTitle: 'URL Encoder/Decoder: Codifica e Decodifica URL Online',
      metaDescription: 'Codifica e decodifica URL online gratis. Converti caratteri speciali, query string e parametri. Supporta encodeURIComponent.',
      keywords: ['url encoder', 'url decoder', 'codifica url', 'decodifica url', 'encode url', 'decode url', 'query string']
    } : {
      metaTitle: 'URL Encoder/Decoder: Encode & Decode URLs Online',
      metaDescription: 'Encode and decode URLs online for free. Convert special characters, query strings and parameters. Supports encodeURIComponent.',
      keywords: ['url encoder', 'url decoder', 'encode url', 'decode url', 'url encoding', 'query string encoder', 'uri encoder']
    }
  }

  // XML/WSDL Viewer
  if (slug.includes('xml') || slug.includes('wsdl')) {
    return isItalian ? {
      metaTitle: 'XML & WSDL Viewer: Formatta e Valida XML Online',
      metaDescription: 'Visualizza, formatta e valida XML/WSDL online. Tree view interattivo, syntax highlighting, esportazione XSD. Perfetto per SOAP e web services.',
      keywords: ['xml viewer', 'wsdl viewer', 'xml formatter', 'xml validator', 'wsdl parser', 'soap viewer', 'xml online']
    } : {
      metaTitle: 'XML & WSDL Viewer: Format & Validate XML Online',
      metaDescription: 'View, format and validate XML/WSDL online. Interactive tree view, syntax highlighting, XSD export. Perfect for SOAP and web services.',
      keywords: ['xml viewer', 'wsdl viewer', 'xml formatter', 'xml validator', 'wsdl parser', 'soap viewer', 'xml online']
    }
  }

  // Internationalization
  if (slug.includes('internazionalizzazione') || slug.includes('i18n')) {
    return isItalian ? {
      metaTitle: 'Internazionalizzazione Next.js: Guida Completa i18n',
      metaDescription: 'Guida completa all\'internazionalizzazione con Next.js 16 e next-intl. Implementa i18n, gestisci traduzioni e ottimizza SEO multilingue.',
      keywords: ['internazionalizzazione', 'i18n nextjs', 'next-intl', 'sito multilingue', 'traduzioni react', 'nextjs i18n']
    } : {
      metaTitle: 'Next.js Internationalization: Complete i18n Guide',
      metaDescription: 'Complete guide to internationalization with Next.js 16 and next-intl. Implement i18n, manage translations, and optimize multilingual SEO.',
      keywords: ['internationalization', 'i18n nextjs', 'next-intl', 'multilingual website', 'react translations', 'nextjs i18n']
    }
  }

  // Next.js Migration
  if (slug.includes('migrazione') || slug.includes('nextjs-16')) {
    return isItalian ? {
      metaTitle: 'Migrazione Next.js 16: Da Vite a Turbopack',
      metaDescription: 'Come migrare da Vite a Next.js 16 con Turbopack. Performance, SSR, API routes e App Router. Guida pratica con best practices.',
      keywords: ['next.js 16', 'migrazione nextjs', 'turbopack', 'vite to nextjs', 'app router', 'ssr nextjs']
    } : {
      metaTitle: 'Next.js 16 Migration: From Vite to Turbopack',
      metaDescription: 'How to migrate from Vite to Next.js 16 with Turbopack. Performance, SSR, API routes, and App Router. Practical guide with best practices.',
      keywords: ['next.js 16', 'nextjs migration', 'turbopack', 'vite to nextjs', 'app router', 'ssr nextjs']
    }
  }

  // THEJORD Launch
  if (slug.includes('benvenuto') || slug.includes('thejord') || slug.includes('launch')) {
    return isItalian ? {
      metaTitle: 'THEJORD.IT: Strumenti Gratuiti per Developer',
      metaDescription: 'Suite di strumenti gratuiti per sviluppatori: JSON formatter, Base64, RegEx tester, Hash generator. 100% client-side, open source, Made in Italy.',
      keywords: ['developer tools', 'strumenti sviluppatori', 'json formatter', 'base64', 'regex tester', 'thejord', 'tools gratis']
    } : {
      metaTitle: 'THEJORD.IT: Free Developer Tools Suite',
      metaDescription: 'Suite of free developer tools: JSON formatter, Base64, RegEx tester, Hash generator. 100% client-side processing, open source.',
      keywords: ['developer tools', 'free coding tools', 'json formatter', 'base64', 'regex tester', 'thejord', 'online tools']
    }
  }

  // Cron Builder
  if (slug.includes('cron')) {
    return isItalian ? {
      metaTitle: 'Cron Expression Builder: Genera Cron Schedule Online',
      metaDescription: 'Crea espressioni cron con interfaccia visuale. Pattern predefiniti, validazione real-time, anteprima esecuzioni. Per Linux, DevOps e automation.',
      keywords: ['cron expression', 'cron builder', 'cron generator', 'crontab', 'task scheduler', 'linux cron', 'automation']
    } : {
      metaTitle: 'Cron Expression Builder: Generate Cron Schedule Online',
      metaDescription: 'Create cron expressions with visual interface. Preset patterns, real-time validation, execution preview. For Linux, DevOps, and automation.',
      keywords: ['cron expression', 'cron builder', 'cron generator', 'crontab', 'task scheduler', 'linux cron', 'automation']
    }
  }

  // RegEx Tester
  if (slug.includes('regex')) {
    return isItalian ? {
      metaTitle: 'RegEx Tester: Test Espressioni Regolari Online',
      metaDescription: 'Testa espressioni regolari online con 30+ pattern predefiniti. Real-time matching, evidenziazione gruppi, regex per codice fiscale e P.IVA.',
      keywords: ['regex tester', 'espressioni regolari', 'regex italiano', 'test regex', 'regex pattern', 'regex validator']
    } : {
      metaTitle: 'RegEx Tester: Test Regular Expressions Online',
      metaDescription: 'Test regular expressions online with 30+ preset patterns. Real-time matching, capture group highlighting, email and phone validation.',
      keywords: ['regex tester', 'regular expressions', 'test regex', 'regex pattern', 'regex validator', 'regex online']
    }
  }

  // JSON Formatter
  if (slug.includes('json-formatter') || slug.includes('json-validator')) {
    return isItalian ? {
      metaTitle: 'JSON Formatter: Valida e Formatta JSON Online',
      metaDescription: 'Strumento gratuito per validare, formattare e prettify JSON. Supporta minify, YAML conversion, tree view. 100% client-side.',
      keywords: ['json formatter', 'validare json', 'json validator', 'json prettify', 'json minify', 'json online']
    } : {
      metaTitle: 'JSON Formatter: Validate & Format JSON Online',
      metaDescription: 'Free tool to validate, format, and prettify JSON. Supports minify, YAML conversion, tree view. 100% client-side processing.',
      keywords: ['json formatter', 'validate json', 'json validator', 'json prettify', 'json minify', 'json online']
    }
  }

  // Diff Checker
  if (slug.includes('diff')) {
    return isItalian ? {
      metaTitle: 'Diff Checker: Confronta Testi e Codice Online',
      metaDescription: 'Strumento gratuito per confrontare file e codice. Trova differenze in tempo reale con evidenziazione riga per riga. 100% privacy.',
      keywords: ['diff checker', 'confronta testi', 'compare files', 'diff tool', 'text diff', 'code comparison']
    } : {
      metaTitle: 'Diff Checker: Compare Text & Code Online',
      metaDescription: 'Free online diff tool to compare files and code. Real-time highlighting with line-by-line differences. 100% privacy-first.',
      keywords: ['diff checker', 'compare text', 'diff tool', 'code comparison', 'text diff', 'compare files']
    }
  }

  // Hash Generator
  if (slug.includes('hash')) {
    return isItalian ? {
      metaTitle: 'Hash Generator: MD5, SHA-256, SHA-512 Online',
      metaDescription: 'Genera hash crittografici con MD5, SHA-1, SHA-256, SHA-512. Strumento gratuito per checksum, password hashing e verifica integrità.',
      keywords: ['hash generator', 'md5 generator', 'sha256', 'sha512', 'hash calculator', 'checksum', 'genera hash']
    } : {
      metaTitle: 'Hash Generator: MD5, SHA-256, SHA-512 Online',
      metaDescription: 'Generate cryptographic hashes with MD5, SHA-1, SHA-256, SHA-512. Free tool for checksums, password hashing, and file integrity.',
      keywords: ['hash generator', 'md5 generator', 'sha256', 'sha512', 'hash calculator', 'checksum generator']
    }
  }

  // Base64
  if (slug.includes('base64')) {
    return isItalian ? {
      metaTitle: 'Base64 Encoder/Decoder: Codifica Online Gratis',
      metaDescription: 'Codifica e decodifica Base64 online. Supporta testo, file e immagini. Scopri come funziona Base64 e use cases per developers.',
      keywords: ['base64 encoder', 'base64 decoder', 'codifica base64', 'decode base64', 'base64 online', 'data uri']
    } : {
      metaTitle: 'Base64 Encoder/Decoder: Free Online Tool',
      metaDescription: 'Encode and decode Base64 online. Supports text, files, and images. Learn how Base64 works and practical use cases for developers.',
      keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64', 'base64 online', 'data uri']
    }
  }

  // JSON Schema
  if (slug.includes('schema')) {
    return isItalian ? {
      metaTitle: 'JSON Schema Generator: Crea Schema da JSON',
      metaDescription: 'Converti JSON in JSON Schema automaticamente. Genera Draft 2020-12 o Draft 07, rileva formati. Perfetto per OpenAPI e Swagger.',
      keywords: ['json schema', 'json schema generator', 'json validation', 'openapi', 'swagger', 'generate schema']
    } : {
      metaTitle: 'JSON Schema Generator: Create Schema from JSON',
      metaDescription: 'Convert JSON to JSON Schema automatically. Generate Draft 2020-12 or Draft 07, detect formats. Perfect for OpenAPI and Swagger.',
      keywords: ['json schema', 'json schema generator', 'json validation', 'openapi', 'swagger', 'generate schema']
    }
  }

  // Default fallback
  return isItalian ? {
    metaTitle: `${post.title.substring(0, 50)}...`,
    metaDescription: `Scopri ${post.title}. Strumento gratuito per sviluppatori su THEJORD.IT. 100% client-side, privacy garantita.`,
    keywords: ['developer tools', 'strumenti sviluppatori', 'thejord', 'tools online']
  } : {
    metaTitle: `${post.title.substring(0, 50)}...`,
    metaDescription: `Discover ${post.title}. Free developer tool on THEJORD.IT. 100% client-side, privacy guaranteed.`,
    keywords: ['developer tools', 'free tools', 'thejord', 'online tools']
  }
}

async function fetchAllPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/api/proxy/api/posts?limit=100`)
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`)
  }
  const data = await response.json()
  return data.data || data.posts || []
}

async function updatePost(id: string, seo: SEOData): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/proxy/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    },
    body: JSON.stringify({
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords
    })
  })
  return response.ok
}

async function main() {
  console.log('='.repeat(60))
  console.log('  SEO Meta Tags Update for ALL THEJORD Blog Posts')
  console.log('='.repeat(60))
  console.log(`\nAPI URL: ${API_URL}`)

  if (!ADMIN_TOKEN) {
    console.error('\nError: ADMIN_TOKEN is required')
    console.log('\nUsage:')
    console.log('  ADMIN_TOKEN=xxx API_URL=https://thejord.it npx tsx scripts/update-all-seo-meta.ts')
    process.exit(1)
  }
  console.log('Token: ****' + ADMIN_TOKEN.slice(-8))

  // Fetch all posts
  console.log('\nFetching posts...')
  const posts = await fetchAllPosts()
  console.log(`Found ${posts.length} posts\n`)

  let updated = 0
  let failed = 0
  let skipped = 0

  for (const post of posts) {
    // Skip if already has meta tags
    if (post.metaTitle && post.metaTitle.trim()) {
      console.log(`[SKIP] ${post.slug} - already has metaTitle`)
      skipped++
      continue
    }

    const seo = generateSEO(post)
    process.stdout.write(`[UPDATE] ${post.slug}...`)

    const success = await updatePost(post.id, seo)
    if (success) {
      console.log(' OK')
      updated++
    } else {
      console.log(' FAILED')
      failed++
    }

    // Small delay
    await new Promise(r => setTimeout(r, 100))
  }

  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Updated: ${updated}`)
  console.log(`Failed: ${failed}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Total: ${posts.length}`)

  if (failed > 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
