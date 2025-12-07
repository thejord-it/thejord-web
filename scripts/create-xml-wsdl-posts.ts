#!/usr/bin/env tsx
/**
 * Create XML & WSDL Viewer Blog Posts
 *
 * Creates 2 new comprehensive blog posts (IT/EN) for the new XML & WSDL Viewer tool.
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/create-xml-wsdl-posts.ts
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

const newPosts: NewPost[] = [
  {
    slug: 'xml-wsdl-viewer-formattatore-validatore',
    title: 'XML & WSDL Viewer: Formattatore e Validatore Online',
    language: 'it',
    translationGroup: 'xml-wsdl-001',
    filePath: './scripts/content-xml-wsdl-it.html',
    excerpt: 'Formatta, valida e visualizza XML e WSDL online. Parser WSDL avanzato, conversione XML ↔ JSON, validazione real-time. Strumento gratuito privacy-first per sviluppatori.',
    readTime: '9 min',
    metaTitle: 'XML & WSDL Viewer Online: Formatta e Valida XML Gratis',
    metaDescription: 'Tool gratuito per formattare, validare e parsare XML/WSDL. Parser WSDL, conversione XML-JSON, syntax highlighting. 100% privacy-first, nessun upload server.',
    keywords: ['xml formatter', 'wsdl parser', 'xml validator', 'xml to json', 'formattare xml', 'validare xml', 'wsdl viewer'],
    tags: ['xml', 'wsdl', 'development', 'tools', 'soap']
  },
  {
    slug: 'xml-wsdl-viewer-formatter-validator',
    title: 'XML & WSDL Viewer: Online Formatter and Validator',
    language: 'en',
    translationGroup: 'xml-wsdl-001',
    filePath: './scripts/content-xml-wsdl-en.html',
    excerpt: 'Format, validate, and view XML and WSDL online. Advanced WSDL parser, XML ↔ JSON conversion, real-time validation. Free privacy-first tool for developers.',
    readTime: '9 min',
    metaTitle: 'XML & WSDL Viewer Online: Format & Validate XML Free',
    metaDescription: 'Free tool to format, validate, and parse XML/WSDL. WSDL parser, XML-JSON converter, syntax highlighting. 100% privacy-first, no server uploads.',
    keywords: ['xml formatter', 'wsdl parser', 'xml validator', 'xml to json', 'format xml', 'validate xml', 'wsdl viewer'],
    tags: ['xml', 'wsdl', 'development', 'tools', 'soap']
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
  console.log('║        Create XML & WSDL Viewer Blog Posts              ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to create: ${newPosts.length} (IT + EN)\n`)

  if (!ADMIN_TOKEN) {
    console.error('❌ Error: ADMIN_TOKEN required\n')
    console.log('Usage:')
    console.log('  ADMIN_TOKEN=xxx API_URL=https://thejord.it npx tsx scripts/create-xml-wsdl-posts.ts\n')
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

  console.log('\n✅ XML & WSDL blog posts created!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify posts at: https://thejord.it/admin/posts')
  console.log('   2. Test posts on production: https://thejord.it/blog')
  console.log('   3. Deploy XML & WSDL Viewer tool to staging')
  console.log('   4. Submit updated sitemap to Google Search Console')

  console.log('\n🎯 New Tool:')
  console.log('   - XML & WSDL Viewer now has complete blog coverage (IT/EN)')
  console.log('   - Total blog posts: 22 (11 tools × 2 languages)')

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
