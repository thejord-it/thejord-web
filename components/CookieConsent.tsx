'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useLocale } from 'next-intl'

const translations = {
  it: {
    title: 'Preferenze Cookie',
    description: 'Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico del sito. Tutti gli strumenti per sviluppatori elaborano i dati localmente nel tuo browser - nessun dato viene inviato ai nostri server.',
    details: 'Accettando, ci permetti di utilizzare Google Analytics per capire come i visitatori usano il nostro sito. Leggi la nostra',
    privacyPolicy: 'Privacy Policy',
    forMoreDetails: 'per maggiori dettagli.',
    rejectOptional: 'Rifiuta Opzionali',
    acceptAll: 'Accetta Tutti',
    essential: 'Essenziali: Sempre attivi',
    analytics: 'Analytics: A tua scelta',
    privacyFirst: '100% Privacy-First',
  },
  en: {
    title: 'Cookie Preferences',
    description: 'We use cookies to improve your experience and analyze site traffic. All developer tools process data locally in your browser - no data is sent to our servers.',
    details: 'By accepting, you allow us to use Google Analytics to understand how visitors use our site. Read our',
    privacyPolicy: 'Privacy Policy',
    forMoreDetails: 'for more details.',
    rejectOptional: 'Reject Optional',
    acceptAll: 'Accept All',
    essential: 'Essential: Always active',
    analytics: 'Analytics: Your choice',
    privacyFirst: '100% Privacy-First',
  },
}

export default function CookieConsent() {
  const locale = useLocale() as 'it' | 'en'
  const t = translations[locale] || translations.en
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = Cookies.get('cookie_consent')
    if (!consent) {
      setTimeout(() => {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 50)
      }, 1000)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'accepted', { expires: 365 })
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
    closeBanner()
  }

  const handleReject = () => {
    Cookies.set('cookie_consent', 'rejected', { expires: 365 })
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
                {t.title}
              </h3>
              <p className="text-text-secondary text-sm mb-2">
                {t.description}
              </p>
              <p className="text-text-muted text-xs">
                {t.details}{' '}
                <Link href={`/${locale}/privacy`} className="text-primary hover:text-primary-light underline">
                  {t.privacyPolicy}
                </Link>{' '}
                {t.forMoreDetails}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleReject}
                className="px-6 py-3 border-2 border-border hover:border-text-muted text-text-primary font-semibold rounded-lg transition-all whitespace-nowrap"
              >
                {t.rejectOptional}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary text-bg-darkest font-semibold rounded-lg transition-all shadow-lg hover:shadow-primary/50 whitespace-nowrap"
              >
                {t.acceptAll}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍪</span>
              <span>{t.essential}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span>{t.analytics}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>{t.privacyFirst}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
