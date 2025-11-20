'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPosts, BlogPost } from '@/lib/api'

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.published).length,
    draft: posts.filter(p => !p.published).length,
  }

  const recentPosts = posts.slice(0, 5)

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <div className="text-text-muted text-sm mb-2">Total Posts</div>
          <div className="text-3xl font-bold text-primary">{stats.total}</div>
        </div>
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <div className="text-text-muted text-sm mb-2">Published</div>
          <div className="text-3xl font-bold text-green-400">{stats.published}</div>
        </div>
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <div className="text-text-muted text-sm mb-2">Drafts</div>
          <div className="text-3xl font-bold text-yellow-400">{stats.draft}</div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Recent Posts</h2>
          <Link
            href="/admin/posts"
            className="text-primary hover:text-primary-light text-sm"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-text-muted text-center py-8">Loading...</div>
        ) : recentPosts.length === 0 ? (
          <div className="text-text-muted text-center py-8">No posts yet</div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map(post => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-bg-dark rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="text-text-primary font-medium">{post.title}</h3>
                  <p className="text-text-muted text-sm">{post.excerpt.slice(0, 100)}...</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      post.published
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-primary hover:text-primary-light text-sm"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
