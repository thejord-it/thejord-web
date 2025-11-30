import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the THEJORD.IT team for questions, bug reports, feature requests, or security issues. We\'re here to help!',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
