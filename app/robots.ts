import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = 'https://thejord.it'
  
  // Check if we're on staging by looking at the host header
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isStaging = host.includes('staging') || host.includes('localhost')

  // Block indexing on staging/preview environments
  if (isStaging) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
