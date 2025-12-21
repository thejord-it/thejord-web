'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  readTime: string
  tags: string[]
  image?: string
  language: string
  published: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  scheduledAt?: string
}

export default function PostPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
          router.push('/admin/login')
          return
        }

        const response = await fetch(`/api/proxy/api/posts/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }

        const data = await response.json()
        setPost(data.data || data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
        <div className="text-text-muted">Loading preview...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error || 'Post not found'}</div>
          <Link href="/admin/posts" className="text-primary hover:text-primary-light">
            ← Back to posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      {/* Preview Header */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
              PREVIEW
            </span>
            <span className="text-text-muted text-sm">
              {post.published ? 'Published' : 'Draft'} • {post.language.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/posts/${post.id}`}
              className="px-3 py-1.5 text-sm text-primary hover:text-primary-light transition-colors"
            >
              Edit
            </Link>
            <Link
              href="/admin/posts"
              className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Featured Image */}
        {post.image && (post.image.startsWith('http://') || post.image.startsWith('https://')) && (
          <div className="w-full mb-8 rounded-lg overflow-hidden border border-border">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm mb-8">
          <span>{post.author || 'THEJORD Team'}</span>
          <span>•</span>
          <span>{post.readTime || '5 min'}</span>
          <span>•</span>
          <span>
              {post.published && post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('it-IT')
                : post.scheduledAt
                  ? `Schedulato: ${new Date(post.scheduledAt).toLocaleDateString('it-IT')}`
                  : new Date(post.createdAt).toLocaleDateString('it-IT')}
            </span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-xl text-text-secondary mb-8 italic border-l-4 border-primary pl-4">
            {post.excerpt}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-text-primary prose-headings:font-bold
            prose-p:text-text-secondary prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text-primary
            prose-code:text-primary prose-code:bg-bg-dark prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-bg-dark prose-pre:border prose-pre:border-border
            prose-ul:text-text-secondary prose-ol:text-text-secondary
            prose-li:marker:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>No content</p>' }}
        />
      </article>
    </div>
  )
}
