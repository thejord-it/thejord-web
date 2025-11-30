'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllPosts, deletePost, bulkDeletePosts, bulkPublishPosts, bulkUnpublishPosts, BlogPost } from '@/lib/api'
import { getIconEmoji } from '@/lib/icons'

interface GroupedPost {
  main: BlogPost
  translations: BlogPost[]
}

export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPosts()
  }, [])

  // Group posts by translationGroup
  const groupedPosts = useMemo(() => {
    let filtered = posts
    if (filter === 'published') filtered = posts.filter(p => p.published)
    if (filter === 'draft') filtered = posts.filter(p => !p.published)
    if (search) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }

    const groups: Map<string, BlogPost[]> = new Map()
    const standalone: BlogPost[] = []

    filtered.forEach(post => {
      if (post.translationGroup) {
        const existing = groups.get(post.translationGroup) || []
        existing.push(post)
        groups.set(post.translationGroup, existing)
      } else {
        standalone.push(post)
      }
    })

    const result: GroupedPost[] = []

    // Process groups - IT first, then other languages
    groups.forEach((groupPosts) => {
      // Sort: IT first, then alphabetically by language
      groupPosts.sort((a, b) => {
        if (a.language === 'it') return -1
        if (b.language === 'it') return 1
        return a.language.localeCompare(b.language)
      })

      const [main, ...translations] = groupPosts
      result.push({ main, translations })
    })

    // Add standalone posts
    standalone.forEach(post => {
      result.push({ main: post, translations: [] })
    })

    // Sort by updatedAt (most recent first)
    result.sort((a, b) =>
      new Date(b.main.updatedAt).getTime() - new Date(a.main.updatedAt).getTime()
    )

    return result
  }, [posts, filter, search])

  // Flatten for selection count
  const allFilteredPosts = useMemo(() => {
    return groupedPosts.flatMap(g => [g.main, ...g.translations])
  }, [groupedPosts])

  const loadPosts = async () => {
    try {
      const data = await getAllPosts()
      setPosts(data)
      // Auto-expand all groups initially
      const groups = new Set<string>()
      data.forEach(p => {
        if (p.translationGroup) groups.add(p.translationGroup)
      })
      setExpandedGroups(groups)
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
    if (selectedPosts.size === allFilteredPosts.length) {
      setSelectedPosts(new Set())
    } else {
      setSelectedPosts(new Set(allFilteredPosts.map(p => p.id)))
    }
  }

  const toggleGroup = (translationGroup: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(translationGroup)) {
      newExpanded.delete(translationGroup)
    } else {
      newExpanded.add(translationGroup)
    }
    setExpandedGroups(newExpanded)
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

  const renderPostRow = (post: BlogPost, isTranslation: boolean = false, isLast: boolean = false) => (
    <tr
      key={post.id}
      className={`hover:bg-bg-dark transition-colors ${isTranslation ? 'bg-bg-dark/30' : ''}`}
    >
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
            className={`object-cover rounded-lg border border-border ${isTranslation ? 'w-12 h-12' : 'w-16 h-16'}`}
          />
        ) : (
          <div className={`bg-bg-darkest rounded-lg border border-border flex items-center justify-center ${isTranslation ? 'w-12 h-12' : 'w-16 h-16'}`}>
            <span className="text-text-muted text-xs">No img</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-2">
          {isTranslation && (
            <span className="text-text-muted mt-1">
              {isLast ? '└─' : '├─'}
            </span>
          )}
          <div>
            <div className={`text-text-primary ${isTranslation ? 'text-sm' : 'font-medium'}`}>
              {post.title}
            </div>
            <div className="text-text-muted text-sm">{post.slug}</div>
          </div>
        </div>
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
        <span className={`uppercase text-sm font-medium px-2 py-1 rounded ${
          post.language === 'it'
            ? 'bg-blue-500/10 text-blue-400'
            : 'bg-purple-500/10 text-purple-400'
        }`}>
          {post.language}
        </span>
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
  )

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
        ) : groupedPosts.length === 0 ? (
          <div className="text-center py-12 text-text-muted">No posts found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-bg-dark border-b border-border">
              <tr>
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.size === allFilteredPosts.length && allFilteredPosts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                  />
                </th>
                <th className="text-left px-3 py-4 text-text-secondary text-sm font-medium">Image</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Title</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Status</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Lang</th>
                <th className="text-left px-6 py-4 text-text-secondary text-sm font-medium">Updated</th>
                <th className="text-right px-6 py-4 text-text-secondary text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groupedPosts.map((group) => (
                <>
                  {/* Main post row */}
                  <tr
                    key={group.main.id}
                    className={`hover:bg-bg-dark transition-colors ${group.translations.length > 0 ? 'border-l-4 border-l-primary/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPosts.has(group.main.id)}
                          onChange={() => toggleSelectPost(group.main.id)}
                          className="w-4 h-4 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                        />
                        {group.translations.length > 0 && (
                          <button
                            onClick={() => toggleGroup(group.main.translationGroup!)}
                            className="text-text-muted hover:text-text-primary text-lg"
                            title={expandedGroups.has(group.main.translationGroup!) ? 'Collapse' : 'Expand'}
                          >
                            {expandedGroups.has(group.main.translationGroup!) ? '▼' : '▶'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      {group.main.image ? (
                        <img
                          src={group.main.image}
                          alt={group.main.title}
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                        />
                      ) : getIconEmoji(group.main.icon) ? (
                        <div className="w-16 h-16 flex items-center justify-center">
                          <span className="text-4xl">{getIconEmoji(group.main.icon)}</span>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-bg-darkest rounded-lg border border-border flex items-center justify-center">
                          <span className="text-text-muted text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-text-primary font-medium">{group.main.title}</div>
                          <div className="text-text-muted text-sm">{group.main.slug}</div>
                        </div>
                        {group.translations.length > 0 && (
                          <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded-full whitespace-nowrap">
                            {group.translations.length + 1} langs
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          group.main.published
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {group.main.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`uppercase text-sm font-medium px-2 py-1 rounded ${
                        group.main.language === 'it'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {group.main.language}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {new Date(group.main.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${group.main.id}`}
                          className="text-primary hover:text-primary-light text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(group.main.id, group.main.title)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Translation rows */}
                  {group.translations.length > 0 && expandedGroups.has(group.main.translationGroup!) &&
                    group.translations.map((translation, idx) => (
                      <tr
                        key={translation.id}
                        className="hover:bg-bg-dark/50 transition-colors bg-bg-dark/20 border-l-4 border-l-primary/30"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2 pl-6">
                            <input
                              type="checkbox"
                              checked={selectedPosts.has(translation.id)}
                              onChange={() => toggleSelectPost(translation.id)}
                              className="w-4 h-4 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end">
                            {translation.image ? (
                              <img
                                src={translation.image}
                                alt={translation.title}
                                className="w-12 h-12 object-cover rounded-lg border border-border"
                              />
                            ) : getIconEmoji(translation.icon) ? (
                              <div className="w-12 h-12 flex items-center justify-center">
                                <span className="text-3xl">{getIconEmoji(translation.icon)}</span>
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-bg-darkest rounded-lg border border-border flex items-center justify-center">
                                <span className="text-text-muted text-xs">No img</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-start gap-2">
                            <span className="text-text-muted">
                              {idx === group.translations.length - 1 ? '└─' : '├─'}
                            </span>
                            <div>
                              <div className="text-text-primary text-sm">{translation.title}</div>
                              <div className="text-text-muted text-xs">{translation.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              translation.published
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}
                          >
                            {translation.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`uppercase text-xs font-medium px-2 py-0.5 rounded ${
                            translation.language === 'it'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-purple-500/10 text-purple-400'
                          }`}>
                            {translation.language}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-text-secondary text-xs">
                          {new Date(translation.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/posts/${translation.id}`}
                              className="text-primary hover:text-primary-light text-xs"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(translation.id, translation.title)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
