import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'All important changes and updates to THEJORD.IT. Track new features, improvements, and bug fixes.',
}

export default function Changelog() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Changelog
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            All important changes and updates to THEJORD.IT
          </p>
        </div>

        {/* Version 2.0.0 - Next.js Migration */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-lg">v2.0.0</span>
            </div>
            <span className="text-text-muted">{formatDate('2025-01-20')}</span>
            <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
              🚀 Major Update
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ Migrazione a Next.js 16
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Next.js 16 con Turbopack</strong>
                  <p className="text-sm mt-1">Migrazione completa da Vite + React a Next.js 16 con App Router e Turbopack per build ultra-veloci</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Integrazione Blog + Tools</strong>
                  <p className="text-sm mt-1">CMS per blog e tools developer unificati in una singola applicazione Next.js</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">11 Tools Migrati</strong>
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
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Testing Completo</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• 118 unit tests con Jest</li>
                    <li>• 14 E2E tests con Playwright</li>
                    <li>• Test coverage per tutti i tool principali</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Header & Footer Globali</strong>
                  <p className="text-sm mt-1">Navigazione unificata con Header sticky e Footer informativo su tutte le pagine</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Pagine About, Contact, Privacy</strong>
                  <p className="text-sm mt-1">Migrazione e adattamento delle pagine istituzionali da React SPA a Next.js</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              🔧 Miglioramenti Tecnici
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">SEO Ottimizzato</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Sitemap.xml dinamico per tools e blog</li>
                    <li>• Robots.txt configurato</li>
                    <li>• Meta tags con template</li>
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
                    <li>• Lazy loading per componenti pesanti (Monaco Editor)</li>
                    <li>• Image optimization con next/image</li>
                    <li>• Code splitting automatico</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Developer Experience</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Turbopack per HMR istantaneo</li>
                    <li>• TypeScript strict mode</li>
                    <li>• ESLint + Prettier</li>
                    <li>• Test suite completa</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2">
              💻 Stack Tecnologico
            </h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>• <strong>Framework:</strong> Next.js 16.0.3 (App Router + Turbopack)</li>
              <li>• <strong>UI:</strong> React 19 + TypeScript 5</li>
              <li>• <strong>Styling:</strong> Tailwind CSS 3.4</li>
              <li>• <strong>Testing:</strong> Jest + Playwright + Testing Library</li>
              <li>• <strong>CMS:</strong> Custom REST API (Node.js + PostgreSQL)</li>
              <li>• <strong>Database:</strong> PostgreSQL per blog posts</li>
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
            <span className="text-text-muted">{formatDate('2025-01-12')}</span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
              ✨ Nuove Funzionalità
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Base64 - Operazioni su File</strong>
                  <ul className="text-sm mt-1 space-y-1 ml-4">
                    <li>• Upload file fino a 5MB</li>
                    <li>• Download con estensione corretta automatica</li>
                    <li>• Rilevamento di 50+ tipi di file</li>
                    <li>• Distinzione automatica file binari/testuali</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Toast Notifications</strong>
                  <p className="text-sm mt-1">Sistema di notifiche moderne con animazioni</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">●</span>
                <div>
                  <strong className="text-text-primary">Layout Component</strong>
                  <p className="text-sm mt-1">Layout riutilizzabile per tutte le pagine tool</p>
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
            <span className="text-text-muted">{formatDate('2025-01-12')}</span>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
              🚀 Initial Release
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border p-6 mb-6">
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
                <h4 className="font-bold text-text-primary mb-2">Infrastruttura:</h4>
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
                    <span className="bg-primary px-3 py-1 rounded text-white font-semibold">v2.0.0</span>
                  </td>
                  <td className="py-3 px-4">20 Gen 2025</td>
                  <td className="py-3 px-4">🚀 Migrazione a Next.js 16, Blog + Tools integrati, 118 unit tests</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="bg-secondary px-3 py-1 rounded text-white font-semibold">v1.1.0</span>
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
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
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
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              🐛 Issues
            </a>
            <a
              href="https://github.com/thejord-it/thejord-tools/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              💬 Discussions
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
