#!/usr/bin/env tsx
/**
 * Create UUID Generator Blog Posts (IT/EN)
 *
 * Usage:
 *   ADMIN_TOKEN=your_token npx tsx scripts/create-uuid-posts.ts
 *   ADMIN_TOKEN=your_token API_URL=http://localhost:3001 npx tsx scripts/create-uuid-posts.ts
 */

import * as fs from 'fs'
import * as path from 'path'

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

const posts: NewPost[] = [
  {
    slug: 'uuid-generator-guida-completa',
    title: 'UUID Generator: Guida Completa agli Identificatori Univoci',
    language: 'it',
    translationGroup: 'uuid-generator-001',
    filePath: './scripts/content-uuid-generator-it.html',
    excerpt: 'Genera UUID v4 online gratuitamente. Guida completa: versioni UUID, casi d\'uso, esempi di codice, best practices. Tool 100% privacy-first.',
    readTime: '9 min',
    metaTitle: 'UUID Generator Online: Genera UUID v4 Gratis',
    metaDescription: 'Tool gratuito per generare UUID v4. Guida completa: versioni, casi d\'uso, esempi codice JavaScript, Python, Java. Privacy-first, nessun upload.',
    keywords: ['uuid generator', 'generatore uuid', 'uuid v4', 'guid generator', 'unique identifier', 'uuid online'],
    tags: ['uuid', 'tools', 'development', 'identifiers', 'web']
  },
  {
    slug: 'uuid-generator-complete-guide',
    title: 'UUID Generator: Complete Guide to Unique Identifiers',
    language: 'en',
    translationGroup: 'uuid-generator-001',
    filePath: './scripts/content-uuid-generator-en.html',
    excerpt: 'Generate UUID v4 online for free. Complete guide: UUID versions, use cases, code examples, best practices. 100% privacy-first tool.',
    readTime: '9 min',
    metaTitle: 'UUID Generator Online: Generate UUID v4 Free',
    metaDescription: 'Free tool to generate UUID v4. Complete guide: versions, use cases, JavaScript, Python, Java code examples. Privacy-first, no uploads.',
    keywords: ['uuid generator', 'uuid v4', 'guid generator', 'unique identifier', 'uuid online', 'generate uuid'],
    tags: ['uuid', 'tools', 'development', 'identifiers', 'web']
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
  console.log('║          Create UUID Generator Blog Posts                 ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`🌐 Target: ${API_URL}`)

  if (!ADMIN_TOKEN) {
    console.error('❌ Error: ADMIN_TOKEN required\n')
    console.log('Usage:')
    console.log('  ADMIN_TOKEN=xxx npx tsx scripts/create-uuid-posts.ts')
    process.exit(1)
  }

  console.log('✅ Using ADMIN_TOKEN\n')
  console.log('🚀 Creating posts...\n')

  let successCount = 0
  let totalWords = 0

  for (const post of posts) {
    const lang = post.language.toUpperCase()
    process.stdout.write(`[${lang}] ${post.slug}...`)

    const result = await createPost(post, ADMIN_TOKEN)

    if (result.success && result.wordCount) {
      console.log(` ✅ (${result.wordCount} words)`)
      successCount++
      totalWords += result.wordCount
    } else {
      console.log(` ❌ ${result.error}`)
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n' + '═'.repeat(60))
  console.log(`✅ Created: ${successCount}/${posts.length}`)
  console.log(`📝 Total words: ${totalWords.toLocaleString()}`)

  if (successCount > 0) {
    console.log('\n✅ UUID Generator posts created!')
    console.log(`📝 Verify at: ${API_URL}/blog`)
  }

  process.exit(successCount === posts.length ? 0 : 1)
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
