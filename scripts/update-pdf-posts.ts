#!/usr/bin/env tsx
/**
 * Update PDF Tools Blog Posts
 *
 * Updates the PDF Tools blog posts (IT/EN) with new Ghostscript WASM content.
 *
 * Usage:
 *   ADMIN_TOKEN=your_token npx tsx scripts/update-pdf-posts.ts
 *   ADMIN_TOKEN=your_token npx tsx scripts/update-pdf-posts.ts --staging
 *
 * Options:
 *   --staging  Use staging URL (staging.thejord.it)
 *   --dry-run  Show what would be updated without actually updating
 */

import * as fs from 'fs'
import * as path from 'path'

const isStaging = process.argv.includes('--staging')
const isDryRun = process.argv.includes('--dry-run')

const API_URL = process.env.API_URL || (isStaging ? 'https://staging.thejord.it' : 'https://thejord.it')
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

interface PostUpdate {
  slug: string
  language: 'it' | 'en'
  filePath: string
}

const postsToUpdate: PostUpdate[] = [
  {
    slug: 'pdf-tools-guida-completa',
    language: 'it',
    filePath: './scripts/content-pdf-tools-it.html'
  },
  {
    slug: 'pdf-tools-complete-guide',
    language: 'en',
    filePath: './scripts/content-pdf-tools-en.html'
  }
]

async function getPostBySlug(slug: string, language: string, token: string): Promise<{ id: string } | null> {
  try {
    const response = await fetch(`${API_URL}/api/proxy/api/posts?slug=${slug}&language=${language}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return null
    }

    const result = await response.json()
    // Handle different API response formats
    const posts = result.data?.posts || result.posts || result.data || result
    if (Array.isArray(posts) && posts.length > 0) {
      return { id: posts[0].id }
    }
    if (result.id) {
      return { id: result.id }
    }
    return null
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error)
    return null
  }
}

async function updatePost(postId: string, content: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isDryRun) {
      return { success: true }
    }

    const response = await fetch(`${API_URL}/api/proxy/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        updatedAt: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: `HTTP ${response.status}: ${errorText}` }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║          Update PDF Tools Blog Posts                      ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  console.log(`📊 Posts to update: ${postsToUpdate.length}`)
  console.log(`🌐 Target: ${API_URL}`)
  if (isDryRun) console.log(`🧪 DRY RUN MODE - No posts will be updated`)
  console.log()

  if (!ADMIN_TOKEN && !isDryRun) {
    console.error('❌ Error: ADMIN_TOKEN required\n')
    console.log('Usage:')
    console.log('  ADMIN_TOKEN=xxx npx tsx scripts/update-pdf-posts.ts')
    console.log('  ADMIN_TOKEN=xxx npx tsx scripts/update-pdf-posts.ts --staging')
    console.log('  npx tsx scripts/update-pdf-posts.ts --dry-run\n')
    process.exit(1)
  }

  if (!isDryRun) console.log('✅ Using ADMIN_TOKEN\n')
  console.log('🚀 Updating posts...\n')

  let successCount = 0
  let failCount = 0

  for (const post of postsToUpdate) {
    const langEmoji = post.language === 'it' ? '🇮🇹' : '🇬🇧'
    console.log(`${langEmoji} ${post.slug}`)

    // Read content file
    const contentPath = path.resolve(process.cwd(), post.filePath)
    if (!fs.existsSync(contentPath)) {
      console.log(`   ❌ File not found: ${contentPath}\n`)
      failCount++
      continue
    }

    const content = fs.readFileSync(contentPath, 'utf-8')
    console.log(`   📄 Content loaded (${content.length} chars)`)

    if (isDryRun) {
      console.log(`   🧪 Would update with new content\n`)
      successCount++
      continue
    }

    // Get post ID by slug
    const existingPost = await getPostBySlug(post.slug, post.language, ADMIN_TOKEN)
    if (!existingPost) {
      console.log(`   ⚠️ Post not found in database - skipping\n`)
      failCount++
      continue
    }

    console.log(`   🔍 Found post ID: ${existingPost.id}`)

    // Update post
    const result = await updatePost(existingPost.id, content, ADMIN_TOKEN)
    if (result.success) {
      console.log(`   ✅ Updated successfully\n`)
      successCount++
    } else {
      console.log(`   ❌ Error: ${result.error}\n`)
      failCount++
    }
  }

  console.log('═══════════════════════════════════════════════════════════')
  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Updated: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)

  if (successCount > 0 && !isDryRun) {
    console.log(`\n🎉 PDF Tools blog posts updated with Ghostscript WASM content!`)
  }
}

main().catch(console.error)
