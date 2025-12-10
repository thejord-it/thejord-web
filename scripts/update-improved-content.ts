#!/usr/bin/env tsx
/**
 * SPRINT 2: Deploy Improved Content for Top 3 Tools
 *
 * This script updates the content field for 6 blog posts (3 tools × 2 languages)
 * with comprehensive SEO-optimized content (1600-1900 words each).
 *
 * Updated Posts:
 * - Diff Checker (IT/EN): 250 → 1850 words
 * - Hash Generator (IT/EN): 280 → 1900 words
 * - Base64 (IT/EN): 600 → 1700 words
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/update-improved-content.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// Configuration
const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

interface ContentUpdate {
  id: string
  slug: string
  title: string
  language: 'it' | 'en'
  filePath: string
  excerpt: string
  readTime: string
}

const contentUpdates: ContentUpdate[] = [
  // DIFF CHECKER
  {
    id: 'diff-it-001',
    slug: 'diff-checker-confronta-testi',
    title: 'Diff Checker: Come Confrontare Testi e Codice Online',
    language: 'it',
    filePath: './scripts/content-diff-checker-it.html',
    excerpt: 'Guida completa al Diff Checker: scopri come confrontare testi, codice e file online. Algoritmi diff, casi d\'uso reali, esempi pratici e best practices per sviluppatori.',
    readTime: '8 min'
  },
  {
    id: 'diff-en-001',
    slug: 'diff-checker-compare-texts',
    title: 'Diff Checker: How to Compare Texts and Code Online',
    language: 'en',
    filePath: './scripts/content-diff-checker-en.html',
    excerpt: 'Complete guide to Diff Checker: learn how to compare texts, code, and files online. Diff algorithms, real-world use cases, practical examples, and best practices for developers.',
    readTime: '8 min'
  },

  // HASH GENERATOR
  {
    id: 'hash-gen-it-001',
    slug: 'hash-generator-guida-completa',
    title: 'Hash Generator: Guida Completa a MD5, SHA-1, SHA-256 e SHA-512',
    language: 'it',
    filePath: './scripts/content-hash-generator-it.html',
    excerpt: 'Guida completa agli algoritmi di hashing: MD5, SHA-1, SHA-256, SHA-512 e HMAC. Scopri come funzionano, quando usarli, sicurezza e casi d\'uso pratici per password, blockchain e API.',
    readTime: '9 min'
  },
  {
    id: 'hash-gen-en-001',
    slug: 'hash-generator-complete-guide',
    title: 'Hash Generator: Complete Guide to MD5, SHA-1, SHA-256 and SHA-512',
    language: 'en',
    filePath: './scripts/content-hash-generator-en.html',
    excerpt: 'Complete guide to hashing algorithms: MD5, SHA-1, SHA-256, SHA-512, and HMAC. Learn how they work, when to use them, security considerations, and practical use cases for passwords, blockchain, and APIs.',
    readTime: '9 min'
  },

  // BASE64
  {
    id: '640ca7d7-6d39-415f-9f57-c4f819fb55b0',
    slug: 'base64-encoder-decoder-guida',
    title: 'Base64 Encoder/Decoder: Guida Completa e Strumento Gratuito',
    language: 'it',
    filePath: './scripts/content-base64-it.html',
    excerpt: 'Guida completa a Base64: scopri come funziona l\'encoding, quando usarlo (data URI, JSON, JWT), esempi di codice in JavaScript/Node.js/Python/PHP e differenze con encryption.',
    readTime: '8 min'
  },
  {
    id: '0197f1a1-ec8b-414b-967d-0f52cebe955f',
    slug: 'base64-encoder-decoder-guide',
    title: 'Base64 Encoder/Decoder: Complete Guide and Free Tool',
    language: 'en',
    filePath: './scripts/content-base64-en.html',
    excerpt: 'Complete Base64 guide: learn how encoding works, when to use it (data URI, JSON, JWT), code examples in JavaScript/Node.js/Python/PHP, and differences with encryption.',
    readTime: '8 min'
  }
]

interface UpdateResult {
  id: string
  slug: string
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
 * Update a single post's content
 */
async function updatePostContent(
  update: ContentUpdate,
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
    const response = await fetch(`${API_URL}/api/proxy/api/posts/${update.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
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
  console.log('║   SPRINT 2: Deploy Improved Content for Top 3 Tools     ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to update: ${contentUpdates.length}`)
  console.log(`   - Diff Checker: 2 posts (IT/EN)`)
  console.log(`   - Hash Generator: 2 posts (IT/EN)`)
  console.log(`   - Base64: 2 posts (IT/EN)\n`)

  console.log(`🌐 API URL: ${API_URL}\n`)

  // Check token
  if (!ADMIN_TOKEN) {
    console.error('❌ Error: ADMIN_TOKEN environment variable is required\n')
    console.log('Usage:')
    console.log('  ADMIN_TOKEN=xxx API_URL=https://thejord.it npx tsx scripts/update-improved-content.ts\n')
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

  console.log('\n🚀 Starting content deployment...\n')

  const results: UpdateResult[] = []
  let successCount = 0
  let failCount = 0
  let totalWordsBefore = 0
  let totalWordsAfter = 0

  // Estimated word counts before (from analysis)
  const wordsBefore = {
    'diff-it-001': 250,
    'diff-en-001': 250,
    'hash-gen-it-001': 280,
    'hash-gen-en-001': 280,
    '640ca7d7-6d39-415f-9f57-c4f819fb55b0': 600,
    '0197f1a1-ec8b-414b-967d-0f52cebe955f': 600
  }

  // Update each post
  for (const [index, update] of contentUpdates.entries()) {
    const progress = `[${index + 1}/${contentUpdates.length}]`
    const before = wordsBefore[update.id as keyof typeof wordsBefore] || 0
    totalWordsBefore += before

    process.stdout.write(`${progress} Updating ${update.slug} (${update.language})...`)

    const result = await updatePostContent(update, ADMIN_TOKEN)

    if (result.success && result.wordCount) {
      console.log(` ✅ (${before} → ${result.wordCount} words, +${result.wordCount - before})`)
      successCount++
      totalWordsAfter += result.wordCount
    } else {
      console.log(` ❌ ${result.error}`)
      failCount++
    }

    results.push({
      id: update.id,
      slug: update.slug,
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
  console.log(`✅ Successful: ${successCount}/${contentUpdates.length}`)
  console.log(`❌ Failed: ${failCount}/${contentUpdates.length}`)
  console.log(`\n📈 Content Growth:`)
  console.log(`   Before: ${totalWordsBefore} words total`)
  console.log(`   After:  ${totalWordsAfter} words total`)
  console.log(`   Growth: +${totalWordsAfter - totalWordsBefore} words (+${Math.round((totalWordsAfter / totalWordsBefore - 1) * 100)}%)`)

  if (failCount > 0) {
    console.log('\n❌ Failed posts:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.slug}: ${r.error}`)
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
  console.log('   - Improved keyword density and coverage')
  console.log('   - Better ranking for long-tail keywords')
  console.log('   - Increased time-on-page and engagement')
  console.log('   - Featured snippets potential (FAQ sections)')

  process.exit(failCount > 0 ? 1 : 0)
}

// Run main function
main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
