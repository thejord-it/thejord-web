import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'changelog' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function Changelog() {
  const t = useTranslations('changelog')
  const locale = useLocale()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const intro = locale === 'it'
    ? 'Questo changelog traccia ogni aggiornamento di THEJORD: nuovi strumenti, miglioramenti e correzioni, in ordine cronologico. Segui questa pagina per sapere cosa è cambiato e quando, con una riga di sintesi per ogni rilascio.'
    : 'This changelog tracks every THEJORD update: new tools, improvements and fixes, in chronological order. Follow this page to see what changed and when, with a one-line summary for each release.'

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title'),
    description: t('description'),
    url: `https://thejord.it/${locale}/changelog`,
    inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'THEJORD', url: 'https://thejord.it' },
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            {intro}
          </p>
        </div>

        {/* Version 2.4.0 - Homepage Video & RSS */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v2.4.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-12-25')}</span>
            <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
              {locale === 'it' ? 'Miglioramenti' : 'Improvements'}
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ {locale === 'it' ? 'Nuove Funzionalità' : 'New Features'}
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Video Promozionale' : 'Promotional Video'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Video di presentazione THEJORD integrato nella homepage con lazy loading per performance ottimali.'
                      : 'THEJORD presentation video integrated in homepage with lazy loading for optimal performance.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">RSS Feed</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Feed RSS del blog ora facilmente accessibile dal footer. Disponibile in italiano e inglese.'
                      : 'Blog RSS feed now easily accessible from footer. Available in Italian and English.'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Version 2.3.0 - PDF Tools */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v2.3.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-12-05')}</span>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
              {locale === 'it' ? 'Nuovo Tool' : 'New Tool'}
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ PDF Tools Suite
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Suite Completa PDF' : 'Complete PDF Suite'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• {locale === 'it' ? 'Unisci più PDF in un unico documento' : 'Merge multiple PDFs into one document'}</li>
                    <li>• {locale === 'it' ? 'Dividi PDF per pagine o intervalli' : 'Split PDF by pages or ranges'}</li>
                    <li>• {locale === 'it' ? 'Modifica: ruota, elimina, riordina pagine' : 'Edit: rotate, delete, reorder pages'}</li>
                    <li>• {locale === 'it' ? 'Converti: Images ↔ PDF' : 'Convert: Images ↔ PDF'}</li>
                    <li>• {locale === 'it' ? 'Comprimi PDF riducendo dimensioni' : 'Compress PDF reducing file size'}</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Privacy Totale' : 'Total Privacy'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Tutta l\'elaborazione avviene nel browser. I tuoi PDF non vengono mai caricati su server esterni.'
                      : 'All processing happens in the browser. Your PDFs are never uploaded to external servers.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Navigazione Dedicata' : 'Dedicated Navigation'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Separazione Dev Tools e PDF Tools nel menu per un\'esperienza utente migliorata'
                      : 'Separation of Dev Tools and PDF Tools in menu for improved user experience'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Version 2.2.0 - XML & WSDL Viewer */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v2.2.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-12-03')}</span>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
              {locale === 'it' ? 'Nuovo Tool' : 'New Tool'}
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ XML & WSDL Viewer
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Funzionalità Principali' : 'Main Features'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• XML Formatter & Prettifier</li>
                    <li>• XML Validator {locale === 'it' ? 'in tempo reale' : 'in real-time'}</li>
                    <li>• WSDL Parser & Viewer</li>
                    <li>• XML ↔ JSON Converter</li>
                    <li>• XML Minifier</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Statistiche XML' : 'XML Statistics'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Conteggio elementi, attributi, nodi testo, profondità e dimensione in bytes'
                      : 'Element count, attributes, text nodes, depth and size in bytes'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Test Completi' : 'Complete Tests'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• 19 unit tests {locale === 'it' ? 'con' : 'with'} Jest</li>
                    <li>• 17 E2E tests {locale === 'it' ? 'con' : 'with'} Playwright</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Version 2.1.0 - Kubernetes Deployment */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v2.1.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-12-01')}</span>
            <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
              {locale === 'it' ? 'Produzione' : 'Production'}
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ {locale === 'it' ? 'Deploy Kubernetes e Miglioramenti' : 'Kubernetes Deploy & Improvements'}
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Infrastruttura Kubernetes' : 'Kubernetes Infrastructure'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• {locale === 'it' ? 'Deploy su cluster K3s con 2 repliche' : 'Deploy on K3s cluster with 2 replicas'}</li>
                    <li>• {locale === 'it' ? 'Cloudflare Tunnel per ingress sicuro' : 'Cloudflare Tunnel for secure ingress'}</li>
                    <li>• {locale === 'it' ? 'PostgreSQL in container Docker dedicato' : 'PostgreSQL in dedicated Docker container'}</li>
                    <li>• CI/CD {locale === 'it' ? 'con GitHub Actions e self-hosted runner' : 'with GitHub Actions and self-hosted runner'}</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'API Proxy Pattern' : 'API Proxy Pattern'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Backend API interno non esposto pubblicamente. Tutte le chiamate passano attraverso Next.js API routes per maggiore sicurezza.'
                      : 'Internal backend API not publicly exposed. All calls go through Next.js API routes for enhanced security.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Blog Multilingue Completo' : 'Complete Multilingual Blog'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• 6 {locale === 'it' ? 'articoli in italiano' : 'articles in Italian'}</li>
                    <li>• 6 {locale === 'it' ? 'articoli in inglese' : 'articles in English'}</li>
                    <li>• {locale === 'it' ? 'Sistema di traduzione collegato tra lingue' : 'Translation system linked between languages'}</li>
                    <li>• {locale === 'it' ? 'Icone per ogni articolo' : 'Icons for each article'}</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Google Analytics & SEO</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Google Analytics 4 {locale === 'it' ? 'integrato' : 'integrated'}</li>
                    <li>• Sitemap.xml {locale === 'it' ? 'dinamica con tutti i blog post' : 'dynamic with all blog posts'}</li>
                    <li>• Robots.txt {locale === 'it' ? 'ottimizzato' : 'optimized'}</li>
                    <li>• hreflang {locale === 'it' ? 'per SEO multilingue' : 'for multilingual SEO'}</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Version 2.0.0 - Next.js Migration */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v2.0.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-11-18')}</span>
            <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
              {t('majorUpdate')}
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ {locale === 'it' ? 'Migrazione a Next.js 16' : 'Migration to Next.js 16'}
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Next.js 16 {locale === 'it' ? 'con' : 'with'} Turbopack</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Migrazione completa da Vite + React a Next.js 16 con App Router e Turbopack per build ultra-veloci'
                      : 'Complete migration from Vite + React to Next.js 16 with App Router and Turbopack for ultra-fast builds'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Integrazione Blog + Tools' : 'Blog + Tools Integration'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'CMS per blog e tools developer unificati in una singola applicazione Next.js'
                      : 'CMS for blog and developer tools unified in a single Next.js application'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? '12 Tools Migrati' : '12 Tools Migrated'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• JSON Formatter & Validator</li>
                    <li>• Base64 Encoder/Decoder</li>
                    <li>• RegEx Tester</li>
                    <li>• Hash Generator (MD5, SHA-1, SHA-256, SHA-512)</li>
                    <li>• URL Encoder/Decoder</li>
                    <li>• Markdown Converter</li>
                    <li>• Color Converter (HEX/RGB/HSL)</li>
                    <li>• Lorem Ipsum Generator</li>
                    <li>• Diff Checker</li>
                    <li>• Cron Expression Builder</li>
                    <li>• JSON Schema Converter</li>
                    <li>• XML & WSDL Viewer</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Testing Completo' : 'Complete Testing'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• 137 unit tests {locale === 'it' ? 'con' : 'with'} Jest</li>
                    <li>• 31 E2E tests {locale === 'it' ? 'con' : 'with'} Playwright</li>
                    <li>• Test coverage {locale === 'it' ? 'per tutti i tool principali' : 'for all main tools'}</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Header & Footer {locale === 'it' ? 'Globali' : 'Global'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Navigazione unificata con Header sticky e Footer informativo su tutte le pagine'
                      : 'Unified navigation with sticky Header and informative Footer on all pages'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'Pagine About, Contact, Privacy' : 'About, Contact, Privacy Pages'}</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it'
                      ? 'Migrazione e adattamento delle pagine istituzionali da React SPA a Next.js'
                      : 'Migration and adaptation of institutional pages from React SPA to Next.js'}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              🔧 {t('technicalImprovements')}
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">{locale === 'it' ? 'SEO Ottimizzato' : 'Optimized SEO'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Sitemap.xml {locale === 'it' ? 'dinamico per tools e blog' : 'dynamic for tools and blog'}</li>
                    <li>• Robots.txt {locale === 'it' ? 'configurato' : 'configured'}</li>
                    <li>• Meta tags {locale === 'it' ? 'con template' : 'with template'}</li>
                    <li>• Schema.org JSON-LD</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Performance</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Server-side rendering (SSR)</li>
                    <li>• Lazy loading {locale === 'it' ? 'per componenti pesanti' : 'for heavy components'} (Monaco Editor)</li>
                    <li>• Image optimization {locale === 'it' ? 'con' : 'with'} next/image</li>
                    <li>• Code splitting {locale === 'it' ? 'automatico' : 'automatic'}</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Developer Experience</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Turbopack {locale === 'it' ? 'per HMR istantaneo' : 'for instant HMR'}</li>
                    <li>• TypeScript strict mode</li>
                    <li>• ESLint + Prettier</li>
                    <li>• Test suite {locale === 'it' ? 'completa' : 'complete'}</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2">
              💻 {t('techStack')}
            </h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>• <strong>Framework:</strong> Next.js 16.0.3 (App Router + Turbopack)</li>
              <li>• <strong>UI:</strong> React 19 + TypeScript 5</li>
              <li>• <strong>Styling:</strong> Tailwind CSS 3.4</li>
              <li>• <strong>Testing:</strong> Jest + Playwright + Testing Library</li>
              <li>• <strong>CMS:</strong> Custom REST API (Node.js + PostgreSQL)</li>
              <li>• <strong>Database:</strong> PostgreSQL {locale === 'it' ? 'per blog posts' : 'for blog posts'}</li>
              <li>• <strong>Infrastructure:</strong> Docker + Kubernetes (K3s)</li>
            </ul>
          </div>
        </div>

        {/* Version 1.1.0 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v1.1.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2024-11-15')}</span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ {t('newFeatures')}
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Base64 - {locale === 'it' ? 'Operazioni su File' : 'File Operations'}</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Upload file {locale === 'it' ? 'fino a' : 'up to'} 5MB</li>
                    <li>• Download {locale === 'it' ? 'con estensione corretta automatica' : 'with automatic correct extension'}</li>
                    <li>• {locale === 'it' ? 'Rilevamento di 50+ tipi di file' : 'Detection of 50+ file types'}</li>
                    <li>• {locale === 'it' ? 'Distinzione automatica file binari/testuali' : 'Automatic binary/text file distinction'}</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Toast Notifications</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it' ? 'Sistema di notifiche moderne con animazioni' : 'Modern notification system with animations'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Layout Component</strong>
                  <p className="text-sm mt-1">
                    {locale === 'it' ? 'Layout riutilizzabile per tutte le pagine tool' : 'Reusable layout for all tool pages'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Version 1.0.0 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v1.0.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2024-11-12')}</span>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
              🚀 {t('initialRelease')}
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              <span>✨</span> {t('initialRelease')}
            </h3>
            <div className="space-y-4 text-text-secondary">
              <div>
                <h4 className="font-bold text-text-primary mb-2">
                  {locale === 'it' ? '9 Strumenti per Sviluppatori:' : '9 Developer Tools:'}
                </h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>📄 JSON Formatter & Validator</li>
                  <li>🔐 Base64 Encoder/Decoder</li>
                  <li>🔍 RegEx Tester</li>
                  <li>🔑 Hash Generator</li>
                  <li>🔗 URL Encoder/Decoder</li>
                  <li>📝 Markdown to HTML</li>
                  <li>🎨 Color Converter</li>
                  <li>📰 Lorem Ipsum Generator</li>
                  <li>📊 Text Diff Checker</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-text-primary mb-2">
                  {locale === 'it' ? 'Infrastruttura:' : 'Infrastructure:'}
                </h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• React 18.2.0 + TypeScript 5.2.2</li>
                  <li>• Vite 4.5.0 + Tailwind CSS 3.3.5</li>
                  <li>• Docker + Kubernetes (K3s)</li>
                  <li>• 100% client-side processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-bg-dark rounded-xl border border-border p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-text-primary">📊 {t('versionSummary')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-text-secondary">
              <thead className="border-b border-border">
                <tr>
                  <th className="py-3 px-4">{t('version')}</th>
                  <th className="py-3 px-4">{t('date')}</th>
                  <th className="py-3 px-4">{t('descriptionCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-primary px-3 py-1 rounded text-white font-semibold">v2.4.0</span>
                  </td>
                  <td className="py-3 px-4">25 {locale === 'it' ? 'Dic' : 'Dec'} 2025</td>
                  <td className="py-3 px-4">
                    ✨ {locale === 'it'
                      ? 'Video promozionale homepage, RSS Feed nel footer'
                      : 'Homepage promotional video, RSS Feed in footer'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v2.3.0</span>
                  </td>
                  <td className="py-3 px-4">5 {locale === 'it' ? 'Dic' : 'Dec'} 2025</td>
                  <td className="py-3 px-4">
                    ✨ {locale === 'it'
                      ? 'PDF Tools Suite: merge, split, edit, convert, compress'
                      : 'PDF Tools Suite: merge, split, edit, convert, compress'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v2.2.0</span>
                  </td>
                  <td className="py-3 px-4">3 {locale === 'it' ? 'Dic' : 'Dec'} 2025</td>
                  <td className="py-3 px-4">
                    ✨ {locale === 'it'
                      ? 'XML & WSDL Viewer: formatter, validator, WSDL parser, JSON converter'
                      : 'XML & WSDL Viewer: formatter, validator, WSDL parser, JSON converter'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v2.1.0</span>
                  </td>
                  <td className="py-3 px-4">1 {locale === 'it' ? 'Dic' : 'Dec'} 2025</td>
                  <td className="py-3 px-4">
                    🚀 {locale === 'it'
                      ? 'Deploy Kubernetes, API Proxy, Blog multilingue, Google Analytics'
                      : 'Kubernetes deploy, API Proxy, Multilingual blog, Google Analytics'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v2.0.0</span>
                  </td>
                  <td className="py-3 px-4">18 {locale === 'it' ? 'Nov' : 'Nov'} 2025</td>
                  <td className="py-3 px-4">
                    {locale === 'it'
                      ? 'Migrazione a Next.js 16, Blog + Tools integrati, 137 unit tests'
                      : 'Migration to Next.js 16, Blog + Tools integrated, 137 unit tests'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v1.1.0</span>
                  </td>
                  <td className="py-3 px-4">15 {locale === 'it' ? 'Nov' : 'Nov'} 2024</td>
                  <td className="py-3 px-4">UI enhancements, Base64 file ops, toast notifications</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v1.0.0</span>
                  </td>
                  <td className="py-3 px-4">12 {locale === 'it' ? 'Nov' : 'Nov'} 2024</td>
                  <td className="py-3 px-4">🚀 {locale === 'it' ? 'Release iniziale con 9 tool' : 'Initial release with 9 tools'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-4 text-text-primary">🔗 {t('usefulLinks')}</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://github.com/thejord-it/thejord-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              {t('repository')}
            </a>
            <a
              href="https://github.com/thejord-it/thejord-web/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              🐛 {t('issues')}
            </a>
            <a
              href="https://github.com/thejord-it/thejord-web/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              💬 {t('discussions')}
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
