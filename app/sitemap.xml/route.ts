import { getBlogPosts, BlogPostListItem } from '@/lib/api'
import { TOOLS } from '@/lib/tools-config'
import { locales } from '@/i18n/config'

// Type for translation map: translationGroup -> { locale: slug }
type TranslationMap = Map<string, Record<string, string>>

// Video configuration for sitemap
const PROMO_VIDEO = {
  id: 'vEkDQCFPSLU',
  duration: 40,
  uploadDate: '2024-12-01T00:00:00Z',
  title: {
    it: 'THEJORD - Strumenti per Sviluppatori',
    en: 'THEJORD - Developer Tools',
  },
  description: {
    it: 'Scopri THEJORD: strumenti gratuiti per sviluppatori che funzionano direttamente nel browser. Privacy first, nessun dato inviato ai server.',
    en: 'Discover THEJORD: free developer tools that work directly in your browser. Privacy first, no data sent to servers.',
  },
}

export async function GET() {
  const baseUrl = 'https://thejord.it'

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

  // Build XML string with video namespace
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n'

  // Helper to add URL entry
  const addUrl = (
    url: string,
    languages: Record<string, string>,
    lastmod: Date,
    changefreq: string,
    priority: number,
    video?: { locale: string }
  ) => {
    xml += '<url>\n'
    xml += `<loc>${url}</loc>\n`
    for (const [lang, href] of Object.entries(languages)) {
      xml += `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />\n`
    }
    xml += `<lastmod>${lastmod.toISOString()}</lastmod>\n`
    xml += `<changefreq>${changefreq}</changefreq>\n`
    xml += `<priority>${priority}</priority>\n`

    // Add video info if provided
    if (video) {
      const locale = video.locale as 'it' | 'en'
      xml += '<video:video>\n'
      xml += `<video:thumbnail_loc>https://img.youtube.com/vi/${PROMO_VIDEO.id}/maxresdefault.jpg</video:thumbnail_loc>\n`
      xml += `<video:title>${PROMO_VIDEO.title[locale]}</video:title>\n`
      xml += `<video:description>${PROMO_VIDEO.description[locale]}</video:description>\n`
      xml += `<video:content_loc>https://www.youtube.com/watch?v=${PROMO_VIDEO.id}</video:content_loc>\n`
      xml += `<video:player_loc>https://www.youtube.com/embed/${PROMO_VIDEO.id}</video:player_loc>\n`
      xml += `<video:duration>${PROMO_VIDEO.duration}</video:duration>\n`
      xml += `<video:publication_date>${PROMO_VIDEO.uploadDate}</video:publication_date>\n`
      xml += '</video:video>\n'
    }

    xml += '</url>\n'
  }

  const now = new Date()

  // For each locale, generate pages
  for (const locale of locales) {
    const posts = postsByLocale[locale]

    // Homepage with video
    addUrl(
      `${baseUrl}/${locale}`,
      { it: `${baseUrl}/it`, en: `${baseUrl}/en`, 'x-default': `${baseUrl}/en` },
      now, 'monthly', 1,
      { locale }
    )

    addUrl(
      `${baseUrl}/${locale}/blog`,
      { it: `${baseUrl}/it/blog`, en: `${baseUrl}/en/blog`, 'x-default': `${baseUrl}/en/blog` },
      now, 'daily', 0.9
    )

    addUrl(
      `${baseUrl}/${locale}/tools`,
      { it: `${baseUrl}/it/tools`, en: `${baseUrl}/en/tools`, 'x-default': `${baseUrl}/en/tools` },
      now, 'weekly', 0.9
    )

    addUrl(
      `${baseUrl}/${locale}/about`,
      { it: `${baseUrl}/it/about`, en: `${baseUrl}/en/about`, 'x-default': `${baseUrl}/en/about` },
      now, 'monthly', 0.7
    )

    addUrl(
      `${baseUrl}/${locale}/contact`,
      { it: `${baseUrl}/it/contact`, en: `${baseUrl}/en/contact`, 'x-default': `${baseUrl}/en/contact` },
      now, 'monthly', 0.6
    )

    addUrl(
      `${baseUrl}/${locale}/pdf-tools`,
      { it: `${baseUrl}/it/pdf-tools`, en: `${baseUrl}/en/pdf-tools`, 'x-default': `${baseUrl}/en/pdf-tools` },
      now, 'weekly', 0.9
    )

    addUrl(
      `${baseUrl}/${locale}/changelog`,
      { it: `${baseUrl}/it/changelog`, en: `${baseUrl}/en/changelog`, 'x-default': `${baseUrl}/en/changelog` },
      now, 'weekly', 0.6
    )

    // Dynamic blog post pages
    for (const post of posts) {
      const translations = post.translationGroup
        ? translationMap.get(post.translationGroup)
        : undefined

      const languages: Record<string, string> = {}
      if (translations) {
        for (const [lang, slug] of Object.entries(translations)) {
          languages[lang] = `${baseUrl}/${lang}/blog/${slug}`
        }
        languages['x-default'] = translations.en
          ? `${baseUrl}/en/blog/${translations.en}`
          : `${baseUrl}/${locale}/blog/${post.slug}`
      } else {
        languages[locale] = `${baseUrl}/${locale}/blog/${post.slug}`
        languages['x-default'] = `${baseUrl}/${locale}/blog/${post.slug}`
      }

      addUrl(
        `${baseUrl}/${locale}/blog/${post.slug}`,
        languages,
        new Date(post.updatedAt || post.publishedAt || post.createdAt),
        'weekly', 0.8
      )
    }

    // Tool pages
    for (const tool of TOOLS) {
      addUrl(
        `${baseUrl}/${locale}/tools/${tool.slug}`,
        {
          it: `${baseUrl}/it/tools/${tool.slug}`,
          en: `${baseUrl}/en/tools/${tool.slug}`,
          'x-default': `${baseUrl}/en/tools/${tool.slug}`,
        },
        now, 'monthly', 0.7
      )
    }
  }

  xml += '</urlset>'

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
