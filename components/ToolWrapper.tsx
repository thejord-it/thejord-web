'use client'

import { lazy, Suspense } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
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
const XmlWsdlViewer = lazy(() => import('./tools/pages/XmlWsdlViewer'))
const PdfTools = lazy(() => import('./tools/pages/PdfTools'))

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
  XmlWsdlViewer,
  PdfTools,
}

function ToolLoader({ loadingText }: { loadingText: string }) {
  return (
    <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">{loadingText}</p>
      </div>
    </div>
  )
}

interface ToolWrapperProps {
  toolSlug: string
  toolConfig: ToolConfig
}

export default function ToolWrapper({ toolSlug, toolConfig }: ToolWrapperProps) {
  const t = useTranslations('toolPages.common')
  const tTools = useTranslations('tools.list')
  const locale = useLocale()
  const ToolComponent = toolComponents[toolConfig.component]

  // Get tool name from translations based on component name
  const toolKey = toolConfig.component.charAt(0).toLowerCase() + toolConfig.component.slice(1)
  const toolName = tTools.has(`${toolKey}.name`) ? tTools(`${toolKey}.name`) : toolConfig.name

  if (!ToolComponent) {
    return (
      <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">{t('toolNotFound')}</h1>
          <p className="text-text-secondary mb-8">{t('componentNotAvailable')}</p>
          <Link href={`/${locale}/tools`} className="text-primary hover:text-primary-light">
            {t('backToTools')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      {/* Header with breadcrumbs */}
      <div className="bg-bg-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/tools`} className="hover:text-primary transition-colors">
              {t('tools')}
            </Link>
            <span>/</span>
            <span className="text-text-primary">{toolName}</span>
          </div>
        </div>
      </div>

      {/* Tool component */}
      <ToastProvider>
        <Suspense fallback={<ToolLoader loadingText={t('loading')} />}>
          <ToolComponent />
        </Suspense>
      </ToastProvider>

      {/* Footer with privacy notice */}
      <div className="bg-bg-dark border-t border-border mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 text-center">
          <div className="text-sm text-text-muted">
            <p className="mb-2">
              <span className="text-primary">🔒 {t('privacyFirst')}</span> {t('privacyNotice')}
            </p>
            <p>
              <Link href={`/${locale}/tools`} className="text-primary hover:text-primary-light">
                {t('backToTools')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
