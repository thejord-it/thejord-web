'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPosts, deletePost, bulkDeletePosts, bulkPublishPosts, bulkUnpublishPosts, BlogPost } from '@/lib/api'

export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    let filtered = posts
    if (filter === 'published') filtered = posts.filter(p => p.published)
    if (filter === 'draft') filtered = posts.filter(p => !p.published)
    if (search) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFilteredPosts(filtered)
  }, [posts, filter, search])

  const loadPosts = async () => {
    try {
      const data = await getAllPosts()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deletePost(id)
      setPosts(posts.filter(p => p.id !== id))
    } catch (error) {
      alert('Failed to delete post')
    }
  }

  const toggleSelectPost = (id: string) => {
    const newSelected = new Set(selectedPosts)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedPosts(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set())
    } else {
      setSelectedPosts(new Set(filteredPosts.map(p => p.id)))
    }
  }

  const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish') => {
    if (selectedPosts.size === 0) {
      alert('Please select at least one post')
      return
    }

    const postIds = Array.from(selectedPosts)
    const confirmMessage =
      action === 'delete'
        ? `Delete ${postIds.length} post(s)?`
        : action === 'publish'
        ? `Publish ${postIds.length} post(s)?`
        : `Unpublish ${postIds.length} post(s)?`

    if (!confirm(confirmMessage)) return

    setBulkActionLoading(true)
    try {
      if (action === 'delete') {
        await bulkDeletePosts(postIds)
        setPosts(posts.filter(p => !selectedPosts.has(p.id)))
      } else if (action === 'publish') {
        await bulkPublishPosts(postIds)
        await loadPosts()
      } else if (action === 'unpublish') {
        await bulkUnpublishPosts(postIds)
        await loadPosts()
      }
      setSelectedPosts(new Set())
    } catch (error) {
      alert(`Failed to ${action} posts`)
    } finally {
      setBulkActionLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-primary hover:bg-primary-dark text-bg-darkest font-medium px-6 py-2 rounded-lg transition-colors"
        >
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === f
                    ? 'bg-primary text-bg-darkest'
                    : 'bg-bg-dark text-text-secondary hover:text-text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPosts.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-text-primary font-medium">
              {selectedPosts.size} post(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                disabled={bulkActionLoading}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {bulkActionLoading ? 'Processing...' : 'Publish'}
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                disabled={bulkActionLoading}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {bulkActionLoading ? 'Processing...' : 'Unpublish'}
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {bulkActionLoading ? 'Processing...' : 'Delete'}
              </button>
              <button
                onClick={() => setSelectedPosts(new Set())}
                className="px-4 py-2 bg-bg-dark hover:bg-bg-darkest text-text-secondary rounded-lg transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-text-muted">No posts found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-bg-dark border-b border-border">
              <tr>
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.size === filteredPosts.length && filteredPosts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                  />
                </th>
                <th className="text-left px-3 py-4 text-text-secondary text-sm font-medium">Image</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Title</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Status</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Language</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Updated</th>
                <th className="text-right px-6 py-4 text-text-secondary text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-bg-dark transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.id)}
                      onChange={() => toggleSelectPost(post.id)}
                      className="w-4 h-4 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-3 py-4">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg border border-border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-bg-darkest rounded-lg border border-border flex items-center justify-center">
                        <span className="text-text-muted text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-medium">{post.title}</div>
                    <div className="text-text-muted text-sm">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        post.published
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-text-secondary uppercase text-sm">{post.language}</span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-primary hover:text-primary-light text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
