import Layout from '@/components/tools/Layout'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/tools/SEO'

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <Layout showFullNav={false}>
      <SEO
        title="Privacy Policy - THEJORD.IT"
        description="THEJORD.IT Privacy Policy: How we collect, use, and protect your data. GDPR compliant, 100% client-side processing, IP anonymization."
        path="/privacy"
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">
          <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
            {t('privacy.title')}
          </span>
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-text-secondary">
          <p className="text-sm text-text-muted">
            {t('privacy.lastUpdate')} {new Date().toLocaleDateString(t('language.current') === 'Italiano' ? 'it-IT' : 'en-US')}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.intro.title')}</h2>
            <p>
              {t('privacy.sections.intro.p1')}
            </p>
            <p>
              {t('privacy.sections.intro.p2')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.dataCollection.title')}</h2>

            <h3 className="text-xl font-semibold text-text-primary mb-2">{t('privacy.sections.dataCollection.analytics.title')}</h3>
            <p>
              {t('privacy.sections.dataCollection.analytics.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t('privacy.sections.dataCollection.analytics.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-4">
              {t('privacy.sections.dataCollection.analytics.anonymization')}
            </p>

            <h3 className="text-xl font-semibold text-text-primary mb-2 mt-6">{t('privacy.sections.dataCollection.local.title')}</h3>
            <p>
              {t('privacy.sections.dataCollection.local.desc')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.usage.title')}</h2>
            <p>{t('privacy.sections.usage.intro')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('privacy.sections.usage.items.improve')}</li>
              <li>{t('privacy.sections.usage.items.optimize')}</li>
              <li>{t('privacy.sections.usage.items.strategy')}</li>
              <li>{t('privacy.sections.usage.items.monitor')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.cookies.title')}</h2>
            <p>
              {t('privacy.sections.cookies.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('privacy.sections.cookies.consent')}</li>
              <li>{t('privacy.sections.cookies.analytics')}</li>
            </ul>
            <p className="mt-4">
              {t('privacy.sections.cookies.manage')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.sharing.title')}</h2>
            <p>
              <strong>{t('privacy.sections.sharing.noSale')}</strong>
            </p>
            <p>
              {t('privacy.sections.sharing.google')}{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-light hover:underline"
              >
                Privacy Policy di Google
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.rights.title')}</h2>
            <p>
              {t('privacy.sections.rights.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>{t('privacy.sections.rights.access').split(':')[0]}:</strong> {t('privacy.sections.rights.access').split(':')[1]}</li>
              <li><strong>{t('privacy.sections.rights.rectification').split(':')[0]}:</strong> {t('privacy.sections.rights.rectification').split(':')[1]}</li>
              <li><strong>{t('privacy.sections.rights.erasure').split(':')[0]}:</strong> {t('privacy.sections.rights.erasure').split(':')[1]}</li>
              <li><strong>{t('privacy.sections.rights.objection').split(':')[0]}:</strong> {t('privacy.sections.rights.objection').split(':')[1]}</li>
              <li><strong>{t('privacy.sections.rights.portability').split(':')[0]}:</strong> {t('privacy.sections.rights.portability').split(':')[1]}</li>
            </ul>
            <p className="mt-4">
              {t('privacy.sections.rights.contact')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.security.title')}</h2>
            <p>
              {t('privacy.sections.security.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t('privacy.sections.security.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.thirdParty.title')}</h2>
            <p>
              {t('privacy.sections.thirdParty.desc')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.changes.title')}</h2>
            <p>
              {t('privacy.sections.changes.desc')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy.sections.contact.title')}</h2>
            <p>
              {t('privacy.sections.contact.intro')}
            </p>
            <ul className="list-none space-y-2 ml-4 mt-4">
              <li>
                <strong>{t('privacy.sections.contact.email').split(':')[0]}:</strong>{' '}
                <a href="mailto:privacy@thejord.it" className="text-primary-light hover:underline">
                  privacy@thejord.it
                </a>
              </li>
              <li>
                <strong>{t('privacy.sections.contact.website').split(':')[0]}:</strong>{' '}
                <a href="https://thejord.it" className="text-primary-light hover:underline">
                  https://thejord.it
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      </Layout>
  )
}
