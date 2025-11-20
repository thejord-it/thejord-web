// SEO stub - In Next.js, metadata is handled in page.tsx via generateMetadata
// This is just for compatibility with tool components

interface SEOProps {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}

export default function SEO({ title, description, path = '', noIndex = false }: SEOProps) {
  // In Next.js App Router, metadata is handled server-side
  // This component is a no-op for compatibility
  return null
}
