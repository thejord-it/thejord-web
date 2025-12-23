'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useTranslations } from 'next-intl'

interface TagFilterSidebarProps {
  availableTags: string[]
  selectedTags: string[]
  locale: string
}

export default function TagFilterSidebar({ availableTags, selectedTags, locale }: TagFilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  const t = useTranslations('common')

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentTags = params.get('tags')?.split(',').filter(Boolean) || []

    let newTags: string[]
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag)
    } else {
      newTags = [...currentTags, tag]
    }

    if (newTags.length > 0) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }

    startTransition(() => {
      router.push(`/${locale}/blog?` + params.toString())
    })
  }

  const clearTags = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tags')

    startTransition(() => {
      router.push(`/${locale}/blog?` + params.toString())
    })
  }

  if (availableTags.length === 0) {
    return null
  }

  return (
    <div className="lg:sticky lg:top-24">
      {/* Mobile: Collapsible */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-bg-dark border border-border rounded-xl text-text-primary"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">
              {locale === 'it' ? 'Filtra per tag' : 'Filter by tag'}
            </span>
            {selectedTags.length > 0 && (
              <span className="px-2 py-0.5 bg-primary text-bg-darkest text-xs rounded-full">
                {selectedTags.length}
              </span>
            )}
          </span>
          <svg
            className={`w-5 h-5 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile expanded content */}
        {isExpanded && (
          <div className="mt-3 p-4 bg-bg-dark border border-border rounded-xl">
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    disabled={isPending}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      isSelected
                        ? 'bg-primary text-bg-darkest hover:bg-primary-light'
                        : 'bg-bg-surface text-text-secondary hover:bg-bg-darkest border border-border'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={clearTags}
                disabled={isPending}
                className="mt-3 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {t('clear')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Sidebar */}
      <div className="hidden lg:block bg-bg-dark border border-border rounded-xl p-5">
        <h3 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Tags
        </h3>

        <div className="space-y-2">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                disabled={isPending}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between group ${
                  isSelected
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                }`}
              >
                <span>{tag}</span>
                {isSelected && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            disabled={isPending}
            className="mt-4 w-full text-center py-2 text-sm text-text-muted hover:text-text-primary transition-colors border-t border-border pt-4"
          >
            {t('clear')} ({selectedTags.length})
          </button>
        )}

        {isPending && (
          <div className="flex justify-center mt-4">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  )
}
