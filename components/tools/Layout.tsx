// Minimal Layout wrapper for tool components in Next.js
// Replaced React Router with simplified version

import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  currentPage?: 'tools' | 'blog' | 'about' | 'contact'
  showFullNav?: boolean
}

export default function Layout({ children, currentPage = 'tools', showFullNav = true }: LayoutProps) {
  // In Next.js, navigation is handled by ToolWrapper
  // This is just a pass-through for compatibility
  return <div className="w-full">{children}</div>
}
