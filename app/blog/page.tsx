import Link from 'next/link'
import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles about web development, tools, and programming by Il Giordano',
}

export default async function BlogPage() {
  const posts = await getBlogPosts('it')

  return (
    <div className="min-h-screen bg-bg-darkest">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-primary hover:text-primary-light transition-colors mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-text-secondary">
            Technical articles, tutorials, and insights about web development
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-bg-dark border border-border hover:border-primary rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex items-start gap-4">
                  {post.image && (
                    <div className="text-4xl shrink-0">{post.image}</div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-text-secondary mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('it-IT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-bg-darkest text-primary text-xs rounded-full border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
