import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const SITE_URL = 'sc-domain:thejord.it' // Domain property format

// Initialize auth client
function getAuthClient() {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!credentials) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON not configured')
  }

  const parsedCredentials = JSON.parse(credentials)
  return new google.auth.GoogleAuth({
    credentials: parsedCredentials,
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/webmasters',
    ],
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'
    const url = searchParams.get('url')

    const auth = getAuthClient()
    const searchconsole = google.searchconsole({ version: 'v1', auth })

    // Get indexing status for a specific URL
    if (action === 'inspect' && url) {
      const response = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: SITE_URL,
        },
      })

      const result = response.data.inspectionResult
      return NextResponse.json({
        success: true,
        data: {
          url,
          indexingState: result?.indexStatusResult?.coverageState,
          crawledAs: result?.indexStatusResult?.crawledAs,
          robotsTxtState: result?.indexStatusResult?.robotsTxtState,
          lastCrawlTime: result?.indexStatusResult?.lastCrawlTime,
          pageFetchState: result?.indexStatusResult?.pageFetchState,
          verdict: result?.indexStatusResult?.verdict,
          mobileUsability: result?.mobileUsabilityResult?.verdict,
        },
      })
    }

    // Get sitemaps status
    if (action === 'sitemaps') {
      const response = await searchconsole.sitemaps.list({
        siteUrl: SITE_URL,
      })

      return NextResponse.json({
        success: true,
        data: response.data.sitemap || [],
      })
    }

    // Submit sitemap
    if (action === 'submit-sitemap') {
      const sitemapUrl = searchParams.get('sitemap') || 'https://thejord.it/sitemap.xml'
      await searchconsole.sitemaps.submit({
        siteUrl: SITE_URL,
        feedpath: sitemapUrl,
      })

      return NextResponse.json({
        success: true,
        message: `Sitemap submitted: ${sitemapUrl}`,
      })
    }

    // Get search analytics (query performance)
    if (action === 'analytics') {
      const startDate = searchParams.get('startDate') || getDateDaysAgo(28)
      const endDate = searchParams.get('endDate') || getDateDaysAgo(0)

      const response = await searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 25,
        },
      })

      return NextResponse.json({
        success: true,
        data: response.data.rows?.map(row => ({
          query: row.keys?.[0],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr ? (row.ctr * 100).toFixed(2) : 0,
          position: row.position?.toFixed(1),
        })) || [],
      })
    }

    // Get page performance
    if (action === 'pages') {
      const startDate = searchParams.get('startDate') || getDateDaysAgo(28)
      const endDate = searchParams.get('endDate') || getDateDaysAgo(0)

      const response = await searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: 50,
        },
      })

      return NextResponse.json({
        success: true,
        data: response.data.rows?.map(row => ({
          page: row.keys?.[0],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr ? (row.ctr * 100).toFixed(2) : 0,
          position: row.position?.toFixed(1),
        })) || [],
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Available: inspect, sitemaps, submit-sitemap, analytics, pages',
    }, { status: 400 })

  } catch (error: unknown) {
    console.error('Search Console API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 })
  }
}

// POST for batch operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, urls } = body

    const auth = getAuthClient()
    const searchconsole = google.searchconsole({ version: 'v1', auth })

    // Batch inspect multiple URLs
    if (action === 'batch-inspect' && Array.isArray(urls)) {
      const results = []

      for (const url of urls.slice(0, 50)) { // Limit to 50 URLs
        try {
          const response = await searchconsole.urlInspection.index.inspect({
            requestBody: {
              inspectionUrl: url,
              siteUrl: SITE_URL,
            },
          })

          const result = response.data.inspectionResult
          results.push({
            url,
            indexed: result?.indexStatusResult?.coverageState === 'Submitted and indexed',
            verdict: result?.indexStatusResult?.verdict,
            lastCrawl: result?.indexStatusResult?.lastCrawlTime,
            error: null,
          })

          // Rate limiting - 600 requests per minute max
          await new Promise(resolve => setTimeout(resolve, 150))
        } catch (err) {
          results.push({
            url,
            indexed: false,
            verdict: 'ERROR',
            error: err instanceof Error ? err.message : 'Unknown error',
          })
        }
      }

      const indexed = results.filter(r => r.indexed).length
      const notIndexed = results.filter(r => !r.indexed && !r.error).length
      const errors = results.filter(r => r.error).length

      return NextResponse.json({
        success: true,
        summary: {
          total: results.length,
          indexed,
          notIndexed,
          errors,
        },
        data: results,
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 })

  } catch (error: unknown) {
    console.error('Search Console API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 })
  }
}

function getDateDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}
