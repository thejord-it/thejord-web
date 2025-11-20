'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllPosts, BlogPost } from '@/lib/api'

interface TagStats {
  name: string
  count: number
  posts: BlogPost[]
}

export default function TagsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tagStats, setTagStats] = useState<TagStats[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const posts = await getAllPosts()

      // Calculate tag statistics
      const tagMap = new Map<string, BlogPost[]>()

      posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => {
            if (!tagMap.has(tag)) {
              tagMap.set(tag, [])
            }
            tagMap.get(tag)!.push(post)
          })
        }
      })

      // Convert to array and sort by count
      const stats: TagStats[] = Array.from(tagMap.entries()).map(([name, posts]) => ({
        name,
        count: posts.length,
        posts
      })).sort((a, b) => b.count - a.count)

      setTagStats(stats)
    } catch (error) {
      console.error('Failed to load tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTags = tagStats.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTagClick = (tag: string) => {
    // Navigate to posts list filtered by tag
    router.push(`/admin/posts?tag=${encodeURIComponent(tag)}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-text-muted">Loading tags...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tags Management</h1>
          <p className="text-text-secondary mt-2">
            {tagStats.length} unique tags across all posts
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text-primary"
        >
          ← Back
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags..."
          className="w-full px-4 py-2 bg-bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
        />
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => (
          <div
            key={tag.name}
            className="bg-bg-surface border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
            onClick={() => handleTagClick(tag.name)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-primary">{tag.name}</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {tag.count} {tag.count === 1 ? 'post' : 'posts'}
              </span>
            </div>

            <div className="space-y-1">
              {tag.posts.slice(0, 3).map(post => (
                <div
                  key={post.id}
                  className="text-sm text-text-secondary truncate"
                  title={post.title}
                >
                  • {post.title}
                </div>
              ))}
              {tag.posts.length > 3 && (
                <div className="text-sm text-text-muted italic">
                  +{tag.posts.length - 3} more...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">
            {searchQuery ? 'No tags found matching your search' : 'No tags available'}
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <div className="text-text-muted text-sm mb-1">Total Tags</div>
          <div className="text-3xl font-bold text-text-primary">{tagStats.length}</div>
        </div>

        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <div className="text-text-muted text-sm mb-1">Most Used Tag</div>
          <div className="text-xl font-bold text-primary">
            {tagStats[0]?.name || 'N/A'}
            {tagStats[0] && (
              <span className="text-sm text-text-secondary ml-2">
                ({tagStats[0].count} posts)
              </span>
            )}
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <div className="text-text-muted text-sm mb-1">Average Posts per Tag</div>
          <div className="text-3xl font-bold text-text-primary">
            {tagStats.length > 0
              ? (tagStats.reduce((sum, t) => sum + t.count, 0) / tagStats.length).toFixed(1)
              : '0'}
          </div>
        </div>
      </div>
    </div>
  )
}
