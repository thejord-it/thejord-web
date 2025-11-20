'use client'

import { lazy, Suspense } from 'react'
import Link from 'next/link'
import type { ToolConfig } from '@/lib/tools-config'
import { ToastProvider } from './ToastProvider'

// Lazy load all tool components
const JsonFormatter = lazy(() => import('./tools/pages/JsonFormatter'))
const Base64Tool = lazy(() => import('./tools/pages/Base64Tool'))
const RegexTester = lazy(() => import('./tools/pages/RegexTester'))
const HashGenerator = lazy(() => import('./tools/pages/HashGenerator'))
const UrlTool = lazy(() => import('./tools/pages/UrlTool'))
const MarkdownConverter = lazy(() => import('./tools/pages/MarkdownConverter'))
const ColorConverter = lazy(() => import('./tools/pages/ColorConverter'))
const LoremIpsumGenerator = lazy(() => import('./tools/pages/LoremIpsumGenerator'))
const DiffChecker = lazy(() => import('./tools/pages/DiffChecker'))
const CronBuilder = lazy(() => import('./tools/pages/CronBuilder'))
const JsonSchemaConverter = lazy(() => import('./tools/pages/JsonSchemaConverter'))

const toolComponents: Record<string, React.LazyExoticComponent<any>> = {
  JsonFormatter,
  Base64Tool,
  RegexTester,
  HashGenerator,
  UrlTool,
  MarkdownConverter,
  ColorConverter,
  LoremIpsumGenerator,
  DiffChecker,
  CronBuilder,
  JsonSchemaConverter,
}

function ToolLoader() {
  return (
    <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading tool...</p>
      </div>
    </div>
  )
}

interface ToolWrapperProps {
  toolSlug: string
  toolConfig: ToolConfig
}

export default function ToolWrapper({ toolSlug, toolConfig }: ToolWrapperProps) {
  const ToolComponent = toolComponents[toolConfig.component]

  if (!ToolComponent) {
    return (
      <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Tool Not Found</h1>
          <p className="text-text-secondary mb-8">Component {toolConfig.component} not available.</p>
          <Link href="/tools" className="text-primary hover:text-primary-light">
            ← Back to Tools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      {/* Header with breadcrumbs */}
      <div className="bg-bg-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-primary transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-text-primary">{toolConfig.name}</span>
          </div>
        </div>
      </div>

      {/* Tool component */}
      <ToastProvider>
        <Suspense fallback={<ToolLoader />}>
          <ToolComponent />
        </Suspense>
      </ToastProvider>

      {/* Footer with privacy notice */}
      <div className="bg-bg-dark border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="text-sm text-text-muted">
            <p className="mb-2">
              <span className="text-primary">🔒 Privacy-First:</span> All processing happens in your browser.
              Your data never leaves your device.
            </p>
            <p>
              <Link href="/tools" className="text-primary hover:text-primary-light">
                ← Back to All Tools
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
