import { useTranslation } from 'react-i18next'
import Layout from '@/components/tools/Layout'
import SEO from '@/components/tools/SEO'

export default function Changelog() {
  const { t, i18n } = useTranslation()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const locale = i18n.language === 'it' ? 'it-IT' : 'en-US'
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <Layout currentPage="about">
      <SEO
        title="Changelog - THEJORD.IT"
        description="All important changes and updates to THEJORD.IT. Track new features, improvements, and bug fixes."
        path="/changelog"
      />
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              {t('changelog.title')}
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {t('changelog.subtitle')}
          </p>
        </div>

        {/* Version 1.1.0 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v1.1.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-01-12')}</span>
          </div>

          <div className="bg-bg-surface rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              {t('changelog.sections.additions')}
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Layout Component Riutilizzabile</strong>
                  <p className="text-sm mt-1">Tutte le pagine dei tool ora usano un layout consistente con logo cliccabile che rimanda alla homepage</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Sistema Toast Notifications</strong>
                  <p className="text-sm mt-1">Notifiche moderne con animazioni al posto degli alert del browser</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Base64 - Operazioni su File</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Upload file fino a 5MB</li>
                    <li>• Download con estensione corretta automatica</li>
                    <li>• Rilevamento di 50+ tipi di file (immagini, PDF, archivi, audio, video)</li>
                    <li>• Distinzione automatica file binari/testuali</li>
                    <li>• Badge con livello di confidenza del rilevamento</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">JSON Formatter - Single Quotes</strong>
                  <p className="text-sm mt-1">Opzione per convertire virgolette doppie in singole</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Guida Utente Completa</strong>
                  <p className="text-sm mt-1">Documentazione dettagliata per tutti i tool in <code className="bg-bg-dark px-2 py-1 rounded">docs/USER-GUIDE.md</code></p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Pagina Changelog</strong>
                  <p className="text-sm mt-1">Storico versioni accessibile dal sito web</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-bg-surface rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              {t('changelog.sections.changes')}
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Hash Generator</strong>
                  <p className="text-sm mt-1">Alert sostituiti con toast notifications</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Base64 Tool</strong>
                  <p className="text-sm mt-1">UI migliorata con badge e icone per i tipi di file</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Tutte le Pagine Tool</strong>
                  <p className="text-sm mt-1">Migrate al nuovo Layout component per consistenza</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Navigazione</strong>
                  <p className="text-sm mt-1">Logo cliccabile su tutte le pagine</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Documentazione</strong>
                  <p className="text-sm mt-1">README.md aggiornato con nuove funzionalità</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2">
              {t('changelog.sections.tech')}
            </h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>• Nuovo componente: <code className="bg-bg-dark px-2 py-1 rounded">Layout.tsx</code></li>
              <li>• Nuovo componente: <code className="bg-bg-dark px-2 py-1 rounded">Toast.tsx</code></li>
              <li>• Nuova libreria: <code className="bg-bg-dark px-2 py-1 rounded">file-detection.ts</code> (rilevamento via magic bytes)</li>
              <li>• Animazioni CSS slide-in per toast</li>
              <li>• Gestione migliorata upload file (binario vs testo)</li>
              <li>• Decodifica Base64 con supporto data URL prefix</li>
            </ul>
          </div>
        </div>

        {/* Version 1.0.0 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-secondary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v1.0.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-01-12')}</span>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
              🚀 Initial Release
            </span>
          </div>

          <div className="bg-bg-surface rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              <span>✨</span> Release Iniziale
            </h3>
            <div className="space-y-4 text-text-secondary">
              <div>
                <h4 className="font-bold text-text-primary mb-2">9 Strumenti per Sviluppatori:</h4>
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
                <h4 className="font-bold text-text-primary mb-2">Pagine Sito:</h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• Homepage con griglia tool</li>
                  <li>• About (missione, tech stack, roadmap)</li>
                  <li>• Contact (form, FAQ)</li>
                  <li>• Sistema Blog</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-text-primary mb-2">Infrastruttura:</h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• React 18.2.0 + TypeScript 5.2.2</li>
                  <li>• Vite 4.5.0 + Tailwind CSS 3.3.5</li>
                  <li>• Docker + Kubernetes (K3s)</li>
                  <li>• Cloudflare Tunnel + Nginx</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-text-primary mb-2">Sicurezza & Privacy:</h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• 100% client-side (zero tracking)</li>
                  <li>• CSP, HSTS, Permissions-Policy</li>
                  <li>• Cross-Origin policies</li>
                  <li>• Nessun cookie di tracciamento</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-text-primary mb-2">SEO & Performance:</h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• Meta tags + Open Graph + Schema.org</li>
                  <li>• Sitemap.xml + robots.txt</li>
                  <li>• Bundle: 448KB JS (131KB gzipped)</li>
                  <li>• Code splitting + tree shaking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-bg-surface rounded-xl border border-border p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-text-primary">📊 Riepilogo Versioni</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-text-secondary">
              <thead className="border-b border-border">
                <tr>
                  <th className="py-3 px-4">Versione</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Descrizione</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-primary px-3 py-1 rounded text-white font-semibold">v1.1.0</span>
                  </td>
                  <td className="py-3 px-4">12 Gen 2025</td>
                  <td className="py-3 px-4">UI enhancements, Base64 file ops, toast notifications</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v1.0.0</span>
                  </td>
                  <td className="py-3 px-4">12 Gen 2025</td>
                  <td className="py-3 px-4">🚀 Release iniziale con 9 tool</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-4 text-text-primary">🔗 Collegamenti Utili</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://github.com/thejord-it/thejord-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-dark border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Repository
            </a>
            <a
              href="https://github.com/thejord-it/thejord-tools/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-dark border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              🐛 Issues
            </a>
            <a
              href="https://github.com/thejord-it/thejord-tools/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-dark border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              💬 Discussions
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}
