'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface TagFilterProps {
  availableTags: string[]
  selectedTags: string[]
}

export default function TagFilter({ availableTags, selectedTags }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

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
      router.push('/blog?' + params.toString())
    })
  }

  const clearTags = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tags')
    
    startTransition(() => {
      router.push('/blog?' + params.toString())
    })
  }

  if (availableTags.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
      <span className="text-gray-400 text-sm mr-2 flex-shrink-0">Tags:</span>
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            disabled={isPending}
            className={'px-3 py-1 text-sm rounded-full transition-colors flex-shrink-0 whitespace-nowrap ' +
              (isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700')
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
          className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors flex-shrink-0 whitespace-nowrap"
        >
          Rimuovi filtri
        </button>
      )}
      {isPending && (
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-2 flex-shrink-0"></div>
      )}
    </div>
  )
}
