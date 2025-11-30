'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

interface Tool {
  slug: string
  key: string
  icon: string
  color: string
  categoryKey: string
}

interface ToolsSearchProps {
  tools: Tool[]
}

export default function ToolsSearch({ tools }: ToolsSearchProps) {
  const t = useTranslations('tools')
  const tList = useTranslations('tools.list')
  const tCat = useTranslations('tools.categories')
  const locale = useLocale()
  const [search, setSearch] = useState('')

  // Map tools with translated values for searching
  const toolsWithTranslations = tools.map(tool => ({
    ...tool,
    name: tList(`${tool.key}.name`),
    description: tList(`${tool.key}.description`),
    category: tCat(tool.categoryKey)
  }))

  const filteredTools = toolsWithTranslations.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase()) ||
    tool.category.toLowerCase().includes(search.toLowerCase())
  )

  const categories = Array.from(new Set(filteredTools.map(t => t.category)))

  return (
    <div className="min-h-screen bg-bg-darkest">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-base md:text-xl text-text-secondary max-w-3xl">
            {t('description')}
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6 md:mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-3 pl-10 bg-bg-dark border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {search && (
            <p className="mt-2 text-sm text-text-muted">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </p>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">{t('noResults')}</p>
          </div>
        ) : (
          categories.map(category => (
            <div key={category} className="mb-6 md:mb-12">
              <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-3 md:mb-6 border-l-4 border-primary pl-3 md:pl-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredTools
                  .filter(tool => tool.category === category)
                  .map(tool => (
                    <Link
                      key={tool.slug}
                      href={`/${locale}/tools/${tool.slug}`}
                      className="group relative bg-bg-dark border border-border hover:border-primary rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 active:scale-[0.98]"
                    >
                      <div className={"absolute top-0 left-0 w-full h-1 bg-gradient-to-r " + tool.color + " rounded-t-xl"}></div>

                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={"text-2xl md:text-3xl flex-shrink-0 bg-gradient-to-br " + tool.color + " bg-clip-text text-transparent font-bold"}>
                          {tool.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-text-secondary text-xs md:text-sm line-clamp-1 md:line-clamp-none">
                            {tool.description}
                          </p>
                        </div>

                        <div className="text-text-muted group-hover:text-primary transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))
        )}

        <div className="hidden md:block mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            {t('whyUse.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{t('whyUse.privacy.title')}</h3>
              <p className="text-text-secondary text-sm">
                {t('whyUse.privacy.description')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{t('whyUse.fast.title')}</h3>
              <p className="text-text-secondary text-sm">
                {t('whyUse.fast.description')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{t('whyUse.free.title')}</h3>
              <p className="text-text-secondary text-sm">
                {t('whyUse.free.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
