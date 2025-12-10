import { NextRequest, NextResponse } from 'next/server'

const SITE_URL = 'https://thejord.it'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const check = searchParams.get('check') || 'all'

  const results: {
    sitemap?: { total: number; ok: number; broken: { url: string; status: number | string }[] }
    contentLinks?: { total: number; ok: number; broken: { url: string; status: number | string; source?: string }[] }
    timestamp: string
    issues: { type: string; severity: 'error' | 'warning' | 'info'; message: string; url?: string }[]
  } = {
    timestamp: new Date().toISOString(),
    issues: [],
  }

  try {
    // Check sitemap URLs
    if (check === 'all' || check === 'sitemap') {
      const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`)
      const sitemapText = await sitemapRes.text()
      const urls: string[] = []
      const matches = sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)
      for (const match of matches) {
        urls.push(match[1])
      }

      const sitemapResults = await Promise.all(
        urls.map(async (url) => {
          try {
            const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
            return { url, status: res.status, ok: res.ok }
          } catch {
            return { url, status: 'ERROR' as const, ok: false }
          }
        })
      )

      const broken = sitemapResults.filter(r => !r.ok)
      results.sitemap = {
        total: sitemapResults.length,
        ok: sitemapResults.filter(r => r.ok).length,
        broken: broken.map(r => ({ url: r.url, status: r.status })),
      }

      // Add issues
      broken.forEach(b => {
        results.issues.push({
          type: 'broken_sitemap_url',
          severity: 'error',
          message: `Sitemap URL returns ${b.status}`,
          url: b.url,
        })
      })
    }

    // Check content links (internal links in pages)
    if (check === 'all' || check === 'content') {
      // Get pages to scan
      const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`)
      const sitemapText = await sitemapRes.text()
      const pageUrls: string[] = []
      const matches = sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)
      for (const match of matches) {
        if (match[1].includes('/blog/') || match[1].includes('/tools/')) {
          pageUrls.push(match[1])
        }
      }

      // Extract and check links from pages
      const allLinks = new Map<string, string[]>() // link -> source pages

      for (const pageUrl of pageUrls.slice(0, 20)) { // Limit to avoid timeout
        try {
          const res = await fetch(pageUrl)
          const html = await res.text()

          // Extract href attributes
          const hrefMatches = html.matchAll(/href="([^"]+)"/g)
          for (const match of hrefMatches) {
            let href = match[1]
            // Skip non-page links
            if (href.startsWith('http') && !href.includes('thejord.it')) continue
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue
            if (href.startsWith('/_next/') || href.startsWith('/api/') || href.startsWith('/cdn-cgi/')) continue
            if (href.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$/i)) continue

            // Convert to absolute URL
            if (href.startsWith('/')) {
              href = SITE_URL + href
            }

            if (href.includes('thejord.it')) {
              if (!allLinks.has(href)) allLinks.set(href, [])
              allLinks.get(href)!.push(pageUrl)
            }
          }
        } catch {
          // Skip failed fetches
        }
      }

      // Check unique links
      const linkResults = await Promise.all(
        [...allLinks.keys()].map(async (url) => {
          try {
            const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
            return { url, status: res.status, ok: res.ok, sources: allLinks.get(url) }
          } catch {
            return { url, status: 'ERROR' as const, ok: false, sources: allLinks.get(url) }
          }
        })
      )

      const broken = linkResults.filter(r => !r.ok)
      results.contentLinks = {
        total: linkResults.length,
        ok: linkResults.filter(r => r.ok).length,
        broken: broken.map(r => ({ url: r.url, status: r.status, source: r.sources?.[0] })),
      }

      // Add issues
      broken.forEach(b => {
        results.issues.push({
          type: 'broken_content_link',
          severity: 'warning',
          message: `Internal link returns ${b.status}`,
          url: b.url,
        })
      })
    }

    return NextResponse.json({
      success: true,
      data: results,
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
