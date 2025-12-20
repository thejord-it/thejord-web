'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getScheduledPosts, updatePost, BlogPost } from '@/lib/api'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  extendedProps: {
    post: BlogPost
  }
}

export default function CalendarPage() {
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const loadScheduledPosts = useCallback(async () => {
    try {
      const posts = await getScheduledPosts()
      const calendarEvents: CalendarEvent[] = posts.map(post => ({
        id: post.id,
        title: `${post.language.toUpperCase()}: ${post.title}`,
        start: new Date(post.scheduledAt!),
        extendedProps: {
          post
        }
      }))
      setEvents(calendarEvents)
    } catch (error) {
      console.error('Failed to load scheduled posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadScheduledPosts()
  }, [loadScheduledPosts])

  const handleEventClick = (info: any) => {
    const post = info.event.extendedProps.post as BlogPost
    setSelectedPost(post)
  }

  const handleEventDrop = async (info: any) => {
    const post = info.event.extendedProps.post as BlogPost
    const newDate = info.event.start

    if (!newDate) return

    try {
      await updatePost(post.id, {
        scheduledAt: newDate.toISOString()
      })
      await loadScheduledPosts()
    } catch (error) {
      console.error('Failed to update scheduled date:', error)
      info.revert()
      alert('Failed to update scheduled date')
    }
  }

  const handleCancelSchedule = async (postId: string) => {
    if (!confirm('Cancel the schedule for this post? It will become a draft.')) return

    try {
      await updatePost(postId, { scheduledAt: null })
      setSelectedPost(null)
      await loadScheduledPosts()
    } catch (error) {
      console.error('Failed to cancel schedule:', error)
      alert('Failed to cancel schedule')
    }
  }

  const handlePublishNow = async (postId: string) => {
    if (!confirm('Publish this post now?')) return

    try {
      await updatePost(postId, {
        published: true,
        publishedAt: new Date().toISOString(),
        scheduledAt: null
      })
      setSelectedPost(null)
      await loadScheduledPosts()
    } catch (error) {
      console.error('Failed to publish post:', error)
      alert('Failed to publish post')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Publication Calendar</h1>
          <p className="text-text-muted mt-1">View and manage scheduled posts</p>
        </div>
        <Link
          href="/admin/posts"
          className="text-text-secondary hover:text-text-primary flex items-center gap-2"
        >
          ← Back to Posts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-bg-surface border border-border rounded-lg p-6">
          {loading ? (
            <div className="text-center py-12 text-text-muted">Loading calendar...</div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              editable={true}
              droppable={true}
              eventDrop={handleEventDrop}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              locale="it"
              firstDay={1}
              height="auto"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              eventContent={(eventInfo) => (
                <div className="p-1 text-xs overflow-hidden">
                  <div className="font-medium truncate">{eventInfo.event.title}</div>
                  <div className="text-gray-300">
                    {eventInfo.event.start?.toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            />
          )}
        </div>

        {/* Sidebar - Selected Post Details */}
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Post Details</h2>

          {selectedPost ? (
            <div className="space-y-4">
              <div>
                <p className="text-text-muted text-sm">Title</p>
                <p className="text-text-primary font-medium">{selectedPost.title}</p>
              </div>

              <div>
                <p className="text-text-muted text-sm">Language</p>
                <span className={`uppercase text-sm font-medium px-2 py-1 rounded ${
                  selectedPost.language === 'it'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-purple-500/10 text-purple-400'
                }`}>
                  {selectedPost.language}
                </span>
              </div>

              <div>
                <p className="text-text-muted text-sm">Scheduled For</p>
                <p className="text-yellow-400 font-medium">
                  {new Date(selectedPost.scheduledAt!).toLocaleString('it-IT', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
              </div>

              <div>
                <p className="text-text-muted text-sm">Excerpt</p>
                <p className="text-text-secondary text-sm line-clamp-3">{selectedPost.excerpt}</p>
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div>
                  <p className="text-text-muted text-sm">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPost.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-bg-dark rounded text-xs text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border space-y-2">
                <button
                  onClick={() => router.push(`/admin/posts/${selectedPost.id}`)}
                  className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-bg-darkest font-medium rounded-lg transition-colors"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => handlePublishNow(selectedPost.id)}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Publish Now
                </button>
                <button
                  onClick={() => handleCancelSchedule(selectedPost.id)}
                  className="w-full px-4 py-2 bg-bg-dark hover:bg-bg-darkest text-text-secondary font-medium rounded-lg transition-colors"
                >
                  Cancel Schedule
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p>Click on a scheduled post to view details</p>
              <p className="text-sm mt-2">Drag events to reschedule</p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-text-muted text-sm">Scheduled Posts</p>
            <p className="text-2xl font-bold text-primary">{events.length}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-bg-surface border border-border rounded-lg p-4">
        <p className="text-text-muted text-sm">
          <strong>Tip:</strong> Drag and drop events to change their scheduled date. Click on an event to see details and actions.
        </p>
      </div>
    </div>
  )
}
