#!/usr/bin/env tsx
/**
 * Delete Duplicate Blog Posts
 *
 * This script deletes old/duplicate blog posts that have been replaced
 * with improved SEO-optimized versions.
 *
 * Posts to DELETE (12 total):
 * - cron-expression-builder (IT/EN) → replaced by cron-expression-builder-guida
 * - regex-tester-italiano-pattern (IT/EN) → replaced by regex-tester-espressioni-regolari
 * - come-validare-json-online (IT/EN) → replaced by json-formatter-validator-guida
 * - migrazione-nextjs-16-thejord (IT/EN) → replaced by migrazione-nextjs-16-performance-turbopack
 * - internazionalizzazione-sito-multilingue (IT/EN) → replaced by internazionalizzazione-i18n-nextjs
 * - lancio-thejord-it (IT/EN) → replaced by benvenuto-su-thejord-piattaforma-developer-tools
 *
 * Usage:
 *   ADMIN_TOKEN=your_token API_URL=https://thejord.it npx tsx scripts/delete-duplicate-posts.ts
 */

// Configuration
const API_URL = process.env.API_URL || 'https://thejord.it'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

// Slugs of posts to DELETE (old duplicates - EN versions)
const slugsToDelete = [
  'cron-expression-builder',
  'how-to-validate-json-online',
  'internationalization-multilingual-website',
  'nextjs-16-migration-thejord',
  'regex-tester-patterns-guide',
  'thejord-launch-announcement'
]

interface BlogPost {
  id: string
  slug: string
  language: string
  title: string
}

interface DeleteResult {
  slug: string
  language: string
  success: boolean
  error?: string
}

/**
 * Fetch all posts
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

  if (Array.isArray(data)) {
    return data
  } else if (data && Array.isArray(data.data)) {
    return data.data
  } else if (data && Array.isArray(data.posts)) {
    return data.posts
  } else {
    throw new Error('API response is not in expected format')
  }
}

/**
 * Delete a post by ID
 */
async function deletePost(
  postId: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/proxy/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
  console.log('║        Delete Duplicate/Old Blog Posts                   ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`🗑️  Posts to delete: ${slugsToDelete.length} slugs (IT/EN versions)`)
  console.log(`   - cron-expression-builder`)
  console.log(`   - regex-tester-italiano-pattern`)
  console.log(`   - come-validare-json-online`)
  console.log(`   - migrazione-nextjs-16-thejord`)
  console.log(`   - internazionalizzazione-sito-multilingue`)
  console.log(`   - lancio-thejord-it\n`)

  console.log(`🌐 API URL: ${API_URL}\n`)

  // Check token
  if (!ADMIN_TOKEN) {
    console.error('❌ Error: ADMIN_TOKEN environment variable is required\n')
    console.log('Usage:')
    console.log('  ADMIN_TOKEN=xxx API_URL=https://thejord.it npx tsx scripts/delete-duplicate-posts.ts\n')
    process.exit(1)
  }

  console.log('✅ Using ADMIN_TOKEN from environment variable\n')

  // Fetch all posts
  console.log('🔍 Fetching all posts to find duplicates...')
  let allPosts: BlogPost[]
  try {
    allPosts = await fetchAllPosts(ADMIN_TOKEN)
    console.log(`   ✅ Found ${allPosts.length} posts in database\n`)
  } catch (error) {
    console.error(`   ❌ Failed to fetch posts: ${error}\n`)
    process.exit(1)
  }

  // Find posts to delete
  const postsToDelete = allPosts.filter(post =>
    slugsToDelete.includes(post.slug)
  )

  if (postsToDelete.length === 0) {
    console.log('✅ No duplicate posts found. All clean!\n')
    process.exit(0)
  }

  console.log(`📋 Found ${postsToDelete.length} posts to delete:\n`)
  postsToDelete.forEach(post => {
    console.log(`   - ${post.slug} (${post.language}): "${post.title}"`)
  })

  console.log(`\n⚠️  WARNING: This will permanently delete ${postsToDelete.length} posts!`)
  console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n')

  // 3 second delay for safety
  await new Promise(resolve => setTimeout(resolve, 3000))

  console.log('🚀 Starting deletion...\n')

  const results: DeleteResult[] = []
  let successCount = 0
  let failCount = 0

  // Delete each post
  for (const [index, post] of postsToDelete.entries()) {
    const progress = `[${index + 1}/${postsToDelete.length}]`

    process.stdout.write(`${progress} Deleting ${post.slug} (${post.language})...`)

    const result = await deletePost(post.id, ADMIN_TOKEN)

    if (result.success) {
      console.log(` ✅`)
      successCount++
    } else {
      console.log(` ❌ ${result.error}`)
      failCount++
    }

    results.push({
      slug: post.slug,
      language: post.language,
      success: result.success,
      error: result.error
    })

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('📊 DELETION SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Deleted: ${successCount}/${postsToDelete.length}`)
  console.log(`❌ Failed: ${failCount}/${postsToDelete.length}`)

  if (failCount > 0) {
    console.log('\n❌ Failed deletions:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.slug} (${r.language}): ${r.error}`)
      })
  }

  console.log('\n✅ Duplicate post cleanup completed!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify posts removed at: https://thejord.it/admin/posts')
  console.log('   2. Check blog page: https://thejord.it/blog')
  console.log('   3. Sitemap will auto-update with remaining posts')
  console.log('   4. Old URLs will return 404 (expected)')

  console.log('\n🎯 SEO Benefits:')
  console.log('   - No more duplicate content penalties')
  console.log('   - Only high-quality 1500-2000+ word posts remain')
  console.log('   - Better URL structure with descriptive slugs')
  console.log('   - Cleaner site architecture for search engines')

  process.exit(failCount > 0 ? 1 : 0)
}

// Run main function
main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
