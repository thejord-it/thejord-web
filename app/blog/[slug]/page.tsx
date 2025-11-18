import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { getBlogPost, getAllBlogPostSlugs } from '@/lib/api'

type Props = {
  params: Promise<{ slug: string }>
}

// Generate static params for all blog posts (ISR)
export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs('it')
  return slugs.map((slug) => ({ slug }))
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug, 'it')

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt
  const publishedTime = post.publishedAt || post.createdAt
  const modifiedTime = post.updatedAt
  const ogImage = post.ogImage || '/og-image.png'
  const canonical = post.canonicalUrl || `https://thejord.it/blog/${post.slug}`

  return {
    title,
    description,
    keywords: post.keywords.join(', '),
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'THEJORD',
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'article',
      url: `https://thejord.it/blog/${post.slug}`,
      title,
      description,
      siteName: 'THEJORD',
      locale: 'it_IT',
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
  const { slug } = await params
  const post = await getBlogPost(slug, 'it')

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-primary hover:text-primary-light transition-colors mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-text-primary leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-muted mb-6">
            <span className="font-semibold text-text-secondary">{post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt || post.createdAt}>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.readTime} di lettura</span>
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

        {/* Article Content */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-text-muted text-sm">
              Ultimo aggiornamento:{' '}
              <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString('it-IT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <Link
              href="/blog"
              className="px-6 py-2 bg-primary hover:bg-primary-light text-bg-darkest font-semibold rounded-lg transition-colors"
            >
              Leggi altri articoli →
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
                '@id': `https://thejord.it/blog/${post.slug}`,
              },
              keywords: post.keywords.join(', '),
            }),
          }}
        />
      </article>
    </div>
  )
}
