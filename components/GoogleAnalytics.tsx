'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const [shouldTrack, setShouldTrack] = useState(false)

  useEffect(() => {
    // Check if this is a developer/internal access
    async function checkIfInternal() {
      try {
        // Skip if already marked as dev in localStorage
        if (localStorage.getItem('thejord_dev_mode') === 'true') {
          console.log('[GA] Developer mode - tracking disabled')
          return
        }

        // Fetch IP to check if internal
        const res = await fetch('https://ipinfo.io/json', {
          signal: AbortSignal.timeout(3000)
        })
        const data = await res.json()
        const ip = data.ip || ''

        // Check Tailscale range (100.64.0.0/10 = 100.64.* to 100.127.*)
        const isTailscale = /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip)

        // Check known IPs (Fastweb home - update if changes)
        const knownDevIPs = ['93.41.245.152']
        const isKnownDev = knownDevIPs.includes(ip)

        if (isTailscale || isKnownDev) {
          console.log(`[GA] Internal IP detected (${ip}) - tracking disabled`)
          localStorage.setItem('thejord_dev_mode', 'true')
          return
        }

        // Not internal - enable tracking
        setShouldTrack(true)
      } catch {
        // On error (timeout, blocked), enable tracking to not lose real users
        setShouldTrack(true)
      }
    }

    checkIfInternal()
  }, [])

  if (!shouldTrack) {
    return null
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  )
}
