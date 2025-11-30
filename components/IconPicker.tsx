'use client'

import { useState } from 'react'
import { ICON_OPTIONS, type IconOption } from '@/lib/icons'

// Re-export for backward compatibility
export { ICON_OPTIONS, type IconOption }
export { getIconEmoji } from '@/lib/icons'

// Get unique categories
const CATEGORIES = Array.from(new Set(ICON_OPTIONS.map(i => i.category)))

interface IconPickerProps {
  value: string | null
  onChange: (iconId: string | null) => void
  label?: string
}

export default function IconPicker({ value, onChange, label = 'Post Icon' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const selectedIcon = ICON_OPTIONS.find(i => i.id === value)

  const filteredIcons = ICON_OPTIONS.filter(icon => {
    const matchesSearch = !searchTerm ||
      icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedIcons = CATEGORIES.reduce((acc, category) => {
    const icons = filteredIcons.filter(i => i.category === category)
    if (icons.length > 0) {
      acc[category] = icons
    }
    return acc
  }, {} as Record<string, IconOption[]>)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedIcon ? (
              <>
                <span className="text-2xl">{selectedIcon.emoji}</span>
                <span>{selectedIcon.label}</span>
              </>
            ) : (
              <span className="text-text-muted">No icon selected</span>
            )}
          </div>
          <span className="text-text-muted">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-bg-surface border border-border rounded-lg shadow-xl max-h-96 overflow-hidden">
            {/* Search and Filter */}
            <div className="p-3 border-b border-border space-y-2">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-bg-dark border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
              />
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    !selectedCategory
                      ? 'bg-primary text-bg-darkest'
                      : 'bg-bg-dark text-text-secondary hover:text-text-primary'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-bg-darkest'
                        : 'bg-bg-dark text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Selection */}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null)
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10 text-sm border-b border-border"
              >
                ✕ Remove icon
              </button>
            )}

            {/* Icons Grid */}
            <div className="overflow-y-auto max-h-64 p-3">
              {Object.entries(groupedIcons).map(([category, icons]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-6 gap-1">
                    {icons.map(icon => (
                      <button
                        key={icon.id}
                        type="button"
                        onClick={() => {
                          onChange(icon.id)
                          setIsOpen(false)
                        }}
                        className={`p-2 rounded-lg text-2xl hover:bg-bg-dark transition-colors ${
                          value === icon.id ? 'bg-primary/20 ring-2 ring-primary' : ''
                        }`}
                        title={icon.label}
                      >
                        {icon.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedIcons).length === 0 && (
                <p className="text-text-muted text-center py-4">No icons found</p>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-text-muted">
        Optional icon displayed alongside the post image
      </p>
    </div>
  )
}
