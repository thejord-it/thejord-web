import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/tools/Layout'
import SEO from '@/components/tools/SEO'

export default function Blog() {
  const { t, i18n } = useTranslation()

  // Blog posts data (temporary - will move to database/CMS later)
  const blogPosts = [
    {
      id: 'cron-expression-builder',
      slug: 'cron-expression-builder',
      titleKey: 'blog.posts.cronBuilder.title',
      excerptKey: 'blog.posts.cronBuilder.excerpt',
      author: 'THEJORD Team',
      date: '2025-11-17',
      readTime: '10 min',
      tags: ['Tools', 'Cron', 'Automation'],
      image: '🕐'
    },
    {
      id: 'json-schema-converter',
      slug: 'json-schema-converter',
      titleKey: 'blog.posts.jsonSchema.title',
      excerptKey: 'blog.posts.jsonSchema.excerpt',
      author: 'THEJORD Team',
      date: '2025-11-17',
      readTime: '12 min',
      tags: ['Tools', 'JSON', 'API'],
      image: '📋'
    },
    {
      id: 'come-validare-json-online',
      slug: 'come-validare-json-online',
      titleKey: 'blog.posts.jsonValidation.title',
      excerptKey: 'blog.posts.jsonValidation.excerpt',
      author: 'Team THEJORD',
      date: '2025-01-13',
      readTime: '8 min',
      tags: ['Tutorial', 'JSON', 'Developer Tools'],
      image: '📄'
    },
    {
      id: 'base64-encoder-decoder-guida',
      slug: 'base64-encoder-decoder-guida',
      titleKey: 'blog.posts.base64Guide.title',
      excerptKey: 'blog.posts.base64Guide.excerpt',
      author: 'Team THEJORD',
      date: '2025-01-13',
      readTime: '7 min',
      tags: ['Tutorial', 'Base64', 'Security'],
      image: '🔐'
    },
    {
      id: 'regex-tester-italiano-pattern',
      slug: 'regex-tester-italiano-pattern',
      titleKey: 'blog.posts.regexTester.title',
      excerptKey: 'blog.posts.regexTester.excerpt',
      author: 'Team THEJORD',
      date: '2025-01-13',
      readTime: '6 min',
      tags: ['Tutorial', 'RegEx', 'Developer Tools'],
      image: '🔍'
    },
    {
      id: 'lancio-thejord-it',
      slug: 'lancio-thejord-it',
      titleKey: 'blog.posts.launch.title',
      excerptKey: 'blog.posts.launch.excerpt',
      author: 'Team THEJORD',
      date: '2025-01-12',
      readTime: '5 min',
      tags: ['Announcement', 'Open Source', 'Privacy'],
      image: '📢'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const locale = i18n.language === 'it' ? 'it-IT' : 'en-US'
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <Layout currentPage="blog">
      <SEO
        title="Blog - THEJORD.IT"
        description="News, tutorials, and insights about web development and developer tools. Learn how to use our tools effectively."
        path="/blog"
      />
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              {t('blog.title')}
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-bg-surface border border-border rounded-xl overflow-hidden hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 group"
            >
              <div className="p-8">
                <div className="flex items-start gap-6">
                  {/* Image/Icon */}
                  <div className="text-6xl flex-shrink-0">
                    {post.image}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Tags */}
                    <div className="flex gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-semibold bg-primary/20 text-primary-light rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-3 text-text-primary group-hover:text-primary-light transition-colors">
                      {t(post.titleKey)}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-text-secondary mb-4 line-clamp-2">
                      {t(post.excerptKey)}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{post.readTime} {t('blog.readTime')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State (if no posts) */}
        {blogPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-4 text-text-primary">{t('blog.empty.title')}</h2>
            <p className="text-text-secondary">
              {t('blog.empty.message')}
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">{t('blog.newsletter.title')}</h2>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">
            {t('blog.newsletter.message')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://github.com/thejord-it/thejord-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              {t('blog.newsletter.cta')}
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}
