import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'THEJORD - Developer Tools & Blog',
    template: '%s | THEJORD',
  },
  description: 'Free developer tools and technical blog by Il Giordano. JSON formatter, Base64 encoder, Cron builder, and more. 100% privacy-first.',
  keywords: ['developer tools', 'json formatter', 'base64', 'cron', 'blog', 'programming'],
  authors: [{ name: 'Il Giordano' }],
  creator: 'Il Giordano',
  metadataBase: new URL('https://thejord.it'),
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://thejord.it',
    siteName: 'THEJORD',
    title: 'THEJORD - Developer Tools & Blog',
    description: 'Free developer tools and technical blog. 100% privacy-first. Made in Italy 🇮🇹',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THEJORD - Developer Tools & Blog',
    description: 'Free developer tools and technical blog. Made in Italy 🇮🇹',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
