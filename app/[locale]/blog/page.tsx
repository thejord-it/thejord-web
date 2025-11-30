import Link from 'next/link'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getBlogPosts } from '@/lib/api'
import BlogSearch from '@/components/blog/BlogSearch'
import TagFilter from '@/components/blog/TagFilter'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ search?: string; tags?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams.search || ''
  const selectedTags = resolvedSearchParams.tags?.split(',').filter(Boolean) || []
  const t = await getTranslations({ locale, namespace: 'blog' })

  const posts = await getBlogPosts(locale, {
    search: search || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined
  })

  const allPosts = await getBlogPosts(locale)
  const allTags = Array.from(new Set(allPosts.flatMap(p => p.tags))).sort()

  const hasFilters = search || selectedTags.length > 0

  return (
    <div className="min-h-screen bg-bg-darkest">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-base md:text-xl text-text-secondary">
            {t('description')}
          </p>
        </div>

        <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
          <BlogSearch initialSearch={search} locale={locale} />
          <TagFilter availableTags={allTags} selectedTags={selectedTags} locale={locale} />
        </div>

        {hasFilters && (
          <div className="mb-4 md:mb-6 text-text-muted text-sm">
            {posts.length === 0 ? (
              <p>{t('noResults')}</p>
            ) : (
              <p>{posts.length} {posts.length === 1 ? (locale === 'it' ? 'articolo trovato' : 'article found') : (locale === 'it' ? 'articoli trovati' : 'articles found')}</p>
            )}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">
              {hasFilters ? t('tryDifferentFilters') : t('noPostsYet')}
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {posts.map((post) => {
              const thumbnailUrl = post.image
                ? post.image.replace(/\.webp$/i, '-thumb.webp')
                : null

              return (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group block bg-bg-dark border border-border hover:border-primary rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="flex gap-4 md:gap-6 p-4 md:p-6">
                    {thumbnailUrl && (thumbnailUrl.startsWith('http://') || thumbnailUrl.startsWith('https://')) && (
                      <div className="flex-shrink-0">
                        <img
                          src={thumbnailUrl}
                          alt={post.title}
                          className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-lg md:text-2xl font-bold text-text-primary group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-text-muted">
                        <span>{post.author}</span>
                        <span>-</span>
                        <span>
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="hidden md:inline">-</span>
                        <span className="hidden md:inline">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
