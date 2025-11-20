import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '@/components/tools/Layout'
import SEO from '@/components/tools/SEO'

export default function About() {
  const { t } = useTranslation()

  return (
    <Layout currentPage="about">
      <SEO
        title="About THEJORD.IT - Developer Tools Platform"
        description="Learn about THEJORD.IT: the Italian alternative to IT-Tools. Our mission, tech stack, roadmap, and commitment to privacy and open source."
        path="/about"
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              {t('about.title')}
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <section className="bg-bg-surface border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">{t('about.mission.title')}</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-4">
            {t('about.mission.intro')}
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            {t('about.mission.belief')}
          </p>
          <ul className="list-none space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <strong className="text-text-primary">{t('about.mission.privacy.title')}</strong>
                <p className="text-text-secondary">{t('about.mission.privacy.desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <strong className="text-text-primary">{t('about.mission.fast.title')}</strong>
                <p className="text-text-secondary">{t('about.mission.fast.desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <strong className="text-text-primary">{t('about.mission.intuitive.title')}</strong>
                <p className="text-text-secondary">{t('about.mission.intuitive.desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <strong className="text-text-primary">{t('about.mission.opensource.title')}</strong>
                <p className="text-text-secondary">{t('about.mission.opensource.desc')}</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Tech Stack Section */}
        <section className="bg-bg-surface border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">{t('about.techStack.title')}</h2>
          <p className="text-text-secondary mb-6">
            {t('about.techStack.intro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-dark border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold text-primary-light mb-2">{t('about.techStack.frontend')}</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>• React 18.2.0 - UI library</li>
                <li>• TypeScript 5.2.2 - Type safety</li>
                <li>• Vite 4.5.0 - Build tool</li>
                <li>• Tailwind CSS 3.3.5 - Styling</li>
              </ul>
            </div>
            <div className="bg-bg-dark border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold text-primary-light mb-2">{t('about.techStack.infrastructure')}</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>• Docker - Containerization</li>
                <li>• Kubernetes (K3s) - Orchestration</li>
                <li>• Nginx - Web server</li>
                <li>• Cloudflare Tunnel - Secure ingress</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="bg-bg-surface border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">{t('about.openSource.title')}</h2>
          <p className="text-text-secondary mb-4">
            {t('about.openSource.intro')}
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="https://github.com/thejord-it/thejord-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              {t('about.openSource.viewGitHub')}
            </a>
            <a
              href="https://github.com/thejord-it/thejord-tools/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-dark border border-border hover:border-primary text-text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('about.openSource.reportBug')}
            </a>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="bg-bg-surface border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">{t('about.roadmap.title')}</h2>
          <p className="text-text-secondary mb-6">
            {t('about.roadmap.intro')}
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <strong className="text-text-primary">{t('about.roadmap.phase1.title')}</strong>
                <p className="text-text-secondary">{t('about.roadmap.phase1.desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <strong className="text-text-primary">{t('about.roadmap.phase2.title')}</strong>
                <p className="text-text-secondary">{t('about.roadmap.phase2.desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">📋</span>
              <div>
                <strong className="text-text-primary">{t('about.roadmap.phase3.title')}</strong>
                <p className="text-text-secondary">{t('about.roadmap.phase3.desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">📋</span>
              <div>
                <strong className="text-text-primary">{t('about.roadmap.phase4.title')}</strong>
                <p className="text-text-secondary">{t('about.roadmap.phase4.desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">📋</span>
              <div>
                <strong className="text-text-primary">{t('about.roadmap.phase5.title')}</strong>
                <p className="text-text-secondary">{t('about.roadmap.phase5.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="bg-bg-surface border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">{t('about.privacySecurity.title')}</h2>
          <p className="text-text-secondary mb-4">
            {t('about.privacySecurity.intro')}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('about.privacySecurity.clientSide.title')}</strong>
                <p className="text-text-secondary">{t('about.privacySecurity.clientSide.desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">ℹ️</span>
              <div>
                <strong className="text-text-primary">{t('about.privacySecurity.analytics.title')}</strong>
                <p className="text-text-secondary">{t('about.privacySecurity.analytics.desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('about.privacySecurity.noAccount.title')}</strong>
                <p className="text-text-secondary">{t('about.privacySecurity.noAccount.desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('about.privacySecurity.securityHeaders.title')}</strong>
                <p className="text-text-secondary">{t('about.privacySecurity.securityHeaders.desc')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">{t('about.privacySecurity.auditable.title')}</strong>
                <p className="text-text-secondary">{t('about.privacySecurity.auditable.desc')}</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">{t('about.contactCta.title')}</h2>
          <p className="text-text-secondary mb-6">
            {t('about.contactCta.desc')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('about.contactCta.contact')}
            </Link>
            <a
              href="https://github.com/thejord-it/thejord-tools/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-dark border border-border hover:border-primary text-text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('about.contactCta.openIssue')}
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      </Layout>
  )
}
