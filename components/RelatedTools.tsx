'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getRelatedTools } from '@/lib/tools-relations'
import { getToolBySlug, getToolTranslationKey } from '@/lib/tools-config'

interface RelatedToolsProps {
  currentSlug: string
}

export default function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const locale = useLocale()
  const t = useTranslations('tools')
  const relatedSlugs = getRelatedTools(currentSlug)

  if (relatedSlugs.length === 0) return null

  const relatedTools = relatedSlugs
    .map(slug => {
      const tool = getToolBySlug(slug)
      if (!tool) return null
      const translationKey = getToolTranslationKey(slug)
      const name = t.has(`list.${translationKey}.name`) 
        ? t(`list.${translationKey}.name`) 
        : tool.name
      return { slug, name, icon: tool.icon }
    })
    .filter(Boolean)

  if (relatedTools.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {locale === "it" ? "Strumenti Correlati" : "Related Tools"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedTools.map(tool => tool && (
          <Link
            key={tool.slug}
            href={`/${locale}/tools/${tool.slug}`}
            className="flex items-center gap-3 p-4 bg-bg-dark rounded-lg border border-border hover:border-primary transition-colors"
          >
            <span className="text-2xl">{tool.icon}</span>
            <span className="text-text-secondary hover:text-primary">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
