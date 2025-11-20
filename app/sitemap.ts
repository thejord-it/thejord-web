import { MetadataRoute } from 'next'
import { getBlogPosts, BlogPostListItem } from '@/lib/api'
import { TOOLS } from '@/lib/tools-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thejord.it'

  // Fetch all published blog posts
  let posts: BlogPostListItem[] = []
  try {
    posts = await getBlogPosts('it')
  } catch (error) {
    console.warn('Failed to fetch blog posts for sitemap:', error)
    // Continue without blog posts
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Dynamic blog post pages
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages, ...toolPages]
}
