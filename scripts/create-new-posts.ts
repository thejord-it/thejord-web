#!/usr/bin/env tsx
/**
 * Create New Blog Posts
 *
 * This script creates 12 new blog posts (6 topics × 2 languages)
 * with comprehensive SEO-optimized content.
 *
 * New Posts:
 * - JSON Formatter (IT/EN)
 * - RegEx Tester (IT/EN)
 * - Cron Builder (IT/EN)
 * - Launch Posts (IT/EN)
 * - Next.js Migration (IT/EN)
 * - i18n Posts (IT/EN)
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/create-new-posts.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { randomUUID } from 'crypto'

// Configuration
const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

interface NewPost {
  slug: string
  title: string
  language: 'it' | 'en'
  translationGroup: string
  filePath: string
  excerpt: string
  readTime: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  tags: string[]
}

const newPosts: NewPost[] = [
  // JSON FORMATTER
  {
    slug: 'json-formatter-validator-guida',
    title: 'JSON Formatter & Validator: Guida Completa e Strumento Online',
    language: 'it',
    translationGroup: 'json-formatter-001',
    filePath: './scripts/content-json-formatter-it.html',
    excerpt: 'Guida completa al JSON Formatter: valida, formatta (prettify), minifica JSON. Visualizzazione ad albero, supporto JSON5, conversione YAML, esempi di codice e best practices.',
    readTime: '9 min',
    metaTitle: 'JSON Formatter Online: Valida e Formatta JSON Gratis',
    metaDescription: 'Strumento gratuito per validare, formattare e minificare JSON. Visualizzazione ad albero, supporto JSON5, conversione YAML. Privacy-first, nessun upload.',
    keywords: ['json formatter', 'json validator', 'prettify json', 'minify json', 'json online', 'valida json', 'formatta json'],
    tags: ['json', 'development', 'tools', 'api']
  },
  {
    slug: 'json-formatter-validator-guide',
    title: 'JSON Formatter & Validator: Complete Guide and Online Tool',
    language: 'en',
    translationGroup: 'json-formatter-001',
    filePath: './scripts/content-json-formatter-en.html',
    excerpt: 'Complete guide to JSON Formatter: validate, format (prettify), minify JSON. Tree visualization, JSON5 support, YAML conversion, code examples and best practices.',
    readTime: '9 min',
    metaTitle: 'JSON Formatter Online: Validate & Format JSON Free',
    metaDescription: 'Free tool to validate, format, and minify JSON. Tree visualization, JSON5 support, YAML conversion. Privacy-first, no uploads required.',
    keywords: ['json formatter', 'json validator', 'prettify json', 'minify json', 'json online', 'validate json', 'format json'],
    tags: ['json', 'development', 'tools', 'api']
  },

  // REGEX TESTER
  {
    slug: 'regex-tester-espressioni-regolari',
    title: 'RegEx Tester: Strumento Online per Testare Espressioni Regolari',
    language: 'it',
    translationGroup: 'regex-tester-001',
    filePath: './scripts/content-regex-tester-it.html',
    excerpt: 'Guida completa al RegEx Tester: testa espressioni regolari in tempo reale. Pattern italiani (codice fiscale, P.IVA, CAP), esempi JavaScript/Python/PHP e best practices.',
    readTime: '9 min',
    metaTitle: 'RegEx Tester Online: Testa Espressioni Regolari Gratis',
    metaDescription: 'Strumento gratuito per testare regex in tempo reale. Pattern italiani (CF, P.IVA, IBAN), highlighting, esempi JavaScript/Python/PHP. 100% privacy-first.',
    keywords: ['regex tester', 'espressioni regolari', 'test regex', 'regex online', 'codice fiscale regex', 'partita iva regex', 'regex javascript'],
    tags: ['regex', 'development', 'validation', 'programming']
  },
  {
    slug: 'regex-tester-regular-expressions',
    title: 'RegEx Tester: Online Tool for Testing Regular Expressions',
    language: 'en',
    translationGroup: 'regex-tester-001',
    filePath: './scripts/content-regex-tester-en.html',
    excerpt: 'Complete guide to RegEx Tester: test regular expressions in real-time. Common patterns (email, phone, SSN), JavaScript/Python/PHP examples and best practices.',
    readTime: '9 min',
    metaTitle: 'RegEx Tester Online: Test Regular Expressions Free',
    metaDescription: 'Free tool to test regex in real-time. Common patterns (email, phone, SSN), highlighting, JavaScript/Python/PHP examples. 100% privacy-first.',
    keywords: ['regex tester', 'regular expressions', 'test regex', 'regex online', 'regex javascript', 'regex validator', 'regex patterns'],
    tags: ['regex', 'development', 'validation', 'programming']
  },

  // CRON BUILDER
  {
    slug: 'cron-expression-builder-guida',
    title: 'Cron Expression Builder: Generatore di Espressioni Cron Online',
    language: 'it',
    translationGroup: 'cron-builder-001',
    filePath: './scripts/content-cron-builder-it.html',
    excerpt: 'Guida completa al Cron Expression Builder: genera espressioni cron con interfaccia visuale. Spiegazione in italiano, esempi comuni, sintassi 5/6 campi (Quartz).',
    readTime: '10 min',
    metaTitle: 'Cron Builder Online: Genera Espressioni Cron Gratis',
    metaDescription: 'Generatore gratuito di espressioni cron con interfaccia visuale. Spiegazione in italiano, preview esecuzioni, supporto Quartz/Spring. Backup automatici e scheduling.',
    keywords: ['cron builder', 'cron expression', 'cron generator', 'crontab', 'cron online', 'genera cron', 'scheduler'],
    tags: ['cron', 'automation', 'devops', 'scheduling']
  },
  {
    slug: 'cron-expression-builder-guide',
    title: 'Cron Expression Builder: Online Cron Expression Generator',
    language: 'en',
    translationGroup: 'cron-builder-001',
    filePath: './scripts/content-cron-builder-en.html',
    excerpt: 'Complete guide to Cron Expression Builder: generate cron expressions with visual interface. Plain English explanation, common examples, 5/6 field syntax (Quartz).',
    readTime: '10 min',
    metaTitle: 'Cron Builder Online: Generate Cron Expressions Free',
    metaDescription: 'Free cron expression generator with visual interface. Plain English explanations, preview executions, Quartz/Spring support. Automated backups and scheduling.',
    keywords: ['cron builder', 'cron expression', 'cron generator', 'crontab', 'cron online', 'generate cron', 'scheduler'],
    tags: ['cron', 'automation', 'devops', 'scheduling']
  },

  // LAUNCH POSTS
  {
    slug: 'benvenuto-su-thejord-piattaforma-developer-tools',
    title: 'Benvenuto su THEJORD.IT: La Piattaforma di Developer Tools Italiani',
    language: 'it',
    translationGroup: 'launch-001',
    filePath: './scripts/content-launch-it.html',
    excerpt: 'Lancio ufficiale di THEJORD.IT: piattaforma gratuita di developer tools privacy-first. 11 strumenti professionali, open source, completamente gratuiti per sviluppatori italiani e internazionali.',
    readTime: '9 min',
    metaTitle: 'THEJORD.IT: Developer Tools Italiani Gratuiti e Open Source',
    metaDescription: 'Piattaforma gratuita di developer tools: Diff Checker, Hash Generator, Base64, JSON Formatter, RegEx Tester e altri. 100% privacy-first, open source, nessun paywall.',
    keywords: ['thejord', 'developer tools', 'strumenti sviluppatori', 'tools gratuiti', 'open source tools', 'privacy first'],
    tags: ['announcement', 'launch', 'thejord', 'platform']
  },
  {
    slug: 'welcome-to-thejord-developer-tools-platform',
    title: 'Welcome to THEJORD.IT: Professional Developer Tools Platform',
    language: 'en',
    translationGroup: 'launch-001',
    filePath: './scripts/content-launch-en.html',
    excerpt: 'Official launch of THEJORD.IT: free privacy-first developer tools platform. 11 professional tools, open source, completely free for developers worldwide.',
    readTime: '9 min',
    metaTitle: 'THEJORD.IT: Free Professional Developer Tools & Open Source',
    metaDescription: 'Free developer tools platform: Diff Checker, Hash Generator, Base64, JSON Formatter, RegEx Tester and more. 100% privacy-first, open source, no paywalls.',
    keywords: ['thejord', 'developer tools', 'free tools', 'open source tools', 'privacy first', 'web tools'],
    tags: ['announcement', 'launch', 'thejord', 'platform']
  },

  // NEXT.JS MIGRATION
  {
    slug: 'migrazione-nextjs-16-performance-turbopack',
    title: 'Migrazione a Next.js 16: Performance, Turbopack e React 19',
    language: 'it',
    translationGroup: 'nextjs-migration-001',
    filePath: './scripts/content-nextjs-migration-it.html',
    excerpt: 'Come abbiamo migrato THEJORD a Next.js 16: architettura App Router, Turbopack (7x più veloce), React 19 Server Components, best practices e performance improvements ottenuti.',
    readTime: '11 min',
    metaTitle: 'Migrazione a Next.js 16: Turbopack, React 19 e Performance',
    metaDescription: 'Guida tecnica alla migrazione Next.js 16: Turbopack 7x più veloce, React 19 Server Components, App Router, best practices e risultati reali di performance.',
    keywords: ['nextjs 16', 'next.js migration', 'turbopack', 'react 19', 'server components', 'app router', 'next.js performance'],
    tags: ['nextjs', 'react', 'migration', 'performance', 'technical']
  },
  {
    slug: 'nextjs-16-migration-performance-turbopack',
    title: 'Migration to Next.js 16: Performance, Turbopack, and React 19',
    language: 'en',
    translationGroup: 'nextjs-migration-001',
    filePath: './scripts/content-nextjs-migration-en.html',
    excerpt: 'How we migrated THEJORD to Next.js 16: App Router architecture, Turbopack (7x faster), React 19 Server Components, best practices and performance improvements achieved.',
    readTime: '11 min',
    metaTitle: 'Next.js 16 Migration: Turbopack, React 19 & Performance',
    metaDescription: 'Technical guide to Next.js 16 migration: Turbopack 7x faster, React 19 Server Components, App Router, best practices and real performance results.',
    keywords: ['nextjs 16', 'next.js migration', 'turbopack', 'react 19', 'server components', 'app router', 'next.js performance'],
    tags: ['nextjs', 'react', 'migration', 'performance', 'technical']
  },

  // I18N POSTS
  {
    slug: 'internazionalizzazione-i18n-nextjs',
    title: 'Internazionalizzazione di THEJORD: Come Abbiamo Implementato i18n con Next.js',
    language: 'it',
    translationGroup: 'i18n-001',
    filePath: './scripts/content-i18n-it.html',
    excerpt: 'Implementazione i18n di THEJORD con Next.js 16: routing multilingua, middleware per locale detection, translation management, SEO con hreflang e best practices.',
    readTime: '10 min',
    metaTitle: 'i18n con Next.js 16: Guida Completa all\'Internazionalizzazione',
    metaDescription: 'Guida tecnica i18n Next.js: routing multilingua, locale detection, translation management, SEO hreflang, Context API e best practices per app multilingua.',
    keywords: ['nextjs i18n', 'internazionalizzazione', 'next.js multilingual', 'i18n react', 'locale detection', 'hreflang', 'translation'],
    tags: ['nextjs', 'i18n', 'internationalization', 'multilingual', 'technical']
  },
  {
    slug: 'internationalization-i18n-nextjs',
    title: 'Internationalizing THEJORD: How We Implemented i18n with Next.js',
    language: 'en',
    translationGroup: 'i18n-001',
    filePath: './scripts/content-i18n-en.html',
    excerpt: 'THEJORD i18n implementation with Next.js 16: multilingual routing, locale detection middleware, translation management, SEO with hreflang and best practices.',
    readTime: '10 min',
    metaTitle: 'i18n with Next.js 16: Complete Internationalization Guide',
    metaDescription: 'Technical guide Next.js i18n: multilingual routing, locale detection, translation management, SEO hreflang, Context API and best practices for multilingual apps.',
    keywords: ['nextjs i18n', 'internationalization', 'next.js multilingual', 'i18n react', 'locale detection', 'hreflang', 'translation'],
    tags: ['nextjs', 'i18n', 'internationalization', 'multilingual', 'technical']
  }
]

interface CreateResult {
  slug: string
  language: string
  success: boolean
  postId?: string
  wordCount?: number
  error?: string
}

/**
 * Count words in HTML content (strips tags)
 */
