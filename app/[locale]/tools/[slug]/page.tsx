import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { TOOLS, getToolBySlug, getToolTranslationKey } from '@/lib/tools-config'
import { getFAQSchema } from '@/lib/tools-faq'
import ToolWrapper from '@/components/ToolWrapper'
import { getTranslations } from 'next-intl/server'

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
  const t = await getTranslations({ locale, namespace: 'tools' })
  const tMeta = await getTranslations({ locale, namespace: 'toolsMeta' })

  if (!tool) {
    return {
      title: 'Tool Not Found',
    }
  }

  // Get translation key for this tool (e.g., 'jsonFormatter', 'base64')
  const translationKey = getToolTranslationKey(slug)

  // Get translated name and description, fallback to English config
  const toolName = t.has('list.' + translationKey + '.name')
    ? t('list.' + translationKey + '.name')
    : tool.name
  const toolDescription = tMeta.has(translationKey + '.description')
    ? tMeta(translationKey + '.description')
    : tool.metaDescription

  // Title without | THEJORD since layout template already adds it
  const titleSuffix = locale === 'it' ? 'Strumento Online Gratuito' : 'Free Online Tool'

  return {
    title: toolName + ' - ' + titleSuffix,
    description: toolDescription,
    keywords: tool.keywords.join(', '),
    openGraph: {
      type: 'website',
      url: 'https://thejord.it/' + locale + '/tools/' + tool.slug,
      title: toolName,
      description: toolDescription,
      siteName: 'THEJORD',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: toolName,
      description: toolDescription,
      creator: '@thejord_it',
    },
    alternates: {
      canonical: 'https://thejord.it/' + locale + '/tools/' + tool.slug,
      languages: {
        'it': 'https://thejord.it/it/tools/' + tool.slug,
        'en': 'https://thejord.it/en/tools/' + tool.slug,
        'x-default': 'https://thejord.it/en/tools/' + tool.slug,
      },
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug, locale } = await params
  const tool = getToolBySlug(slug)
  const t = await getTranslations({ locale, namespace: 'tools' })

  if (!tool) {
    notFound()
  }

  // Get translation key for this tool
  const translationKey = getToolTranslationKey(slug)
  const toolName = t.has('list.' + translationKey + '.name')
    ? t('list.' + translationKey + '.name')
    : tool.name

  // Schema.org JSON-LD for WebApplication with dynamic language
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    description: tool.metaDescription,
    url: 'https://thejord.it/' + locale + '/tools/' + tool.slug,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    keywords: tool.keywords.join(', '),
    inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
  }

  // BreadcrumbList schema for better navigation in search results
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://thejord.it/' + locale,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'it' ? 'Strumenti' : 'Tools',
        item: 'https://thejord.it/' + locale + '/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: toolName,
        item: 'https://thejord.it/' + locale + '/tools/' + tool.slug,
      },
    ],
  }

  // FAQ schema for rich snippets
  const faqSchema = getFAQSchema(slug, locale)

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Tool component wrapper */}
      <ToolWrapper toolSlug={slug} toolConfig={tool} />
    </>
  )
}
