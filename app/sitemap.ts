import { MetadataRoute } from 'next'
import { getBlogPosts, BlogPostListItem } from '@/lib/api'
import { TOOLS } from '@/lib/tools-config'
import { locales } from '@/i18n/config'

// Type for translation map: translationGroup -> { locale: slug }
type TranslationMap = Map<string, Record<string, string>>

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thejord.it'
  const sitemap: MetadataRoute.Sitemap = []

  // Fetch blog posts for ALL locales first to build translation map
  const postsByLocale: Record<string, BlogPostListItem[]> = {}
  const translationMap: TranslationMap = new Map()

  for (const locale of locales) {
    try {
      postsByLocale[locale] = await getBlogPosts(locale)
    } catch (error) {
      console.warn(`Failed to fetch blog posts for sitemap (${locale}):`, error)
      postsByLocale[locale] = []
    }
  }

  // Build translation map: translationGroup -> { it: slug, en: slug }
  for (const locale of locales) {
    for (const post of postsByLocale[locale]) {
      if (post.translationGroup) {
        const existing = translationMap.get(post.translationGroup) || {}
        existing[locale] = post.slug
        translationMap.set(post.translationGroup, existing)
      }
    }
  }

  // For each locale, generate pages
  for (const locale of locales) {
    const posts = postsByLocale[locale]

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

    // PDF Tools landing page
    sitemap.push({
      url: `${baseUrl}/${locale}/pdf-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          it: `${baseUrl}/it/pdf-tools`,
          en: `${baseUrl}/en/pdf-tools`,
        },
      },
    })

    // Changelog page
    sitemap.push({
      url: `${baseUrl}/${locale}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          it: `${baseUrl}/it/changelog`,
          en: `${baseUrl}/en/changelog`,
        },
      },
    })

    // Dynamic blog post pages
    for (const post of posts) {
      // Build alternates using translation map for correct slugs
      const translations = post.translationGroup
        ? translationMap.get(post.translationGroup)
        : undefined

      // Only include alternates for languages that have translations
      const languages: Record<string, string> = {}
      if (translations) {
        // Add alternates only for languages that exist
        for (const [lang, slug] of Object.entries(translations)) {
          languages[lang] = `${baseUrl}/${lang}/blog/${slug}`
        }
      } else {
        // No translation group - only include current language
        languages[locale] = `${baseUrl}/${locale}/blog/${post.slug}`
      }

      sitemap.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages,
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
