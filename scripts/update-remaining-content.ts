#!/usr/bin/env tsx
/**
 * SPRINT 3: Deploy Remaining Blog Post Content
 *
 * This script updates the content field for 12 blog posts (6 topics × 2 languages)
 * with comprehensive SEO-optimized content (1500-2000+ words each).
 *
 * Updated Posts:
 * - JSON Formatter (IT/EN): ~1850 words each
 * - RegEx Tester (IT/EN): ~1800 words each
 * - Cron Builder (IT/EN): ~1900 words each
 * - Launch Posts (IT/EN): ~1800 words each
 * - Next.js Migration (IT/EN): ~2000 words each
 * - i18n Posts (IT/EN): ~2000 words each
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/update-remaining-content.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// Configuration
const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

interface ContentUpdate {
  slug: string
  title: string
  language: 'it' | 'en'
  filePath: string
  excerpt: string
  readTime: string
}

const contentUpdates: ContentUpdate[] = [
  // JSON FORMATTER
  {
    slug: 'json-formatter-validator-guida',
    title: 'JSON Formatter & Validator: Guida Completa e Strumento Online',
    language: 'it',
    filePath: './scripts/content-json-formatter-it.html',
    excerpt: 'Guida completa al JSON Formatter: valida, formatta (prettify), minifica JSON. Visualizzazione ad albero, supporto JSON5, conversione YAML, esempi di codice e best practices.',
    readTime: '9 min'
  },
  {
    slug: 'json-formatter-validator-guide',
    title: 'JSON Formatter & Validator: Complete Guide and Online Tool',
    language: 'en',
    filePath: './scripts/content-json-formatter-en.html',
    excerpt: 'Complete guide to JSON Formatter: validate, format (prettify), minify JSON. Tree visualization, JSON5 support, YAML conversion, code examples and best practices.',
    readTime: '9 min'
  },

  // REGEX TESTER
  {
    slug: 'regex-tester-espressioni-regolari',
    title: 'RegEx Tester: Strumento Online per Testare Espressioni Regolari',
    language: 'it',
    filePath: './scripts/content-regex-tester-it.html',
    excerpt: 'Guida completa al RegEx Tester: testa espressioni regolari in tempo reale. Pattern italiani (codice fiscale, P.IVA, CAP), esempi JavaScript/Python/PHP e best practices.',
    readTime: '9 min'
  },
  {
    slug: 'regex-tester-regular-expressions',
    title: 'RegEx Tester: Online Tool for Testing Regular Expressions',
    language: 'en',
    filePath: './scripts/content-regex-tester-en.html',
    excerpt: 'Complete guide to RegEx Tester: test regular expressions in real-time. Common patterns (email, phone, SSN), JavaScript/Python/PHP examples and best practices.',
    readTime: '9 min'
  },

  // CRON BUILDER
  {
    slug: 'cron-expression-builder-guida',
    title: 'Cron Expression Builder: Generatore di Espressioni Cron Online',
    language: 'it',
    filePath: './scripts/content-cron-builder-it.html',
    excerpt: 'Guida completa al Cron Expression Builder: genera espressioni cron con interfaccia visuale. Spiegazione in italiano, esempi comuni, sintassi 5/6 campi (Quartz).',
    readTime: '10 min'
  },
  {
    slug: 'cron-expression-builder-guide',
    title: 'Cron Expression Builder: Online Cron Expression Generator',
    language: 'en',
    filePath: './scripts/content-cron-builder-en.html',
    excerpt: 'Complete guide to Cron Expression Builder: generate cron expressions with visual interface. Plain English explanation, common examples, 5/6 field syntax (Quartz).',
    readTime: '10 min'
  },

  // LAUNCH POSTS
  {
    slug: 'benvenuto-su-thejord-piattaforma-developer-tools',
    title: 'Benvenuto su THEJORD.IT: La Piattaforma di Developer Tools Italiani',
    language: 'it',
    filePath: './scripts/content-launch-it.html',
    excerpt: 'Lancio ufficiale di THEJORD.IT: piattaforma gratuita di developer tools privacy-first. 11 strumenti professionali, open source, completamente gratuiti per sviluppatori italiani e internazionali.',
    readTime: '9 min'
  },
  {
    slug: 'welcome-to-thejord-developer-tools-platform',
    title: 'Welcome to THEJORD.IT: Professional Developer Tools Platform',
    language: 'en',
    filePath: './scripts/content-launch-en.html',
    excerpt: 'Official launch of THEJORD.IT: free privacy-first developer tools platform. 11 professional tools, open source, completely free for developers worldwide.',
    readTime: '9 min'
  },

  // NEXT.JS MIGRATION
  {
    slug: 'migrazione-nextjs-16-performance-turbopack',
    title: 'Migrazione a Next.js 16: Performance, Turbopack e React 19',
    language: 'it',
    filePath: './scripts/content-nextjs-migration-it.html',
    excerpt: 'Come abbiamo migrato THEJORD a Next.js 16: architettura App Router, Turbopack (7x più veloce), React 19 Server Components, best practices e performance improvements ottenuti.',
    readTime: '11 min'
  },
  {
    slug: 'nextjs-16-migration-performance-turbopack',
    title: 'Migration to Next.js 16: Performance, Turbopack, and React 19',
    language: 'en',
    filePath: './scripts/content-nextjs-migration-en.html',
    excerpt: 'How we migrated THEJORD to Next.js 16: App Router architecture, Turbopack (7x faster), React 19 Server Components, best practices and performance improvements achieved.',
    readTime: '11 min'
  },

  // I18N POSTS
  {
    slug: 'internazionalizzazione-i18n-nextjs',
    title: 'Internazionalizzazione di THEJORD: Come Abbiamo Implementato i18n con Next.js',
    language: 'it',
    filePath: './scripts/content-i18n-it.html',
    excerpt: 'Implementazione i18n di THEJORD con Next.js 16: routing multilingua, middleware per locale detection, translation management, SEO con hreflang e best practices.',
    readTime: '10 min'
  },
  {
    slug: 'internationalization-i18n-nextjs',
    title: 'Internationalizing THEJORD: How We Implemented i18n with Next.js',
    language: 'en',
    filePath: './scripts/content-i18n-en.html',
    excerpt: 'THEJORD i18n implementation with Next.js 16: multilingual routing, locale detection middleware, translation management, SEO with hreflang and best practices.',
    readTime: '10 min'
  }
]

interface BlogPost {
  id: string
  slug: string
  language: string
  title: string
}

interface UpdateResult {
  slug: string
  language: string
  success: boolean
  wordCount?: number
  error?: string
}

/**
 * Count words in HTML content (strips tags)
 */
