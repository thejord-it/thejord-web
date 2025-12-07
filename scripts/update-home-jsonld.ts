#!/usr/bin/env tsx
/**
 * Update home page with JSON-LD schemas
 */

import * as fs from 'fs'
import * as path from 'path'

const homePageContent = `import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

// JSON-LD schemas for the home page
function getJsonLdSchemas(locale: string) {
  const baseUrl = 'https://thejord.it'

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'THEJORD',
    alternateName: 'The Jord Developer Tools',
    url: \`\${baseUrl}/\${locale}\`,
    description: locale === 'it'
      ? 'Strumenti gratuiti per sviluppatori: JSON formatter, Base64, Hash, Regex e altro.'
      : 'Free developer tools: JSON formatter, Base64, Hash, Regex and more.',
    inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'THEJORD',
    url: baseUrl,
    logo: \`\${baseUrl}/logo.png\`,
    sameAs: ['https://github.com/thejord-it'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@thejord.it',
      contactType: 'customer support',
    },
  }

  return { webSiteSchema, organizationSchema }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = useTranslations('home')
  const tTools = useTranslations('tools.list')
  const { webSiteSchema, organizationSchema } = getJsonLdSchemas(locale)

  const featuredTools = [
    { key: 'jsonFormatter', icon: '{ }', href: 'tools/json-formatter', color: 'from-blue-500 to-cyan-500' },
    { key: 'base64', icon: '⚡', href: 'tools/base64', color: 'from-purple-500 to-pink-500' },
    { key: 'regexTester', icon: '.*', href: 'tools/regex-tester', color: 'from-green-500 to-emerald-500' },
    { key: 'hashGenerator', icon: '#', href: 'tools/hash-generator', color: 'from-orange-500 to-red-500' },
    { key: 'cronBuilder', icon: '⏰', href: 'tools/cron-builder', color: 'from-indigo-500 to-purple-500' },
    { key: 'diffChecker', icon: '⚖️', href: 'tools/diff-checker', color: 'from-teal-500 to-cyan-500' }
  ]

  const stats = [
    { value: '12', labelKey: 'tools', icon: '🛠️' },
    { value: '100%', labelKey: 'privacyFirst', icon: '🔒' },
    { value: '0ms', labelKey: 'serverProcessing', icon: '⚡' },
    { value: t('stats.free'), labelKey: 'forever', icon: '💎' }
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <div className="min-h-screen bg-bg-darkest">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-darkest to-secondary/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12 md:py-20 md:py-32">
            <div className="text-center">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  {t('hero.title1')}
                </span>
                <br />
                <span className="text-text-primary">{t('hero.title2')}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto mb-8">{t('hero.description')}</p>
              <p className="text-sm text-text-muted mb-12">{t('hero.madeBy')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="tools" className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary text-bg-darkest font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50">{t('hero.exploreTools')} →</Link>
                <Link href="blog" className="px-8 py-4 border-2 border-border hover:border-primary text-text-primary font-semibold rounded-lg transition-all">{t('hero.readBlog')}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-bg-dark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl sm:text-2xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-text-muted">{t(\`stats.\${stat.labelKey}\`)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">{t('featuredTools.title')}</h2>
              <p className="text-xl text-text-secondary">{t('featuredTools.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool, index) => (
                <Link key={index} href={tool.href} className="group relative bg-bg-dark border border-border hover:border-primary rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                  <div className={\`absolute top-0 left-0 w-full h-1 bg-gradient-to-r \${tool.color} rounded-t-xl\`}></div>
                  <div className="flex items-start gap-4">
                    <div className={\`text-4xl flex-shrink-0 bg-gradient-to-br \${tool.color} bg-clip-text text-transparent font-bold\`}>{tool.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors mb-2">{tTools(\`\${tool.key}.name\`)}</h3>
                      <p className="text-text-secondary text-sm">{tTools(\`\${tool.key}.description\`)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{t('featuredTools.tryNow')} →</div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="tools" className="inline-flex items-center text-primary hover:text-primary-light font-semibold transition-colors">{t('featuredTools.viewAll')} →</Link>
            </div>
          </div>
        </section>

        {/* PDF Tools Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-red-500/5 to-orange-500/5 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">PDF</div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">{t('pdfTools.title')}</h2>
                <p className="text-lg text-text-secondary mb-6">{t('pdfTools.description')}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  <span className="px-3 py-1 bg-bg-dark border border-border rounded-full text-sm text-text-secondary">{t('pdfTools.features.merge')}</span>
                  <span className="px-3 py-1 bg-bg-dark border border-border rounded-full text-sm text-text-secondary">{t('pdfTools.features.split')}</span>
                  <span className="px-3 py-1 bg-bg-dark border border-border rounded-full text-sm text-text-secondary">{t('pdfTools.features.edit')}</span>
                  <span className="px-3 py-1 bg-bg-dark border border-border rounded-full text-sm text-text-secondary">{t('pdfTools.features.convert')}</span>
                  <span className="px-3 py-1 bg-bg-dark border border-border rounded-full text-sm text-text-secondary">{t('pdfTools.features.compress')}</span>
                </div>
                <Link href="pdf-tools" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">{t('pdfTools.cta')} →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 bg-bg-dark/30" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-3xl md:text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{t('features.privacy.title')}</h3>
                <p className="text-text-secondary">{t('features.privacy.description')}</p>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl md:text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{t('features.fast.title')}</h3>
                <p className="text-text-secondary">{t('features.fast.description')}</p>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl md:text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{t('features.focused.title')}</h3>
                <p className="text-text-secondary">{t('features.focused.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog CTA Section */}
        <section className="py-12 md:py-20" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">{t('blog.title')}</h2>
            <p className="text-xl text-text-secondary mb-8">{t('blog.description')}</p>
            <Link href="blog" className="inline-flex px-8 py-4 bg-bg-dark border border-border hover:border-primary text-text-primary font-semibold rounded-lg transition-all">{t('blog.readLatest')} →</Link>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-12 md:py-20 border-t border-border bg-bg-dark/50" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 200px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xl md:text-3xl font-bold text-text-primary mb-4">{t('techStack.title')}</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 text-text-muted">
              <div className="flex items-center gap-2"><span className="text-2xl">⚛️</span><span className="font-semibold">React 19</span></div>
              <div className="flex items-center gap-2"><span className="text-2xl">▲</span><span className="font-semibold">Next.js 16</span></div>
              <div className="flex items-center gap-2"><span className="text-2xl">📘</span><span className="font-semibold">TypeScript</span></div>
              <div className="flex items-center gap-2"><span className="text-2xl">🎨</span><span className="font-semibold">Tailwind CSS</span></div>
              <div className="flex items-center gap-2"><span className="text-2xl">⚡</span><span className="font-semibold">Turbopack</span></div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
`

const targetPath = path.resolve(process.cwd(), 'app/[locale]/page.tsx')
fs.writeFileSync(targetPath, homePageContent)
console.log('✅ Home page updated with JSON-LD schemas')
