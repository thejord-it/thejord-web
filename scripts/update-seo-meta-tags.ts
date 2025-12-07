#!/usr/bin/env tsx
/**
 * SPRINT 1: Update Meta Tags for all 20 blog posts
 *
 * This script updates metaTitle, metaDescription, and keywords for all posts
 * to improve SEO and Google ranking.
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/update-seo-meta-tags.ts
 *
 * Or for staging:
 *   ADMIN_TOKEN=your_token API_URL=https://staging.thejord.it npx tsx scripts/update-seo-meta-tags.ts
 *
 * Or run interactively (script will prompt for token):
 *   npx tsx scripts/update-seo-meta-tags.ts
 */

import { seoMetadata, stats } from './seo-metadata'
import * as readline from 'readline'

// Configuration
const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

interface UpdateResult {
  id: string
  slug: string
  success: boolean
  error?: string
}

/**
 * Prompt user for admin token if not provided via env
 */
async function promptForToken(): Promise<string> {
  if (ADMIN_TOKEN) {
    console.log('✅ Using ADMIN_TOKEN from environment variable\n')
    return ADMIN_TOKEN
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('\n🔑 Enter admin token (from cookie thejord_admin_token): ', (token) => {
      rl.close()
      resolve(token.trim())
    })
  })
}

/**
 * Update a single post's meta tags
 */
async function updatePostMetaTags(
  id: string,
  metaTitle: string,
  metaDescription: string,
  keywords: string[],
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/proxy/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        metaTitle,
        metaDescription,
        keywords
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      }
    }

    return { success: true }
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
  console.log('║   SPRINT 1: SEO Meta Tags Update for THEJORD Blog Posts  ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to update: ${stats.totalPosts}`)
  console.log(`   - Italian: ${stats.italianPosts}`)
  console.log(`   - English: ${stats.englishPosts}`)
  console.log(`   - Avg keywords per post: ${stats.avgKeywordsPerPost}\n`)

  console.log(`🌐 API URL: ${API_URL}\n`)

  // Get admin token
  const token = await promptForToken()

  if (!token) {
    console.error('❌ Error: Admin token is required')
    console.log('\nYou can provide the token via:')
    console.log('  1. Environment variable: ADMIN_TOKEN=xxx npx tsx scripts/update-seo-meta-tags.ts')
    console.log('  2. Interactive prompt (run script without ADMIN_TOKEN)')
    console.log('\nTo get the token:')
    console.log('  1. Login to admin panel: https://thejord.it/admin')
    console.log('  2. Open browser DevTools > Application > Cookies')
    console.log('  3. Copy value of "thejord_admin_token" cookie')
    process.exit(1)
  }

  console.log('🚀 Starting meta tags update...\n')

  const results: UpdateResult[] = []
  let successCount = 0
  let failCount = 0

  // Update each post
  for (const [index, post] of seoMetadata.entries()) {
    const progress = `[${index + 1}/${seoMetadata.length}]`

    process.stdout.write(`${progress} Updating ${post.slug} (${post.language})...`)

    const result = await updatePostMetaTags(
      post.id,
      post.metaTitle,
      post.metaDescription,
      post.keywords,
      token
    )

    if (result.success) {
      console.log(' ✅')
      successCount++
    } else {
      console.log(` ❌ ${result.error}`)
      failCount++
    }

    results.push({
      id: post.id,
      slug: post.slug,
      success: result.success,
      error: result.error
    })

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('📊 UPDATE SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Successful: ${successCount}/${seoMetadata.length}`)
  console.log(`❌ Failed: ${failCount}/${seoMetadata.length}`)

  if (failCount > 0) {
    console.log('\n❌ Failed posts:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.slug}: ${r.error}`)
      })
  }

  console.log('\n✅ Meta tags update completed!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify updates at: https://thejord.it/admin/posts')
  console.log('   2. Check 2-3 posts to ensure meta tags are populated')
  console.log('   3. Test Google Search preview with updated meta descriptions')
  console.log('   4. Submit sitemap to Google Search Console')

  process.exit(failCount > 0 ? 1 : 0)
}

// Run main function
main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
