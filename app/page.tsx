import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          THEJORD
        </h1>

        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Developer Tools & Technical Blog
          <br />
          <span className="text-sm text-text-muted">Made in Italy 🇮🇹 by Il Giordano</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/blog"
            className="px-8 py-3 bg-primary hover:bg-primary-light text-bg-darkest font-semibold rounded-lg transition-colors"
          >
            Read the Blog →
          </Link>

          <Link
            href="/tools"
            className="px-8 py-3 border border-border hover:border-primary text-text-primary font-semibold rounded-lg transition-colors"
          >
            Developer Tools
          </Link>
        </div>

        <div className="pt-12 text-sm text-text-muted">
          <p>🚀 Built with Next.js • 🔒 Privacy-first • ⚡ Server-side rendering</p>
        </div>
      </div>
    </div>
  )
}
