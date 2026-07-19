import { getBlogPosts, BlogPostListItem } from '@/lib/api'
import { TOOLS } from '@/lib/tools-config'

// llms.txt — machine-readable site summary for LLMs / AI answer engines.
// Spec: https://llmstxt.org — H1 name, blockquote summary, then link sections.
// English is the primary/default locale (x-default = /en).
export async function GET() {
  const baseUrl = 'https://thejord.it'
  const locale = 'en'

  let posts: BlogPostListItem[] = []
  try {
    posts = await getBlogPosts(locale)
  } catch (error) {
    console.warn('Failed to fetch blog posts for llms.txt:', error)
    posts = []
  }

  const lines: string[] = []

  lines.push('# THEJORD')
  lines.push('')
  lines.push(
    '> Free, privacy-first developer tools and technical guides. Every tool runs 100% ' +
      'client-side in the browser — no file or data is ever uploaded to a server. ' +
      'Built and maintained by a solo founder, Domenico Giordano.'
  )
  lines.push('')
  lines.push(
    'THEJORD offers online utilities for developers (JSON, Base64, cron, UUID, regex, ' +
      'diff, PDF and more) plus in-depth tutorials. Content is available in English (' +
      `${baseUrl}/en) and Italian (${baseUrl}/it).`
  )
  lines.push('')

  // Tools section
  lines.push('## Tools')
  lines.push('')
  for (const tool of TOOLS) {
    const url = `${baseUrl}/${locale}/tools/${tool.slug}`
    lines.push(`- [${tool.name}](${url}): ${tool.description}`)
  }
  lines.push('')

  // Blog section
  if (posts.length > 0) {
    lines.push('## Guides & Articles')
    lines.push('')
    for (const post of posts) {
      const url = `${baseUrl}/${locale}/blog/${post.slug}`
      const summary = (post.excerpt || '').trim()
      lines.push(summary ? `- [${post.title}](${url}): ${summary}` : `- [${post.title}](${url})`)
    }
    lines.push('')
  }

  // Key pages
  lines.push('## Key Pages')
  lines.push('')
  lines.push(`- [All Tools](${baseUrl}/${locale}/tools): Full catalogue of developer tools.`)
  lines.push(`- [PDF Tools](${baseUrl}/${locale}/pdf-tools): Merge, split, compress and convert PDFs client-side.`)
  lines.push(`- [Blog](${baseUrl}/${locale}/blog): Technical guides and tutorials.`)
  lines.push(`- [About](${baseUrl}/${locale}/about): About THEJORD and the privacy-first approach.`)
  lines.push('')

  const body = lines.join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
