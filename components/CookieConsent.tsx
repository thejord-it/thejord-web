'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = Cookies.get('cookie_consent')

    if (!consent) {
      // Small delay for animation
      setTimeout(() => {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 50)
      }, 1000)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'accepted', { expires: 365 })

    // Enable Google Analytics if it's loaded
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }

    closeBanner()
  }

  const handleReject = () => {
    Cookies.set('cookie_consent', 'rejected', { expires: 365 })

    // Disable Google Analytics if it's loaded
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }

    closeBanner()
  }

  const closeBanner = () => {
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  if (!showBanner) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-bg-dark border-t-2 border-primary shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Cookie Preferences
              </h3>
              <p className="text-text-secondary text-sm mb-2">
                We use cookies to improve your experience and analyze site traffic.
                All developer tools process data locally in your browser - no data is sent to our servers.
              </p>
              <p className="text-text-muted text-xs">
                By accepting, you allow us to use Google Analytics to understand how visitors use our site.
                Read our{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-light underline">
                  Privacy Policy
                </Link>{' '}
                for more details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleReject}
                className="px-6 py-3 border-2 border-border hover:border-text-muted text-text-primary font-semibold rounded-lg transition-all whitespace-nowrap"
              >
                Reject Optional
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary text-bg-darkest font-semibold rounded-lg transition-all shadow-lg hover:shadow-primary/50 whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍪</span>
              <span>Essential: Always active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span>Analytics: Your choice</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>100% Privacy-First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
