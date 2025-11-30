'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useTranslations } from 'next-intl'

interface TagFilterProps {
  availableTags: string[]
  selectedTags: string[]
  locale: string
}

export default function TagFilter({ availableTags, selectedTags, locale }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
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
    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
      <span className="text-text-muted text-sm mr-2 flex-shrink-0">Tags:</span>
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            disabled={isPending}
            className={'px-3 py-1 text-sm rounded-full transition-colors flex-shrink-0 whitespace-nowrap ' +
              (isSelected
                ? 'bg-primary text-bg-darkest hover:bg-primary-light'
                : 'bg-bg-dark text-text-secondary hover:bg-bg-surface border border-border')
            }
          >
            {tag}
          </button>
        )
      })}
      {selectedTags.length > 0 && (
        <button
          onClick={clearTags}
          disabled={isPending}
          className="px-3 py-1 text-sm text-text-muted hover:text-text-primary transition-colors flex-shrink-0 whitespace-nowrap"
        >
          {t('clear')}
        </button>
      )}
      {isPending && (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin ml-2 flex-shrink-0"></div>
      )}
    </div>
  )
}
