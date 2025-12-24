import { getBlogPosts, BlogPostListItem } from '@/lib/api'

const SITE_URL = 'https://thejord.it'
const SITE_TITLE = 'THEJORD Blog'
const SITE_DESCRIPTION = 'Tech insights, development tools, and tutorials from THEJORD'

// GA4 Measurement Protocol configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GA_API_SECRET = process.env.GA_API_SECRET

// Track RSS access via GA4 Measurement Protocol
async function trackRssAccess(locale: string, userAgent: string) {
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) return

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: `rss-${Date.now()}`,
          events: [{
            name: 'rss_access',
            params: {
              language: locale,
              user_agent: userAgent.slice(0, 100),
              engagement_time_msec: 1,
            }
          }]
        })
      }
    )
  } catch {
    // Silently fail - don't break RSS feed for tracking errors
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function generateRssItem(post: BlogPostListItem, locale: string): string {
  const pubDate = post.publishedAt
    ? new Date(post.publishedAt).toUTCString()
    : new Date(post.createdAt).toUTCString()

  const link = `${SITE_URL}/${locale}/blog/${post.slug}`
  const description = escapeXml(stripHtml(post.excerpt || ''))
  const title = escapeXml(post.title)
  const author = escapeXml(post.author || 'THEJORD Team')

  const categories = post.tags
    .map(tag => `      <category>${escapeXml(tag)}</category>`)
    .join('\n')

  return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <author>info@thejord.it (${author})</author>
${categories}
    </item>`
}

function generateRssFeed(
  posts: BlogPostListItem[],
  locale: string,
  title: string,
  description: string
): string {
  const feedUrl = `${SITE_URL}/api/rss?lang=${locale}`
  const siteLink = `${SITE_URL}/${locale}`
  const lastBuildDate = new Date().toUTCString()

  const items = posts
    .filter(post => post.language === locale)
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt)
      const dateB = new Date(b.publishedAt || b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 50) // Limit to 50 most recent posts
    .map(post => generateRssItem(post, locale))
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteLink}</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <generator>THEJORD RSS Generator</generator>
    <webMaster>info@thejord.it (THEJORD Team)</webMaster>
    <managingEditor>info@thejord.it (THEJORD Team)</managingEditor>
    <image>
      <url>${SITE_URL}/images/logo.png</url>
      <title>${escapeXml(title)}</title>
      <link>${siteLink}</link>
    </image>
${items}
  </channel>
</rss>`
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const locale = url.searchParams.get('lang') || 'it'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Track RSS access (non-blocking)
  trackRssAccess(locale, userAgent)

  try {
    // Fetch posts for the requested locale
    const posts = await getBlogPosts(locale)

    const title = locale === 'it'
      ? 'THEJORD Blog - Articoli Tech e Tutorial'
      : 'THEJORD Blog - Tech Articles and Tutorials'

    const description = locale === 'it'
      ? 'Articoli tecnici, guide agli strumenti di sviluppo e tutorial da THEJORD'
      : 'Tech insights, development tools, and tutorials from THEJORD'

    const feed = generateRssFeed(posts, locale, title, description)

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)

    // Return empty feed on error
    const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
  </channel>
</rss>`

    return new Response(emptyFeed, {
      status: 500,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  }
}
