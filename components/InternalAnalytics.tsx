'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Session ID persists across page navigations
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('thejord_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('thejord_session_id', sessionId)
  }
  return sessionId
}

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://thejord.it/api/proxy'

// Track event function (exported for use in tools)
export async function trackEvent(
  event: string,
  data?: {
    path?: string
    toolName?: string
    metadata?: Record<string, unknown>
  }
): Promise<void> {
  try {
    // Skip if in dev mode
    if (typeof window !== 'undefined' && localStorage.getItem('thejord_dev_mode') === 'true') {
      return
    }

    const sessionId = getSessionId()
    if (!sessionId) return

    const payload = {
      path: data?.path || window.location.pathname,
      event,
      referrer: document.referrer || null,
      sessionId,
      language: document.documentElement.lang || 'en',
      toolName: data?.toolName,
      metadata: data?.metadata
    }

    // Use sendBeacon for non-blocking tracking (best for pageviews)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon(`${API_URL}/api/analytics/track`, blob)
    } else {
      // Fallback to fetch
      fetch(`${API_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {})
    }
  } catch {
    // Silently fail - analytics should never break the app
  }
}

// Track pageview
export function trackPageview(path?: string): void {
  trackEvent('pageview', { path })
}

// Track tool usage
export function trackToolUsage(toolName: string, action?: string): void {
  trackEvent('tool_usage', {
    toolName,
    metadata: action ? { action } : undefined
  })
}

// Component that auto-tracks pageviews on route change
export default function InternalAnalytics() {
  const pathname = usePathname()
  const lastPath = useRef<string>('')

  useEffect(() => {
    // Skip if in dev mode
    if (localStorage.getItem('thejord_dev_mode') === 'true') {
      console.log('[Analytics] Developer mode - tracking disabled')
      return
    }

    // Avoid duplicate tracking for the same path
    if (pathname === lastPath.current) return
    lastPath.current = pathname

    // Small delay to ensure page is loaded
    const timer = setTimeout(() => {
      trackPageview(pathname)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // This component doesn't render anything
  return null
}
