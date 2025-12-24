import { NextRequest, NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID

// Initialize GA4 Data API client
function getAnalyticsClient() {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!credentials) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON not configured')
  }

  const parsedCredentials = JSON.parse(credentials)
  return new BetaAnalyticsDataClient({
    credentials: parsedCredentials,
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'rss-stats'

    if (!GA4_PROPERTY_ID) {
      return NextResponse.json({
        success: false,
        error: 'GA4_PROPERTY_ID not configured',
      }, { status: 500 })
    }

    const client = getAnalyticsClient()

    // Get RSS access statistics
    if (action === 'rss-stats') {
      const [response] = await client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        dimensions: [
          { name: 'eventName' },
          { name: 'customEvent:language' },
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              value: 'rss_access',
            },
          },
        },
      })

      // Parse results
      const byLanguage: Record<string, number> = {}
      let total = 0

      response.rows?.forEach(row => {
        const lang = row.dimensionValues?.[1]?.value || 'unknown'
        const count = parseInt(row.metricValues?.[0]?.value || '0', 10)
        byLanguage[lang] = (byLanguage[lang] || 0) + count
        total += count
      })

      return NextResponse.json({
        success: true,
        data: {
          total,
          byLanguage,
          period: '28 days',
        },
      })
    }

    // Get RSS access by user agent (RSS readers)
    if (action === 'rss-readers') {
      const [response] = await client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        dimensions: [
          { name: 'eventName' },
          { name: 'customEvent:user_agent' },
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              value: 'rss_access',
            },
          },
        },
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 20,
      })

      const readers = response.rows?.map(row => ({
        userAgent: row.dimensionValues?.[1]?.value || 'unknown',
        count: parseInt(row.metricValues?.[0]?.value || '0', 10),
      })) || []

      return NextResponse.json({
        success: true,
        data: { readers },
      })
    }

    // Get RSS access over time
    if (action === 'rss-trend') {
      const [response] = await client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        dimensions: [
          { name: 'date' },
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              value: 'rss_access',
            },
          },
        },
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      })

      const trend = response.rows?.map(row => ({
        date: row.dimensionValues?.[0]?.value || '',
        count: parseInt(row.metricValues?.[0]?.value || '0', 10),
      })) || []

      return NextResponse.json({
        success: true,
        data: { trend },
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Available: rss-stats, rss-readers, rss-trend',
    }, { status: 400 })

  } catch (error: unknown) {
    console.error('GA4 Analytics API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 })
  }
}
