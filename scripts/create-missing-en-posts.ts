#!/usr/bin/env tsx
/**
 * Create Missing English Blog Posts
 *
 * Create the 6 missing English versions of blog posts.
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/create-missing-en-posts.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

interface NewPost {
  slug: string
  title: string
  language: 'en'
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

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  return words.length
}

async function createPost(post: NewPost, token: string) {
  try {
    const contentPath = path.resolve(process.cwd(), post.filePath)
    if (!fs.existsSync(contentPath)) {
      return { success: false, error: `File not found: ${contentPath}` }
    }

    const content = fs.readFileSync(contentPath, 'utf-8')
    const wordCount = countWords(content)

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
      return { success: false, error: `HTTP ${response.status}: ${errorText}` }
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

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║      Create Missing English Blog Posts                  ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to create: ${newPosts.length} (all EN)\n`)

  if (!ADMIN_TOKEN) {
    console.error('❌ Error: ADMIN_TOKEN required\n')
    process.exit(1)
  }

  console.log('✅ Using ADMIN_TOKEN\n')
  console.log('🚀 Creating posts...\n')

  let successCount = 0
  let failCount = 0

  for (const [index, post] of newPosts.entries()) {
    const progress = `[${index + 1}/${newPosts.length}]`
    process.stdout.write(`${progress} Creating ${post.slug}...`)

    const result = await createPost(post, ADMIN_TOKEN)

    if (result.success && result.wordCount) {
      console.log(` ✅ (${result.wordCount} words)`)
      successCount++
    } else {
      console.log(` ❌ ${result.error}`)
      failCount++
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n' + '═'.repeat(60))
  console.log('📊 SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Created: ${successCount}/${newPosts.length}`)
  console.log(`❌ Failed: ${failCount}/${newPosts.length}`)
  console.log('\n✅ English posts created!')

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
