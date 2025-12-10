#!/usr/bin/env tsx
/**
 * Create Blog Posts for Multiple Tools
 *
 * Creates blog posts (IT/EN) for 5 tools:
 * - URL Encoder/Decoder
 * - Markdown Converter
 * - Color Converter
 * - Lorem Ipsum Generator
 * - PDF Tools
 *
 * Usage:
 *   ADMIN_TOKEN=your_token npx tsx scripts/create-tool-posts.ts
 *   ADMIN_TOKEN=your_token npx tsx scripts/create-tool-posts.ts --staging
 *
 * Options:
 *   --staging  Use staging URL (staging.thejord.it)
 *   --dry-run  Show what would be created without actually creating
 */

import * as fs from 'fs'
import * as path from 'path'

const isStaging = process.argv.includes('--staging')
const isDryRun = process.argv.includes('--dry-run')

const API_URL = process.env.API_URL || (isStaging ? 'https://staging.thejord.it' : 'https://thejord.it')
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
  // URL Encoder
  {
    slug: 'url-encoder-decoder-guida-completa',
    title: 'URL Encoder/Decoder: Guida Completa alla Codifica URL',
    language: 'it',
    translationGroup: 'url-encoder-001',
    filePath: './scripts/content-url-encoder-it.html',
    excerpt: 'Codifica e decodifica URL online. Guida completa a encodeURIComponent, percent-encoding, caratteri riservati e sicurezza. Tool gratuito 100% privacy-first.',
    readTime: '8 min',
    metaTitle: 'URL Encoder/Decoder Online: Codifica URL Gratis',
    metaDescription: 'Tool gratuito per codificare e decodificare URL. Guida encodeURIComponent, percent-encoding, caratteri speciali. Privacy-first, nessun upload.',
    keywords: ['url encoder', 'url decoder', 'codifica url', 'percent encoding', 'encodeURIComponent', 'urlencode'],
    tags: ['url', 'encoding', 'development', 'tools', 'web']
  },
  {
    slug: 'url-encoder-decoder-complete-guide',
    title: 'URL Encoder/Decoder: Complete Guide to URL Encoding',
    language: 'en',
    translationGroup: 'url-encoder-001',
    filePath: './scripts/content-url-encoder-en.html',
    excerpt: 'Encode and decode URLs online. Complete guide to encodeURIComponent, percent-encoding, reserved characters and security. Free 100% privacy-first tool.',
    readTime: '8 min',
    metaTitle: 'URL Encoder/Decoder Online: Encode URLs Free',
    metaDescription: 'Free tool to encode and decode URLs. Guide to encodeURIComponent, percent-encoding, special characters. Privacy-first, no uploads.',
    keywords: ['url encoder', 'url decoder', 'encode url', 'percent encoding', 'encodeURIComponent', 'urlencode'],
    tags: ['url', 'encoding', 'development', 'tools', 'web']
  },

  // Markdown Converter
  {
    slug: 'markdown-converter-guida-completa',
    title: 'Markdown Converter: Guida Completa alla Conversione Markdown',
    language: 'it',
    translationGroup: 'markdown-converter-001',
    filePath: './scripts/content-markdown-converter-it.html',
    excerpt: 'Converti Markdown in HTML e viceversa online. Guida completa alla sintassi Markdown, tabelle, code blocks, GFM. Tool gratuito privacy-first.',
    readTime: '10 min',
    metaTitle: 'Markdown Converter Online: Converti MD in HTML Gratis',
    metaDescription: 'Tool gratuito per convertire Markdown in HTML. Guida completa sintassi, tabelle, code blocks, GFM. Privacy-first, elaborazione locale.',
    keywords: ['markdown converter', 'markdown to html', 'html to markdown', 'convertire markdown', 'markdown editor', 'gfm'],
    tags: ['markdown', 'html', 'development', 'tools', 'writing']
  },
  {
    slug: 'markdown-converter-complete-guide',
    title: 'Markdown Converter: Complete Guide to Markdown Conversion',
    language: 'en',
    translationGroup: 'markdown-converter-001',
    filePath: './scripts/content-markdown-converter-en.html',
    excerpt: 'Convert Markdown to HTML and vice versa online. Complete guide to Markdown syntax, tables, code blocks, GFM. Free privacy-first tool.',
    readTime: '10 min',
    metaTitle: 'Markdown Converter Online: Convert MD to HTML Free',
    metaDescription: 'Free tool to convert Markdown to HTML. Complete syntax guide, tables, code blocks, GFM. Privacy-first, local processing.',
    keywords: ['markdown converter', 'markdown to html', 'html to markdown', 'convert markdown', 'markdown editor', 'gfm'],
    tags: ['markdown', 'html', 'development', 'tools', 'writing']
  },

  // Color Converter
  {
    slug: 'color-converter-guida-completa',
    title: 'Color Converter: Guida Completa alla Conversione Colori',
    language: 'it',
    translationGroup: 'color-converter-001',
    filePath: './scripts/content-color-converter-it.html',
    excerpt: 'Converti colori tra HEX, RGB e HSL online. Guida completa ai formati colore CSS, teoria del colore, accessibilità WCAG. Tool gratuito privacy-first.',
    readTime: '9 min',
    metaTitle: 'Color Converter Online: Converti HEX RGB HSL Gratis',
    metaDescription: 'Tool gratuito per convertire colori HEX, RGB, HSL. Guida formati CSS, color picker, contrasto WCAG. Privacy-first, elaborazione locale.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'convertire colori', 'css colors', 'color picker'],
    tags: ['colors', 'css', 'design', 'tools', 'web']
  },
  {
    slug: 'color-converter-complete-guide',
    title: 'Color Converter: Complete Guide to Color Conversion',
    language: 'en',
    translationGroup: 'color-converter-001',
    filePath: './scripts/content-color-converter-en.html',
    excerpt: 'Convert colors between HEX, RGB and HSL online. Complete guide to CSS color formats, color theory, WCAG accessibility. Free privacy-first tool.',
    readTime: '9 min',
    metaTitle: 'Color Converter Online: Convert HEX RGB HSL Free',
    metaDescription: 'Free tool to convert colors HEX, RGB, HSL. CSS format guide, color picker, WCAG contrast. Privacy-first, local processing.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'convert colors', 'css colors', 'color picker'],
    tags: ['colors', 'css', 'design', 'tools', 'web']
  },

  // Lorem Ipsum
  {
    slug: 'lorem-ipsum-generator-guida-completa',
    title: 'Lorem Ipsum Generator: Guida Completa al Testo Placeholder',
    language: 'it',
    translationGroup: 'lorem-ipsum-001',
    filePath: './scripts/content-lorem-ipsum-it.html',
    excerpt: 'Genera Lorem Ipsum online per paragrafi, frasi, parole o byte. Storia, varianti, casi d\'uso e alternative. Tool gratuito privacy-first per designer.',
    readTime: '8 min',
    metaTitle: 'Lorem Ipsum Generator Online: Genera Testo Placeholder Gratis',
    metaDescription: 'Tool gratuito per generare Lorem Ipsum. Personalizza paragrafi, frasi, parole. Storia, varianti, best practices. Privacy-first.',
    keywords: ['lorem ipsum generator', 'generatore lorem ipsum', 'testo placeholder', 'dummy text', 'filler text'],
    tags: ['lorem ipsum', 'design', 'mockup', 'tools', 'web']
  },
  {
    slug: 'lorem-ipsum-generator-complete-guide',
    title: 'Lorem Ipsum Generator: Complete Guide to Placeholder Text',
    language: 'en',
    translationGroup: 'lorem-ipsum-001',
    filePath: './scripts/content-lorem-ipsum-en.html',
    excerpt: 'Generate Lorem Ipsum online by paragraphs, sentences, words or bytes. History, variants, use cases and alternatives. Free privacy-first tool for designers.',
    readTime: '8 min',
    metaTitle: 'Lorem Ipsum Generator Online: Generate Placeholder Text Free',
    metaDescription: 'Free tool to generate Lorem Ipsum. Customize paragraphs, sentences, words. History, variants, best practices. Privacy-first.',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'filler text', 'generate lorem ipsum'],
    tags: ['lorem ipsum', 'design', 'mockup', 'tools', 'web']
  },

  // PDF Tools
  {
    slug: 'pdf-tools-guida-completa',
    title: 'PDF Tools: Guida Completa per Unire, Dividere e Modificare PDF',
    language: 'it',
    translationGroup: 'pdf-tools-001',
    filePath: './scripts/content-pdf-tools-it.html',
    excerpt: 'Suite completa per PDF: unisci, dividi, modifica, converti e comprimi. 100% offline, nessun upload. Tool gratuito privacy-first per professionisti.',
    readTime: '11 min',
    metaTitle: 'PDF Tools Online: Unisci Dividi Comprimi PDF Gratis',
    metaDescription: 'Tool gratuito per gestire PDF: merge, split, edit, convert, compress. Privacy totale, elaborazione locale. Nessun limite o registrazione.',
    keywords: ['pdf tools', 'unire pdf', 'dividere pdf', 'comprimere pdf', 'merge pdf', 'split pdf', 'pdf editor'],
    tags: ['pdf', 'tools', 'productivity', 'documents', 'office']
  },
  {
    slug: 'pdf-tools-complete-guide',
    title: 'PDF Tools: Complete Guide to Merge, Split and Edit PDFs',
    language: 'en',
    translationGroup: 'pdf-tools-001',
    filePath: './scripts/content-pdf-tools-en.html',
    excerpt: 'Complete PDF suite: merge, split, edit, convert and compress. 100% offline, no uploads. Free privacy-first tool for professionals.',
    readTime: '11 min',
    metaTitle: 'PDF Tools Online: Merge Split Compress PDF Free',
    metaDescription: 'Free tool to manage PDFs: merge, split, edit, convert, compress. Total privacy, local processing. No limits or registration.',
    keywords: ['pdf tools', 'merge pdf', 'split pdf', 'compress pdf', 'pdf editor', 'combine pdf', 'pdf converter'],
    tags: ['pdf', 'tools', 'productivity', 'documents', 'office']
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

    if (isDryRun) {
      return { success: true, postId: 'dry-run', wordCount }
    }

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
  console.log('║          Create Tool Blog Posts (5 Tools)                ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to create: ${newPosts.length} (5 tools × 2 languages)`)
  console.log(`🌐 Target: ${API_URL}`)
  if (isDryRun) console.log(`🧪 DRY RUN MODE - No posts will be created`)
  console.log()

  if (!ADMIN_TOKEN && !isDryRun) {
    console.error('❌ Error: ADMIN_TOKEN required\n')
    console.log('Usage:')
    console.log('  ADMIN_TOKEN=xxx npx tsx scripts/create-tool-posts.ts')
    console.log('  ADMIN_TOKEN=xxx npx tsx scripts/create-tool-posts.ts --staging')
    console.log('  npx tsx scripts/create-tool-posts.ts --dry-run\n')
    process.exit(1)
  }

  if (!isDryRun) console.log('✅ Using ADMIN_TOKEN\n')
  console.log('🚀 Creating posts...\n')

  let successCount = 0
  let failCount = 0
  let totalWords = 0

  const toolGroups = [
    { name: 'URL Encoder', posts: newPosts.slice(0, 2) },
    { name: 'Markdown Converter', posts: newPosts.slice(2, 4) },
    { name: 'Color Converter', posts: newPosts.slice(4, 6) },
    { name: 'Lorem Ipsum', posts: newPosts.slice(6, 8) },
    { name: 'PDF Tools', posts: newPosts.slice(8, 10) }
  ]

  for (const group of toolGroups) {
    console.log(`\n📁 ${group.name}`)
    console.log('─'.repeat(40))

    for (const post of group.posts) {
      const lang = post.language.toUpperCase()
      process.stdout.write(`   [${lang}] ${post.slug.substring(0, 35)}...`)

      const result = await createPost(post, ADMIN_TOKEN)

      if (result.success && result.wordCount) {
        console.log(` ✅ (${result.wordCount} words)`)
        successCount++
        totalWords += result.wordCount
      } else {
        console.log(` ❌ ${result.error}`)
        failCount++
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  console.log('\n' + '═'.repeat(60))
  console.log('📊 SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Created: ${successCount}/${newPosts.length}`)
  console.log(`❌ Failed: ${failCount}/${newPosts.length}`)
  console.log(`📝 Total words: ${totalWords.toLocaleString()}`)

  if (successCount > 0 && !isDryRun) {
    console.log('\n✅ Blog posts created successfully!')
    console.log('\n📝 Next steps:')
    console.log(`   1. Verify posts at: ${API_URL}/admin/posts`)
    console.log(`   2. Test posts on production: ${API_URL}/blog`)
    console.log('   3. Submit updated sitemap to Google Search Console')
  }

  if (isDryRun) {
    console.log('\n🧪 Dry run complete. Run without --dry-run to create posts.')
  }

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
