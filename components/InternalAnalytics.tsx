'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Cookie utilities
function setCookie(name: string, value: string, minutes: number): void {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

// Browser fingerprint for user identification (privacy-friendly)
function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') return ''

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    // Canvas fingerprint (simplified)
    (() => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return ''
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillText('thejord', 2, 2)
        return canvas.toDataURL().slice(-50)
      } catch {
        return ''
      }
    })()
  ]

  // Simple hash function
  const str = components.join('|')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

// Session ID with 30-minute sliding expiry (like GA4)
const SESSION_DURATION_MINUTES = 30

function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = getCookie('thejord_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
  }
  // Refresh cookie expiry on every access (sliding window)
  setCookie('thejord_session_id', sessionId, SESSION_DURATION_MINUTES)
  return sessionId
}

// User ID persists across sessions (365 days)
function getUserId(): string {
  if (typeof window === 'undefined') return ''

  let userId = getCookie('thejord_user_id')
  if (!userId) {
    // Combine fingerprint with random for uniqueness
    const fingerprint = getBrowserFingerprint()
    userId = fingerprint + '_' + crypto.randomUUID().slice(0, 8)
    setCookie('thejord_user_id', userId, 60 * 24 * 365) // 1 year
  }
  return userId
}

// Throttling to prevent event spam
const eventThrottleMap = new Map<string, number>()
const THROTTLE_MS = 1000 // 1 second between same events

function shouldThrottle(eventKey: string): boolean {
  const now = Date.now()
  const lastTime = eventThrottleMap.get(eventKey)

  if (lastTime && now - lastTime < THROTTLE_MS) {
    return true
  }

  eventThrottleMap.set(eventKey, now)
  return false
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
    const sessionId = getSessionId()
    const userId = getUserId()
    if (!sessionId || !userId) return

    // Throttle same events
    const throttleKey = `${event}_${data?.toolName || ''}_${data?.path || ''}`
    if (event !== 'pageview' && shouldThrottle(throttleKey)) {
      return
    }

    const payload = {
      path: data?.path || window.location.pathname,
      event,
      referrer: document.referrer || null,
      sessionId,
      userId,
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
