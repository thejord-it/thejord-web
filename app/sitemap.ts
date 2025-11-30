import { MetadataRoute } from 'next'
import { getBlogPosts, BlogPostListItem } from '@/lib/api'
import { TOOLS } from '@/lib/tools-config'
import { locales } from '@/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thejord.it'
  const sitemap: MetadataRoute.Sitemap = []

  // For each locale, generate pages
  for (const locale of locales) {
    // Fetch all published blog posts for this locale
    let posts: BlogPostListItem[] = []
    try {
      posts = await getBlogPosts(locale)
    } catch (error) {
      console.warn(`Failed to fetch blog posts for sitemap (${locale}):`, error)
    }

    // Static pages with alternates for hreflang
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          it: `${baseUrl}/it`,
          en: `${baseUrl}/en`,
        },
      },
    })

    sitemap.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          it: `${baseUrl}/it/blog`,
          en: `${baseUrl}/en/blog`,
        },
      },
    })

    sitemap.push({
      url: `${baseUrl}/${locale}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          it: `${baseUrl}/it/tools`,
          en: `${baseUrl}/en/tools`,
        },
      },
    })

    sitemap.push({
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          it: `${baseUrl}/it/about`,
          en: `${baseUrl}/en/about`,
        },
      },
    })

    sitemap.push({
      url: `${baseUrl}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          it: `${baseUrl}/it/contact`,
          en: `${baseUrl}/en/contact`,
        },
      },
    })

    // Dynamic blog post pages
    for (const post of posts) {
      sitemap.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            it: `${baseUrl}/it/blog/${post.slug}`,
            en: `${baseUrl}/en/blog/${post.slug}`,
          },
        },
      })
    }

    // Tool pages
    for (const tool of TOOLS) {
      sitemap.push({
        url: `${baseUrl}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            it: `${baseUrl}/it/tools/${tool.slug}`,
            en: `${baseUrl}/en/tools/${tool.slug}`,
          },
        },
      })
    }
  }

  return sitemap
}
