// API client for THEJORD API

// Server-side uses internal API URL, client-side uses proxy
const API_URL = typeof window === 'undefined'
  ? (process.env.API_URL || 'http://localhost:4000')
  : '/api/proxy'
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN || 'dev-token-change-in-production'

// Helper to sanitize HTML content and remove external CDN links
function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return html

  try {
    // Remove external link tags (CDN stylesheets like Font Awesome)
    html = html.replace(/<link[^>]*href=["']https?:\/\/[^"']*["'][^>]*>/gi, '')
    // Remove script tags with external sources
    html = html.replace(/<script[^>]*src=["']https?:\/\/[^"']*["'][^>]*><\/script>/gi, '')
    // Remove inline script tags
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    // Remove style tags
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    return html
  } catch (error) {
    console.error('Error sanitizing HTML:', error)
    return html
  }
}

// Helper to revalidate Next.js cache
async function revalidateCache(slug?: string) {
  // Only run on client (browser) - admin calls are client-side
  if (typeof window === 'undefined') return

  try {
    // Call the Next.js frontend revalidate endpoint
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + REVALIDATE_TOKEN,
      },
      body: JSON.stringify({
        path: '/blog',
        slug
      }),
    })
    console.log('Cache revalidated:', slug ? '/blog/' + slug : '/blog')
  } catch (error) {
    console.error('Failed to revalidate cache:', error)
    // Don't throw - revalidation failure shouldn't break the operation
  }
}

export interface BlogPost {
  id: string
  slug: string
  language: string
  title: string
  excerpt: string
  content: string
  author: string
  readTime: string
  tags: string[]
  image?: string
  icon?: string  // Icon ID from IconPicker

  // SEO fields
  metaTitle?: string
  metaDescription?: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string

  // Publishing
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string

  // Editor type
  editorType?: 'markdown' | 'wysiwyg'

  // Translation
  translationGroup?: string
}

export interface BlogPostListItem extends Omit<BlogPost, 'content'> {}

export interface BlogPostSearchOptions {
  search?: string
  tags?: string[]
}

/**
 * Fetch all blog posts for a given language with optional search and tag filters
 */
export async function getBlogPosts(
  language: string = 'it',
  options?: BlogPostSearchOptions
): Promise<BlogPostListItem[]> {
  const searchParams = new URLSearchParams({
    lang: language,
    published: 'true'
  })

  if (options?.search) {
    searchParams.append('search', options.search)
  }

  if (options?.tags && options.tags.length > 0) {
    searchParams.append('tags', options.tags.join(','))
  }

  const res = await fetch(API_URL + '/api/posts?' + searchParams.toString(), {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts: ' + res.statusText)
  }

  const data = await res.json()
  return data.data || []
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPost(slug: string, language: string = 'it'): Promise<BlogPost | null> {
  const res = await fetch(API_URL + '/api/posts/' + slug + '?lang=' + language, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error('Failed to fetch blog post: ' + res.statusText)
  }

  const data = await res.json()
  const post = data.data || null

  // Sanitize HTML content to remove external CDN links and scripts
  if (post && post.content) {
    post.content = sanitizeHTML(post.content)
  }

  return post
}

/**
 * Get all blog post slugs for static path generation
 */
export async function getAllBlogPostSlugs(language: string = 'it'): Promise<string[]> {
  const posts = await getBlogPosts(language)
  return posts.map(post => post.slug)
}

/**
 * Get translations for a blog post (returns { "it": "slug-it", "en": "slug-en" })
 */
export async function getPostTranslations(slug: string, language: string = 'it'): Promise<Record<string, string>> {
  const res = await fetch(API_URL + '/api/posts/' + slug + '/translations?lang=' + language, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return {}
  }

  const data = await res.json()
  return data.data || {}
}

// Admin API functions
const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = document.cookie.split('; ').find(row => row.startsWith('thejord_admin_token='))
    if (token) {
      return { Authorization: 'Bearer ' + token.split('=')[1] }
    }
  }
  return {}
}

export async function getAllPosts(options?: BlogPostSearchOptions): Promise<BlogPost[]> {
  const searchParams = new URLSearchParams({ published: 'all', lang: 'all' })

  if (options?.search) {
    searchParams.append('search', options.search)
  }

  if (options?.tags && options.tags.length > 0) {
    searchParams.append('tags', options.tags.join(','))
  }

  const res = await fetch(API_URL + '/api/posts?' + searchParams.toString(), {
    headers: getAuthHeader(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch posts')
  const data = await res.json()
  return data.data || []
}

export async function createPost(post: Partial<BlogPost>): Promise<BlogPost> {
  const res = await fetch(API_URL + '/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(post),
  })
  if (!res.ok) throw new Error('Failed to create post')
  const data = await res.json()
  const createdPost = data.data

  // Revalidate cache if post is published
  if (createdPost.published) {
    await revalidateCache(createdPost.slug)
  }

  return createdPost
}

export async function updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const res = await fetch(API_URL + '/api/posts/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(post),
  })
  if (!res.ok) throw new Error('Failed to update post')
  const data = await res.json()
  const updatedPost = data.data

  // Always revalidate cache when updating (published or unpublished)
  await revalidateCache(updatedPost.slug)

  return updatedPost
}

export async function getPost(id: string): Promise<BlogPost> {
  const res = await fetch(API_URL + '/api/posts/' + id, {
    headers: getAuthHeader(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch post')
  const data = await res.json()
  return data.data
}

export async function deletePost(id: string): Promise<void> {
  // First get the post to extract slug for revalidation
  const post = await getPost(id)

  const res = await fetch(API_URL + '/api/posts/' + id, {
    method: 'DELETE',
    headers: getAuthHeader(),
  })
  if (!res.ok) throw new Error('Failed to delete post')

  // Revalidate to remove from blog list
  await revalidateCache(post.slug)
}

export async function bulkDeletePosts(ids: string[]): Promise<void> {
  await Promise.all(ids.map(id => deletePost(id)))
}

export async function bulkPublishPosts(ids: string[]): Promise<void> {
  await Promise.all(ids.map(id => updatePost(id, { published: true, publishedAt: new Date().toISOString() })))
}

export async function bulkUnpublishPosts(ids: string[]): Promise<void> {
  await Promise.all(ids.map(id => updatePost(id, { published: false })))
}
