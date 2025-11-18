// API client for THEJORD API

const API_URL = process.env.API_URL || 'http://localhost:4000'

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
}

export interface BlogPostListItem extends Omit<BlogPost, 'content'> {}

/**
 * Fetch all blog posts for a given language
 */
export async function getBlogPosts(language: string = 'it'): Promise<BlogPostListItem[]> {
  const res = await fetch(`${API_URL}/api/posts?lang=${language}&published=true`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch blog posts: ${res.statusText}`)
  }

  const data = await res.json()
  return data.data || []
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPost(slug: string, language: string = 'it'): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/api/posts/${slug}?lang=${language}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch blog post: ${res.statusText}`)
  }

  const data = await res.json()
  return data.data || null
}

/**
 * Get all blog post slugs for static path generation
 */
export async function getAllBlogPostSlugs(language: string = 'it'): Promise<string[]> {
  const posts = await getBlogPosts(language)
  return posts.map(post => post.slug)
}
