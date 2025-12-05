import Link from 'next/link'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default function About() {
  const t = useTranslations('about')
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-bg-darkest">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-text-primary">{t('mission.title')}</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-4">
            {t('mission.intro')}
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            {t('mission.believe')}
          </p>
          <ul className="list-none space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <strong className="text-text-primary">{t('mission.privacy.title')}</strong>
                <p className="text-text-secondary">{t('mission.privacy.description')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <strong className="text-text-primary">{t('mission.fast.title')}</strong>
                <p className="text-text-secondary">{t('mission.fast.description')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <strong className="text-text-primary">{t('mission.intuitive.title')}</strong>
                <p className="text-text-secondary">{t('mission.intuitive.description')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <strong className="text-text-primary">{t('mission.openSource.title')}</strong>
                <p className="text-text-secondary">{t('mission.openSource.description')}</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Tech Stack Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-text-primary">{t('techStack.title')}</h2>
          <p className="text-text-secondary mb-4 md:mb-6">
            {t('techStack.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-darkest border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold text-primary mb-2">{t('techStack.frontend')}</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>• Next.js 16 - React framework</li>
                <li>• TypeScript - Type safety</li>
                <li>• Tailwind CSS - Styling</li>
                <li>• Turbopack - Build tool</li>
              </ul>
            </div>
            <div className="bg-bg-darkest border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold text-primary mb-2">{t('techStack.infrastructure')}</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>• Docker - Containerization</li>
                <li>• Kubernetes (K3s) - Orchestration</li>
                <li>• Node.js - Backend API</li>
                <li>• PostgreSQL - Database</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-text-primary">{t('openSource.title')}</h2>
          <p className="text-text-secondary mb-4">
            {t('openSource.description')}
          </p>
          <div className="flex gap-3 md:gap-4 flex-col sm:flex-row">
            <a
              href="https://github.com/thejord-it/thejord-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg-darkest px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              {t('openSource.viewOnGithub')}
            </a>
            <a
              href="https://github.com/thejord-it/thejord-web/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('openSource.reportBug')}
            </a>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-text-primary">
            {locale === 'it' ? '🗺️ Roadmap' : '🗺️ Roadmap'}
          </h2>
          <p className="text-text-secondary mb-4 md:mb-6">
            {locale === 'it'
              ? 'Stiamo costantemente migliorando THEJORD.IT. Ecco il nostro percorso e cosa abbiamo in programma:'
              : 'We are constantly improving THEJORD.IT. Here is our journey and what we have planned:'}
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <strong className="text-text-primary">
                  {locale === 'it' ? 'Fase 1: Foundation (Completata)' : 'Phase 1: Foundation (Completed)'}
                </strong>
                <p className="text-text-secondary">
                  {locale === 'it'
                    ? '9 strumenti essenziali, deployment Docker/K3s, SEO e security headers'
                    : '9 essential tools, Docker/K3s deployment, SEO and security headers'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <strong className="text-text-primary">
                  {locale === 'it' ? 'Fase 2: Testing & CI/CD (Completata)' : 'Phase 2: Testing & CI/CD (Completed)'}
                </strong>
                <p className="text-text-secondary">
                  {locale === 'it'
                    ? '118+ test (unit + E2E), GitHub Actions automatizzato, Playwright'
                    : '118+ tests (unit + E2E), automated GitHub Actions, Playwright'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <strong className="text-text-primary">
                  {locale === 'it' ? 'Fase 3: Next.js Migration (Completata)' : 'Phase 3: Next.js Migration (Completed)'}
                </strong>
                <p className="text-text-secondary">
                  {locale === 'it'
                    ? 'SSR/SSG con Next.js 16, Turbopack, migliore indicizzazione SEO'
                    : 'SSR/SSG with Next.js 16, Turbopack, improved SEO indexing'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <strong className="text-text-primary">
                  {locale === 'it' ? 'Fase 4: Blog & Backend (Completata)' : 'Phase 4: Blog & Backend (Completed)'}
                </strong>
                <p className="text-text-secondary">
                  {locale === 'it'
                    ? 'CMS blog multilingue, API REST, PostgreSQL, sistema di traduzione'
                    : 'Multilingual blog CMS, REST API, PostgreSQL, translation system'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <strong className="text-text-primary">
                  {locale === 'it' ? 'Fase 5: PDF Tools & Advanced (Completata)' : 'Phase 5: PDF Tools & Advanced (Completed)'}
                </strong>
                <p className="text-text-secondary">
                  {locale === 'it'
                    ? 'Suite PDF completa (merge, split, edit, convert, compress), XML/WSDL Viewer, ambiente staging'
                    : 'Complete PDF suite (merge, split, edit, convert, compress), XML/WSDL Viewer, staging environment'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">🔄</span>
              <div>
                <strong className="text-text-primary">
                  {locale === 'it' ? 'Fase 6: Marketing & Outreach (In corso)' : 'Phase 6: Marketing & Outreach (In Progress)'}
                </strong>
                <p className="text-text-secondary">
                  {locale === 'it'
                    ? 'Feed RSS, pubblicazione articoli, backlink building, presenza su directory'
                    : 'RSS feeds, article publishing, backlink building, directory presence'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 text-xl">📋</span>
              <div>
                <strong className="text-text-primary">
                  {locale === 'it' ? 'Fase 7: Community & Scale (Pianificata)' : 'Phase 7: Community & Scale (Planned)'}
                </strong>
                <p className="text-text-secondary">
                  {locale === 'it'
                    ? '20+ tool totali, API pubblica, contributi community, documentazione estesa'
                    : '20+ total tools, public API, community contributions, extended documentation'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-text-primary">{t('privacy.title')}</h2>
          <p className="text-text-secondary mb-4">
            {t('privacy.description')}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('privacy.clientSide.title')}</strong>
                <p className="text-text-secondary">{t('privacy.clientSide.description')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('privacy.noAccount.title')}</strong>
                <p className="text-text-secondary">{t('privacy.noAccount.description')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('privacy.securityHeaders.title')}</strong>
                <p className="text-text-secondary">{t('privacy.securityHeaders.description')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('privacy.auditable.title')}</strong>
                <p className="text-text-secondary">{t('privacy.auditable.description')}</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-4 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-text-primary">{t('contact.title')}</h2>
          <p className="text-text-secondary mb-4 md:mb-6">
            {t('contact.description')}
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-col sm:flex-row">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg-darkest px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('contact.contactUs')}
            </Link>
            <a
              href="https://github.com/thejord-it/thejord-web/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-dark border border-border hover:border-primary text-text-primary px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('contact.openIssue')}
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
