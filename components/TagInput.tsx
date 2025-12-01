'use client'

import { useState, useEffect, useRef } from 'react'

// Use proxy for client-side API calls (keeps backend internal)
const API_URL = '/api/proxy'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  label?: string
}

export default function TagInput({ value, onChange, label = 'Tags' }: TagInputProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch all existing tags
  useEffect(() => {
    fetchAllTags()
  }, [])

  const fetchAllTags = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`)
      if (res.ok) {
        const data = await res.json()
        const posts = data.data || []
        const tagsSet = new Set<string>()
        posts.forEach((post: any) => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
              if (tag && typeof tag === 'string') {
                tagsSet.add(tag.trim())
              }
            })
          }
        })
        const uniqueTags = Array.from(tagsSet).sort()
        console.log('Fetched tags:', uniqueTags) // Debug log
        setAllTags(uniqueTags)
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInput(val)

    if (val.trim()) {
      const filtered = allTags.filter(tag =>
        tag.toLowerCase().includes(val.toLowerCase()) &&
        !value.includes(tag)
      )
      console.log('Filtered suggestions:', filtered) // Debug log
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag])
      setInput('')
      setSuggestions([])
      setShowSuggestions(false)
      inputRef.current?.focus()
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0 && showSuggestions) {
        addTag(suggestions[0])
      } else if (input.trim()) {
        addTag(input)
      }
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (tag: string) => {
    addTag(tag)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary mb-2">
        {label}
      </label>

      {/* Tags Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-primary-dark transition-colors"
              title="Remove tag"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input with Autocomplete */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => input && setSuggestions(allTags.filter(t =>
            t.toLowerCase().includes(input.toLowerCase()) && !value.includes(t)
          )) && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
          placeholder="Type to add tags... (press Enter)"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((tag, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(tag)}
                className="w-full px-4 py-2 text-left text-text-primary hover:bg-bg-dark transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-text-muted">
        Press Enter to add a tag. Type to see suggestions from existing tags.
      </p>
    </div>
  )
}
