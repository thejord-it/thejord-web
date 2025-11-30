import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return {
    title: t('title'),
    description: locale === 'it'
      ? 'Privacy policy e informazioni sulla protezione dei dati per la piattaforma web THEJORD'
      : 'Privacy policy and data protection information for THEJORD web platform',
  }
}

export default function PrivacyPage() {
  const t = useTranslations('privacy')
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-bg-darkest py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="text-primary hover:text-primary-light transition-colors text-sm"
          >
            {t('backToHome')}
          </Link>
        </div>

        <article className="bg-bg-dark border border-border rounded-xl p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">{t('title')}</h1>
          <p className="text-text-muted text-sm mb-8">{t('lastUpdated')}: November 20, 2025</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('intro.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('intro.text')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('approach.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('approach.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>{t('approach.points.clientSide')}</li>
                <li>{t('approach.points.noServer')}</li>
                <li>{t('approach.points.noAccount')}</li>
                <li>{t('approach.points.minimalAnalytics')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('collect.title')}</h2>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">{t('collect.analytics.title')}</h3>
              <p className="text-text-secondary mb-4">
                {t('collect.analytics.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>{t('collect.analytics.points.pages')}</li>
                <li>{t('collect.analytics.points.browser')}</li>
                <li>{t('collect.analytics.points.device')}</li>
                <li>{t('collect.analytics.points.ip')}</li>
                <li>{t('collect.analytics.points.referrer')}</li>
                <li>{t('collect.analytics.points.location')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">{t('collect.tools.title')}</h3>
              <p className="text-text-secondary mb-4">
                {t('collect.tools.text')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('cookies.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('cookies.text')}
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">{t('cookies.analytics.title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><code className="bg-bg-darkest px-2 py-1 rounded text-primary-light">_ga</code> {t('cookies.analytics.ga')}</li>
                <li><code className="bg-bg-darkest px-2 py-1 rounded text-primary-light">_ga_*</code> {t('cookies.analytics.gaId')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">{t('cookies.preferences.title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><code className="bg-bg-darkest px-2 py-1 rounded text-primary-light">cookie_consent</code> {t('cookies.preferences.consent')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('usage.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('usage.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>{t('usage.points.popularity')}</li>
                <li>{t('usage.points.ux')}</li>
                <li>{t('usage.points.issues')}</li>
                <li>{t('usage.points.traffic')}</li>
              </ul>
              <p className="text-text-secondary mb-4">
                {t('usage.noSale')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('gdpr.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('gdpr.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><strong>{locale === 'it' ? 'Diritto di Accesso:' : 'Right to Access:'}</strong> {t('gdpr.rights.access')}</li>
                <li><strong>{locale === 'it' ? 'Diritto di Rettifica:' : 'Right to Rectification:'}</strong> {t('gdpr.rights.rectification')}</li>
                <li><strong>{locale === 'it' ? 'Diritto alla Cancellazione:' : 'Right to Erasure:'}</strong> {t('gdpr.rights.erasure')}</li>
                <li><strong>{locale === 'it' ? 'Diritto di Limitazione:' : 'Right to Restrict Processing:'}</strong> {t('gdpr.rights.restrict')}</li>
                <li><strong>{locale === 'it' ? 'Diritto alla Portabilità:' : 'Right to Data Portability:'}</strong> {t('gdpr.rights.portability')}</li>
                <li><strong>{locale === 'it' ? 'Diritto di Opposizione:' : 'Right to Object:'}</strong> {t('gdpr.rights.object')}</li>
                <li><strong>{locale === 'it' ? 'Diritto di Revoca:' : 'Right to Withdraw Consent:'}</strong> {t('gdpr.rights.withdraw')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('optout.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('optout.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>{t('optout.points.banner')}</li>
                <li>{t('optout.points.addon')} - <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light underline">Google Analytics Opt-out</a></li>
                <li>{t('optout.points.dnt')}</li>
                <li>{t('optout.points.extensions')}</li>
                <li>{t('optout.points.incognito')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('security.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('security.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>{t('security.points.https')}</li>
                <li>{t('security.points.hsts')}</li>
                <li>{t('security.points.csp')}</li>
                <li>{t('security.points.audits')}</li>
                <li>{t('security.points.anonymization')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('thirdParty.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('thirdParty.text')}
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">{t('thirdParty.ga.title')}</h3>
              <p className="text-text-secondary mb-4">
                {t('thirdParty.ga.text')}{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light underline">
                  https://policies.google.com/privacy
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('children.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('children.text')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('international.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('international.text')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('changes.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('changes.text')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('contactSection.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('contactSection.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><Link href={`/${locale}/contact`} className="text-primary hover:text-primary-light underline">{t('contactSection.visitContact')}</Link></li>
                <li><Link href={`/${locale}/changelog`} className="text-primary hover:text-primary-light underline">{t('contactSection.visitChangelog')}</Link></li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('legal.title')}</h2>
              <p className="text-text-secondary mb-4">
                {t('legal.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><strong>{locale === 'it' ? 'Interesse Legittimo:' : 'Legitimate Interest:'}</strong> {t('legal.legitimate')}</li>
                <li><strong>{locale === 'it' ? 'Consenso:' : 'Consent:'}</strong> {t('legal.consent')}</li>
              </ul>
              <p className="text-text-secondary mb-4">
                {t('legal.withdraw')}
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}`}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-bg-darkest font-semibold rounded-lg transition-colors text-center"
              >
                {t('backToHome').replace('← ', '')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="px-6 py-3 border-2 border-border hover:border-primary text-text-primary font-semibold rounded-lg transition-colors text-center"
              >
                {locale === 'it' ? 'Contattaci' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
