import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://thejord.it'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
