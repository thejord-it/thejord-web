import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about THEJORD.IT: the Italian developer tools platform. Our mission, tech stack, roadmap, and commitment to privacy and open source.',
}

export default function About() {
  return (
    <div className="min-h-screen bg-bg-darkest">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About THEJORD
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            The Italian alternative to IT-Tools. Free, fast, and privacy-focused developer tools.
          </p>
        </div>

        {/* Mission Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">Our Mission</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-4">
            THEJORD.IT è nato con l'obiettivo di offrire una piattaforma italiana di strumenti per sviluppatori,
            completamente gratuita e rispettosa della privacy.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            Crediamo che gli strumenti di sviluppo debbano essere:
          </p>
          <ul className="list-none space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <strong className="text-text-primary">Privacy-First</strong>
                <p className="text-text-secondary">Tutti i tool funzionano 100% client-side. I tuoi dati non lasciano mai il tuo browser.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <strong className="text-text-primary">Velocissimi</strong>
                <p className="text-text-secondary">Nessun server round-trip significa risultati istantanei, anche con file di grandi dimensioni.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <strong className="text-text-primary">Intuitivi</strong>
                <p className="text-text-secondary">Interfacce pulite e moderne per una user experience ottimale.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <strong className="text-text-primary">Open Source</strong>
                <p className="text-text-secondary">Il codice sorgente è pubblico e contribuzioni sono benvenute!</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Tech Stack Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">Tech Stack</h2>
          <p className="text-text-secondary mb-6">
            THEJORD è costruito con tecnologie moderne per garantire performance e affidabilità:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-darkest border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold text-primary mb-2">Frontend</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>• Next.js 16 - React framework</li>
                <li>• TypeScript - Type safety</li>
                <li>• Tailwind CSS - Styling</li>
                <li>• Turbopack - Build tool</li>
              </ul>
            </div>
            <div className="bg-bg-darkest border border-border rounded-lg p-4">
              <h3 className="text-lg font-bold text-primary mb-2">Infrastructure</h3>
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
        <section className="bg-bg-dark border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">Open Source</h2>
          <p className="text-text-secondary mb-4">
            THEJORD è completamente open source. Puoi contribuire, segnalare bug, o utilizzare il codice per i tuoi progetti.
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
              View on GitHub
            </a>
            <a
              href="https://github.com/thejord-it/thejord-tools/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-darkest border border-border hover:border-primary text-text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Report a Bug
            </a>
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">Privacy & Security</h2>
          <p className="text-text-secondary mb-4">
            La tua privacy è la nostra priorità. Ecco come proteggiamo i tuoi dati:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">100% Client-Side Processing</strong>
                <p className="text-text-secondary">Tutti i tool elaborano i dati direttamente nel tuo browser. Nessun dato viene mai inviato ai nostri server.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">No Account Required</strong>
                <p className="text-text-secondary">Nessuna registrazione, nessun tracking, nessun login necessario.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">Security Headers</strong>
                <p className="text-text-secondary">HTTPS only, CSP, HSTS e altre best practices di sicurezza implementate.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <strong className="text-text-primary">Auditable Code</strong>
                <p className="text-text-secondary">Codice open source che può essere verificato da chiunque.</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Questions or Feedback?</h2>
          <p className="text-text-secondary mb-6">
            We'd love to hear from you! Get in touch or open an issue on GitHub.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg-darkest px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="https://github.com/thejord-it/thejord-tools/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bg-dark border border-border hover:border-primary text-text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Open an Issue
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
