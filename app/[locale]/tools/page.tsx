import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolsSearch from '@/components/tools/ToolsSearch'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tools' })
  const tMeta = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['developer tools', 'json formatter', 'base64', 'regex tester', 'hash generator', 'url encoder', 'markdown converter'],
    openGraph: {
      title: `${t('title')} | THEJORD`,
      description: t('description'),
      type: 'website',
    },
  }
}

const tools = [
  {
    slug: 'json-formatter',
    key: 'jsonFormatter',
    icon: '{ }',
    color: 'from-blue-500 to-cyan-500',
    categoryKey: 'textProcessing'
  },
  {
    slug: 'base64',
    key: 'base64',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
    categoryKey: 'encoding'
  },
  {
    slug: 'regex-tester',
    key: 'regexTester',
    icon: '.*',
    color: 'from-cyan-500 to-teal-500',
    categoryKey: 'development'
  },
  {
    slug: 'hash-generator',
    key: 'hashGenerator',
    icon: '#',
    color: 'from-green-500 to-emerald-500',
    categoryKey: 'security'
  },
  {
    slug: 'url-encoder',
    key: 'urlEncoder',
    icon: '%',
    color: 'from-orange-500 to-red-500',
    categoryKey: 'encoding'
  },
  {
    slug: 'markdown-converter',
    key: 'markdownConverter',
    icon: 'MD',
    color: 'from-indigo-500 to-purple-500',
    categoryKey: 'textProcessing'
  },
  {
    slug: 'color-converter',
    key: 'colorConverter',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    categoryKey: 'design'
  },
  {
    slug: 'lorem-ipsum',
    key: 'loremIpsum',
    icon: 'Aa',
    color: 'from-amber-500 to-orange-500',
    categoryKey: 'textProcessing'
  },
  {
    slug: 'diff-checker',
    key: 'diffChecker',
    icon: '+-',
    color: 'from-teal-500 to-cyan-500',
    categoryKey: 'development'
  },
  {
    slug: 'cron-builder',
    key: 'cronBuilder',
    icon: '⏰',
    color: 'from-violet-500 to-purple-500',
    categoryKey: 'development'
  },
  {
    slug: 'json-schema',
    key: 'jsonSchema',
    icon: '{}',
    color: 'from-sky-500 to-blue-500',
    categoryKey: 'development'
  },
  {
    slug: 'xml-wsdl-viewer',
    key: 'xmlWsdlViewer',
    icon: '</>',
    color: 'from-emerald-500 to-teal-500',
    categoryKey: 'development'
  },
  {
    slug: 'pdf-tools',
    key: 'pdfTools',
    icon: 'PDF',
    color: 'from-red-500 to-orange-500',
    categoryKey: 'documents'
  },
]

export default function ToolsPage() {
  return <ToolsSearch tools={tools} />
}
