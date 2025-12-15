import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { TOOLS, getToolBySlug } from '@/lib/tools-config'
import ToolWrapper from '@/components/ToolWrapper'

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

// Generate static params for all tools
export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }))
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    return {
      title: 'Tool Not Found',
    }
  }

  return {
    title: `${tool.name} - Free Online Tool | THEJORD`,
    description: tool.metaDescription,
    keywords: tool.keywords.join(', '),
    openGraph: {
      type: 'website',
      url: `https://thejord.it/${locale}/tools/${tool.slug}`,
      title: tool.name,
      description: tool.metaDescription,
      siteName: 'THEJORD',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: tool.name,
      description: tool.metaDescription,
      creator: '@thejord_it',
    },
    alternates: {
      canonical: `https://thejord.it/${locale}/tools/${tool.slug}`,
      languages: {
        'it': `https://thejord.it/it/tools/${tool.slug}`,
        'en': `https://thejord.it/en/tools/${tool.slug}`,
      },
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  // Schema.org JSON-LD for WebApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.metaDescription,
    url: `https://thejord.it/tools/${tool.slug}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    keywords: tool.keywords.join(', '),
    inLanguage: 'it-IT',
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Tool component wrapper */}
      <ToolWrapper toolSlug={slug} toolConfig={tool} />
    </>
  )
}
