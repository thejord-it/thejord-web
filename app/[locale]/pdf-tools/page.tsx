import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pdfTools' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['pdf tools', 'merge pdf', 'split pdf', 'compress pdf', 'pdf to images', 'images to pdf', 'pdf editor', 'free pdf tools'],
    openGraph: {
      title: `${t('title')} | THEJORD`,
      description: t('description'),
      type: 'website',
    },
  }
}

export default async function PdfToolsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pdfTools' })

  const features = [
    {
      icon: '🔗',
      titleKey: 'features.merge.title',
      descKey: 'features.merge.description',
    },
    {
      icon: '✂️',
      titleKey: 'features.split.title',
      descKey: 'features.split.description',
    },
    {
      icon: '📝',
      titleKey: 'features.edit.title',
      descKey: 'features.edit.description',
    },
    {
      icon: '🔄',
      titleKey: 'features.convert.title',
      descKey: 'features.convert.description',
    },
    {
      icon: '📦',
      titleKey: 'features.compress.title',
      descKey: 'features.compress.description',
    },
  ]

  return (
    <div className="min-h-screen bg-bg-darkest">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white text-3xl font-bold mb-6">
            PDF
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            {t('description')}
          </p>
          <Link
            href={`/${locale}/tools/pdf-tools`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
          >
            {t('openTool')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-bg-dark border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-text-secondary text-sm">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Privacy Banner */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔒</div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t('privacy.title')}
              </h3>
              <p className="text-text-secondary">
                {t('privacy.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Why Use Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-8">{t('whyUse.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-dark border border-border rounded-xl p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-text-primary mb-2">{t('whyUse.fast.title')}</h3>
              <p className="text-text-secondary text-sm">{t('whyUse.fast.description')}</p>
            </div>
            <div className="bg-bg-dark border border-border rounded-xl p-6">
              <div className="text-3xl mb-3">🆓</div>
              <h3 className="font-semibold text-text-primary mb-2">{t('whyUse.free.title')}</h3>
              <p className="text-text-secondary text-sm">{t('whyUse.free.description')}</p>
            </div>
            <div className="bg-bg-dark border border-border rounded-xl p-6">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-text-primary mb-2">{t('whyUse.works.title')}</h3>
              <p className="text-text-secondary text-sm">{t('whyUse.works.description')}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}/tools/pdf-tools`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-lg"
          >
            {t('startNow')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