function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ') // Remove HTML tags
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  return words.length
}

/**
 * Fetch all posts to find IDs by slug and language
 */
async function fetchAllPosts(token: string): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/api/proxy/api/posts`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: HTTP ${response.status}`)
  }

  const data = await response.json()

  // Handle different response formats (array, object with data property, etc.)
  if (Array.isArray(data)) {
    return data
  } else if (data && Array.isArray(data.data)) {
    return data.data
  } else if (data && Array.isArray(data.posts)) {
    return data.posts
  } else {
    console.error('Unexpected API response format:', data)
    throw new Error('API response is not in expected format')
  }
}

/**
 * Update a single post's content
 */
async function updatePostContent(
  update: ContentUpdate,
  postId: string,
  token: string
): Promise<{ success: boolean; wordCount?: number; error?: string }> {
  try {
    // Read content file
    const contentPath = path.resolve(process.cwd(), update.filePath)

    if (!fs.existsSync(contentPath)) {
      return {
        success: false,
        error: `File not found: ${contentPath}`
      }
    }

    const content = fs.readFileSync(contentPath, 'utf-8')
    const wordCount = countWords(content)

    // Update via API
    const response = await fetch(`${API_URL}/api/proxy/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: update.title,
        content,
        excerpt: update.excerpt,
        readTime: update.readTime
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      }
    }

    return { success: true, wordCount }
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
  console.log('║   SPRINT 3: Deploy Remaining Blog Post Content          ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to update: ${contentUpdates.length}`)
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
    console.log('  ADMIN_TOKEN=xxx API_URL=https://thejord.it npx tsx scripts/update-remaining-content.ts\n')
    process.exit(1)
  }

  console.log('✅ Using ADMIN_TOKEN from environment variable\n')

  // Verify all content files exist
  console.log('📁 Verifying content files...')
  let missingFiles = 0
  for (const update of contentUpdates) {
    const filePath = path.resolve(process.cwd(), update.filePath)
    if (!fs.existsSync(filePath)) {
      console.log(`   ❌ Missing: ${update.filePath}`)
      missingFiles++
    } else {
      const content = fs.readFileSync(filePath, 'utf-8')
      const words = countWords(content)
      console.log(`   ✅ ${update.slug} (${words} words)`)
    }
  }

  if (missingFiles > 0) {
    console.error(`\n❌ ${missingFiles} content file(s) not found. Please generate them first.\n`)
    process.exit(1)
  }

  // Fetch all posts to find IDs
  console.log('\n🔍 Fetching existing posts to match IDs...')
  let allPosts: BlogPost[]
  try {
    allPosts = await fetchAllPosts(ADMIN_TOKEN)
    console.log(`   ✅ Found ${allPosts.length} posts in database\n`)
  } catch (error) {
    console.error(`   ❌ Failed to fetch posts: ${error}\n`)
    process.exit(1)
  }

  // Match slugs to post IDs
  const postsToUpdate: Array<{ update: ContentUpdate; postId: string }> = []
  const notFound: ContentUpdate[] = []

  for (const update of contentUpdates) {
    const post = allPosts.find(
      p => p.slug === update.slug && p.language === update.language
    )

    if (post) {
      postsToUpdate.push({ update, postId: post.id })
    } else {
      notFound.push(update)
    }
  }

  if (notFound.length > 0) {
    console.log('⚠️  Posts not found in database:')
    notFound.forEach(u => {
      console.log(`   - ${u.slug} (${u.language})`)
    })
    console.log('\n💡 These posts may need to be created first, or slugs may be different.')
    console.log(`   Found: ${postsToUpdate.length}/${contentUpdates.length} posts\n`)

    if (postsToUpdate.length === 0) {
      console.error('❌ No posts found to update. Exiting.\n')
      process.exit(1)
    }
  }

  console.log(`🚀 Starting content deployment for ${postsToUpdate.length} posts...\n`)

  const results: UpdateResult[] = []
  let successCount = 0
  let failCount = 0
  let totalWordsAfter = 0

  // Update each post
  for (const [index, { update, postId }] of postsToUpdate.entries()) {
    const progress = `[${index + 1}/${postsToUpdate.length}]`

    process.stdout.write(`${progress} Updating ${update.slug} (${update.language})...`)

    const result = await updatePostContent(update, postId, ADMIN_TOKEN)

    if (result.success && result.wordCount) {
      console.log(` ✅ (${result.wordCount} words)`)
      successCount++
      totalWordsAfter += result.wordCount
    } else {
      console.log(` ❌ ${result.error}`)
      failCount++
    }

    results.push({
      slug: update.slug,
      language: update.language,
      success: result.success,
      wordCount: result.wordCount,
      error: result.error
    })

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('📊 DEPLOYMENT SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Successful: ${successCount}/${postsToUpdate.length}`)
  console.log(`❌ Failed: ${failCount}/${postsToUpdate.length}`)
  console.log(`\n📈 Content Added:`)
  console.log(`   Total: ${totalWordsAfter} words`)
  console.log(`   Average: ${Math.round(totalWordsAfter / successCount)} words per post`)

  if (failCount > 0) {
    console.log('\n❌ Failed posts:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.slug} (${r.language}): ${r.error}`)
      })
  }

  console.log('\n✅ Content deployment completed!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify posts at: https://thejord.it/admin/posts')
  console.log('   2. Check 2-3 posts to ensure content is complete')
  console.log('   3. Test posts on production: https://thejord.it/blog')
  console.log('   4. Submit updated sitemap to Google Search Console')
  console.log('   5. Monitor Google Analytics for traffic increase')

  console.log('\n🎯 Expected SEO Impact:')
  console.log('   - 12 new comprehensive blog posts (1500-2000+ words)')
  console.log('   - Improved keyword coverage across multiple topics')
  console.log('   - Better internal linking structure')
  console.log('   - Increased domain authority and topical relevance')

  process.exit(failCount > 0 ? 1 : 0)
}

// Run main function
main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
