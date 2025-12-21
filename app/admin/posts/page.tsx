'use client'

import { useEffect, useState, useMemo, Fragment } from 'react'
import Link from 'next/link'
import { getAllPosts, deletePost, bulkDeletePosts, bulkPublishPosts, bulkUnpublishPosts, BlogPost } from '@/lib/api'
import { getIconEmoji } from '@/lib/icons'

interface GroupedPost {
  main: BlogPost
  translations: BlogPost[]
}

const ITEMS_PER_PAGE = 20

export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadPosts()
  }, [])

  // Group posts by translationGroup
  const groupedPosts = useMemo(() => {
    let filtered = posts
    if (filter === 'published') filtered = posts.filter(p => p.published)
    if (filter === 'draft') filtered = posts.filter(p => !p.published && !p.scheduledAt)
    if (filter === 'scheduled') filtered = posts.filter(p => !p.published && p.scheduledAt)
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

  // Pagination
  const totalPages = Math.ceil(groupedPosts.length / ITEMS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return groupedPosts.slice(start, start + ITEMS_PER_PAGE)
  }, [groupedPosts, currentPage])

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, search])

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

  // Get all translation groups from current page
  const allTranslationGroups = useMemo(() => {
    return paginatedPosts
      .filter(g => g.translations.length > 0 && g.main.translationGroup)
      .map(g => g.main.translationGroup!)
  }, [paginatedPosts])

  const allExpanded = allTranslationGroups.length > 0 &&
    allTranslationGroups.every(tg => expandedGroups.has(tg))

  const toggleAllGroups = () => {
    if (allExpanded) {
      // Collapse all
      const newExpanded = new Set(expandedGroups)
      allTranslationGroups.forEach(tg => newExpanded.delete(tg))
      setExpandedGroups(newExpanded)
    } else {
      // Expand all
      const newExpanded = new Set(expandedGroups)
      allTranslationGroups.forEach(tg => newExpanded.add(tg))
      setExpandedGroups(newExpanded)
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
          <div className="flex flex-wrap gap-2">
            {(['all', 'published', 'draft', 'scheduled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === f
                    ? f === 'scheduled' ? 'bg-yellow-600 text-white' : 'bg-primary text-bg-darkest'
                    : 'bg-bg-dark text-text-secondary hover:text-text-primary'
                }`}
              >
                {f}
              </button>
            ))}
            <Link
              href="/admin/calendar"
              className="px-4 py-2 rounded-lg bg-bg-dark text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
            >
              📅 Calendar
            </Link>
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
                <th className="text-left px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={selectedPosts.size === allFilteredPosts.length && allFilteredPosts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                    />
                    {allTranslationGroups.length > 0 && (
                      <button
                        onClick={toggleAllGroups}
                        className="text-text-muted hover:text-text-primary text-sm"
                        title={allExpanded ? 'Collapse all' : 'Expand all'}
                      >
                        {allExpanded ? '▼' : '▶'}
                      </button>
                    )}
                  </div>
                </th>
                <th className="text-left px-2 py-2 text-text-secondary text-xs font-medium">Img</th>
                <th className="text-left px-4 py-2 text-text-secondary text-xs font-medium">Title</th>
                <th className="text-left px-4 py-2 text-text-secondary text-xs font-medium">Status</th>
                <th className="text-left px-3 py-2 text-text-secondary text-xs font-medium">Lang</th>
                <th className="text-left px-4 py-2 text-text-secondary text-xs font-medium">Updated</th>
                <th className="text-right px-4 py-2 text-text-secondary text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPosts.map((group) => (
                <Fragment key={group.main.id}>
                  {/* Main post row */}
                  <tr
                    className={`hover:bg-bg-dark transition-colors ${group.translations.length > 0 ? 'border-l-2 border-l-primary/50' : ''}`}
                  >
                    <td className="px-4 py-1.5">
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selectedPosts.has(group.main.id)}
                          onChange={() => toggleSelectPost(group.main.id)}
                          className="w-3.5 h-3.5 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                        />
                        {group.translations.length > 0 && (
                          <button
                            onClick={() => toggleGroup(group.main.translationGroup!)}
                            className="text-text-muted hover:text-text-primary text-sm ml-1"
                            title={expandedGroups.has(group.main.translationGroup!) ? 'Collapse' : 'Expand'}
                          >
                            {expandedGroups.has(group.main.translationGroup!) ? '▼' : '▶'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-1.5">
                      {group.main.image ? (
                        <img
                          src={group.main.image}
                          alt={group.main.title}
                          className="w-8 h-8 object-cover rounded border border-border"
                        />
                      ) : getIconEmoji(group.main.icon) ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-xl">{getIconEmoji(group.main.icon)}</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-bg-darkest rounded border border-border flex items-center justify-center">
                          <span className="text-text-muted text-[10px]">-</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <div className="text-text-primary text-sm font-medium truncate max-w-[300px]">{group.main.title}</div>
                          <div className="text-text-muted text-xs truncate max-w-[300px]">{group.main.slug}</div>
                        </div>
                        {group.translations.length > 0 && (
                          <span className="px-1.5 py-0.5 bg-secondary/20 text-secondary text-[10px] rounded-full whitespace-nowrap flex-shrink-0">
                            {group.translations.length + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-1.5">
                      {group.main.published ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/10 text-green-400">
                          Published
                        </span>
                      ) : group.main.scheduledAt ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-600/20 text-yellow-400" title={new Date(group.main.scheduledAt).toLocaleString('it-IT')}>
                          📅 {new Date(group.main.scheduledAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-500/10 text-gray-400">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5">
                      <span className={`uppercase text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        group.main.language === 'it'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {group.main.language}
                      </span>
                    </td>
                    <td className="px-4 py-1.5 text-text-secondary text-xs">
                      {new Date(group.main.updatedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-4 py-1.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/posts/${group.main.id}/preview`}
                          className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-dark rounded transition-colors"
                          title="Preview"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/posts/${group.main.id}`}
                          className="p-1.5 text-primary hover:text-primary-light hover:bg-bg-dark rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(group.main.id, group.main.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-bg-dark rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Translation rows */}
                  {group.translations.length > 0 && expandedGroups.has(group.main.translationGroup!) &&
                    group.translations.map((translation, idx) => (
                      <tr
                        key={translation.id}
                        className="hover:bg-bg-dark/50 transition-colors bg-bg-dark/20 border-l-2 border-l-primary/30"
                      >
                        <td className="px-4 py-1">
                          <div className="flex items-center gap-1 pl-4">
                            <input
                              type="checkbox"
                              checked={selectedPosts.has(translation.id)}
                              onChange={() => toggleSelectPost(translation.id)}
                              className="w-3 h-3 rounded border-border bg-bg-dark text-primary focus:ring-primary"
                            />
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          {translation.image ? (
                            <img
                              src={translation.image}
                              alt={translation.title}
                              className="w-6 h-6 object-cover rounded border border-border"
                            />
                          ) : getIconEmoji(translation.icon) ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                              <span className="text-sm">{getIconEmoji(translation.icon)}</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-bg-darkest rounded border border-border flex items-center justify-center">
                              <span className="text-text-muted text-[8px]">-</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-1">
                          <div className="flex items-center gap-1">
                            <span className="text-text-muted text-xs">
                              {idx === group.translations.length - 1 ? '└' : '├'}
                            </span>
                            <div className="min-w-0">
                              <div className="text-text-primary text-xs truncate max-w-[280px]">{translation.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-1">
                          {translation.published ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-green-500/10 text-green-400">
                              Pub
                            </span>
                          ) : translation.scheduledAt ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-yellow-600/20 text-yellow-400" title={new Date(translation.scheduledAt).toLocaleString('it-IT')}>
                              📅 {new Date(translation.scheduledAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-gray-500/10 text-gray-400">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1">
                          <span className={`uppercase text-[9px] font-medium px-1 py-0.5 rounded ${
                            translation.language === 'it'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-purple-500/10 text-purple-400'
                          }`}>
                            {translation.language}
                          </span>
                        </td>
                        <td className="px-4 py-1 text-text-secondary text-[10px]">
                          {new Date(translation.updatedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="px-4 py-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/posts/${translation.id}/preview`}
                              className="p-1 text-text-muted hover:text-text-primary hover:bg-bg-dark rounded transition-colors"
                              title="Preview"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <Link
                              href={`/admin/posts/${translation.id}`}
                              className="p-1 text-primary hover:text-primary-light hover:bg-bg-dark rounded transition-colors"
                              title="Edit"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(translation.id, translation.title)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-bg-dark rounded transition-colors"
                              title="Delete"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg-dark">
            <div className="text-text-muted text-xs">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, groupedPosts.length)} of {groupedPosts.length} groups
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs rounded bg-bg-surface hover:bg-bg-darkest disabled:opacity-40 disabled:cursor-not-allowed text-text-secondary"
              >
                ««
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs rounded bg-bg-surface hover:bg-bg-darkest disabled:opacity-40 disabled:cursor-not-allowed text-text-secondary"
              >
                «
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2.5 py-1 text-xs rounded ${
                      currentPage === pageNum
                        ? 'bg-primary text-bg-darkest font-medium'
                        : 'bg-bg-surface hover:bg-bg-darkest text-text-secondary'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs rounded bg-bg-surface hover:bg-bg-darkest disabled:opacity-40 disabled:cursor-not-allowed text-text-secondary"
              >
                »
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs rounded bg-bg-surface hover:bg-bg-darkest disabled:opacity-40 disabled:cursor-not-allowed text-text-secondary"
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
