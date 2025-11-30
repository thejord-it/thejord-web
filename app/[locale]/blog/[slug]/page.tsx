import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { getBlogPost, getAllBlogPostSlugs, getPostTranslations } from '@/lib/api'
import { getIconEmoji } from '@/lib/icons'
import { locales, localeFlags, type Locale } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

// Generate static params for all blog posts in all locales (ISR)
export async function generateStaticParams() {
  const results: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    try {
      const slugs = await getAllBlogPostSlugs(locale)
      slugs.forEach(slug => {
        results.push({ locale, slug })
      })
    } catch (error) {
      console.warn(`Failed to get slugs for locale ${locale}:`, error)
    }
  }

  return results
}

// Allow dynamic generation of pages not in generateStaticParams
export const dynamicParams = true

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getBlogPost(slug, locale)
  const t = await getTranslations({ locale, namespace: 'blog' })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Get translations for correct hreflang links
  const translations = await getPostTranslations(slug, locale)

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt
  const publishedTime = post.publishedAt || post.createdAt
  const modifiedTime = post.updatedAt
  const ogImage = post.ogImage || '/og-image.png'
  const canonical = post.canonicalUrl || `https://thejord.it/${locale}/blog/${post.slug}`

  // Build alternate languages with correct slugs
  const languages: Record<string, string> = {}
  if (translations.it) {
    languages['it'] = `https://thejord.it/it/blog/${translations.it}`
  }
  if (translations.en) {
    languages['en'] = `https://thejord.it/en/blog/${translations.en}`
  }
  // Fallback: if no translations, use current slug
  if (Object.keys(languages).length === 0) {
    languages[locale] = `https://thejord.it/${locale}/blog/${slug}`
  }

  return {
    title,
    description,
    keywords: post.keywords.join(', '),
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'THEJORD',
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'article',
      url: `https://thejord.it/${locale}/blog/${post.slug}`,
      title,
      description,
      siteName: 'THEJORD',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime,
      modifiedTime,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@thejord_it',
    },
    robots: {
      index: post.published,
      follow: post.published,
      googleBot: {
        index: post.published,
        follow: post.published,
      },
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params
  const post = await getBlogPost(slug, locale)
  const t = await getTranslations({ locale, namespace: 'blog' })

  if (!post || !post.published) {
    notFound()
  }

  // Get translations for language switch
  const translations = await getPostTranslations(slug, locale)
  const otherLocale = locale === 'it' ? 'en' : 'it'
  const hasTranslation = translations[otherLocale] !== undefined

  const dateLocale = locale === 'it' ? 'it-IT' : 'en-US'
  const langCode = locale === 'it' ? 'it-IT' : 'en-US'

  // Schema.org JSON-LD for rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image || post.ogImage || 'https://thejord.it/og-image.png',
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'THEJORD',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thejord.it/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thejord.it/${locale}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
    articleSection: post.tags.join(', '),
    wordCount: post.content.split(/\s+/).length,
    timeRequired: post.readTime,
    inLanguage: langCode,
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/${locale}/blog`}
            className="text-primary hover:text-primary-light transition-colors"
          >
            ← {t('backToBlog')}
          </Link>

          {/* Language switch for this post */}
          {hasTranslation && (
            <Link
              href={`/${otherLocale}/blog/${translations[otherLocale]}`}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-primary border border-border hover:border-primary rounded-lg transition-colors"
            >
              <span>{localeFlags[otherLocale as Locale]}</span>
              <span>{locale === 'it' ? 'Read in English' : 'Leggi in Italiano'}</span>
            </Link>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-text-primary leading-tight flex items-center gap-4">
            {getIconEmoji(post.icon) && (
              <span className="text-5xl">{getIconEmoji(post.icon)}</span>
            )}
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-muted mb-6">
            <span className="font-semibold text-text-secondary">{post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt || post.createdAt}>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(dateLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.readTime} {locale === 'it' ? 'di lettura' : 'read'}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-bg-dark text-primary text-sm rounded-full border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xl text-text-secondary leading-relaxed italic border-l-4 border-primary pl-4">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image with responsive srcset */}
        {post.image && (post.image.startsWith('http://') || post.image.startsWith('https://')) && (
          <div className="w-full mb-12 rounded-lg overflow-hidden">
            <img
              src={post.image}
              srcSet={`
                ${post.image.replace('.webp', '-small.webp')} 640w,
                ${post.image.replace('.webp', '-medium.webp')} 1024w,
                ${post.image} 1920w
              `}
              sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
              alt={post.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-text-muted text-sm">
              {locale === 'it' ? 'Ultimo aggiornamento' : 'Last updated'}:{' '}
              <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="px-6 py-2 bg-primary hover:bg-primary-light text-bg-darkest font-semibold rounded-lg transition-colors"
            >
              {locale === 'it' ? 'Leggi altri articoli' : 'Read more articles'} →
            </Link>
          </div>
        </footer>

        {/* Schema.org Article Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              image: post.ogImage || `https://thejord.it/og-image.png`,
              datePublished: post.publishedAt || post.createdAt,
              dateModified: post.updatedAt,
              author: {
                '@type': 'Person',
                name: post.author,
                url: 'https://thejord.it',
              },
              publisher: {
                '@type': 'Organization',
                name: 'THEJORD',
                url: 'https://thejord.it',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://thejord.it/logo.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://thejord.it/${locale}/blog/${post.slug}`,
              },
              keywords: post.keywords.join(', '),
            }),
          }}
        />
      </article>
    </div>
  )
}