function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  return words.length
}

/**
 * Create a new blog post
 */
async function createPost(
  post: NewPost,
  token: string
): Promise<{ success: boolean; postId?: string; wordCount?: number; error?: string }> {
  try {
    // Read content file
    const contentPath = path.resolve(process.cwd(), post.filePath)

    if (!fs.existsSync(contentPath)) {
      return {
        success: false,
        error: `File not found: ${contentPath}`
      }
    }

    const content = fs.readFileSync(contentPath, 'utf-8')
    const wordCount = countWords(content)

    // Create post via API
    const response = await fetch(`${API_URL}/api/proxy/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        slug: post.slug,
        title: post.title,
        language: post.language,
        translationGroup: post.translationGroup,
        content,
        excerpt: post.excerpt,
        readTime: post.readTime,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        tags: post.tags,
        author: 'THEJORD Team',
        published: true,
        publishedAt: new Date().toISOString(),
        editorType: 'html'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      }
    }

    const result = await response.json()
    const postId = result.id || result.data?.id || result.post?.id

    return { success: true, postId, wordCount }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║      Create New Blog Posts with SEO Content             ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to create: ${newPosts.length}`)
  console.log(`   - JSON Formatter: 2 posts (IT/EN)`)
  console.log(`   - RegEx Tester: 2 posts (IT/EN)`)
  console.log(`   - Cron Builder: 2 posts (IT/EN)`)
  console.log(`   - Launch Posts: 2 posts (IT/EN)`)
  console.log(`   - Next.js Migration: 2 posts (IT/EN)`)
  console.log(`   - i18n Posts: 2 posts (IT/EN)\n`)

  console.log(`🌐 API URL: ${API_URL}\n`)

  // Check token
  if (!ADMIN_TOKEN) {
    console.error('❌ Error: ADMIN_TOKEN environment variable is required\n')
    console.log('Usage:')
    console.log('  ADMIN_TOKEN=xxx API_URL=https://thejord.it npx tsx scripts/create-new-posts.ts\n')
    process.exit(1)
  }

  console.log('✅ Using ADMIN_TOKEN from environment variable\n')

  // Verify all content files exist
  console.log('📁 Verifying content files...')
  let missingFiles = 0
  for (const post of newPosts) {
    const filePath = path.resolve(process.cwd(), post.filePath)
    if (!fs.existsSync(filePath)) {
      console.log(`   ❌ Missing: ${post.filePath}`)
      missingFiles++
    } else {
      const content = fs.readFileSync(filePath, 'utf-8')
      const words = countWords(content)
      console.log(`   ✅ ${post.slug} (${words} words)`)
    }
  }

  if (missingFiles > 0) {
    console.error(`\n❌ ${missingFiles} content file(s) not found.\n`)
    process.exit(1)
  }

  console.log('\n🚀 Starting post creation...\n')

  const results: CreateResult[] = []
  let successCount = 0
  let failCount = 0
  let totalWords = 0

  // Create each post
  for (const [index, post] of newPosts.entries()) {
    const progress = `[${index + 1}/${newPosts.length}]`

    process.stdout.write(`${progress} Creating ${post.slug} (${post.language})...`)

    const result = await createPost(post, ADMIN_TOKEN)

    if (result.success && result.wordCount) {
      console.log(` ✅ (${result.wordCount} words, ID: ${result.postId?.substring(0, 8)}...)`)
      successCount++
      totalWords += result.wordCount
    } else {
      console.log(` ❌ ${result.error}`)
      failCount++
    }

    results.push({
      slug: post.slug,
      language: post.language,
      success: result.success,
      postId: result.postId,
      wordCount: result.wordCount,
      error: result.error
    })

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('📊 CREATION SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Successful: ${successCount}/${newPosts.length}`)
  console.log(`❌ Failed: ${failCount}/${newPosts.length}`)
  console.log(`\n📈 Content Created:`)
  console.log(`   Total: ${totalWords} words`)
  console.log(`   Average: ${Math.round(totalWords / successCount)} words per post`)

  if (failCount > 0) {
    console.log('\n❌ Failed posts:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.slug} (${r.language}): ${r.error}`)
      })
  }

  console.log('\n✅ Post creation completed!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify posts at: https://thejord.it/admin/posts')
  console.log('   2. Check 2-3 posts to ensure content displays correctly')
  console.log('   3. View posts on production: https://thejord.it/blog')
  console.log('   4. Submit updated sitemap to Google Search Console')
  console.log('   5. Monitor Google Analytics for indexing and traffic')

  console.log('\n🎯 Expected SEO Impact:')
  console.log('   - 12 new comprehensive blog posts (1500-2000+ words each)')
  console.log('   - Improved keyword coverage across multiple topics')
  console.log('   - Enhanced internal linking structure')
  console.log('   - Increased domain authority and topical relevance')
  console.log('   - Better ranking potential for long-tail keywords')

  process.exit(failCount > 0 ? 1 : 0)
}

// Run main function
main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
