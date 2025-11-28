'use client'

import { useState } from 'react'
import { searchUnsplashImages, generateSearchQuery, trackUnsplashDownload } from '@/lib/unsplash'

interface UnsplashImage {
  id: string
  urls: {
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  user: {
    name: string
    username: string
  }
  links: {
    download_location: string
  }
}

interface Props {
  title: string
  tags: string[]
  onSelect: (imageUrl: string) => void
  onClose: () => void
}

export default function UnsplashImagePicker({ title, tags, onSelect, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [searchQuery, setSearchQuery] = useState(generateSearchQuery(title, tags))
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const results = await searchUnsplashImages(searchQuery)
      setImages(results)
      setSearched(true)
    } catch (error) {
      console.error('Search failed:', error)
      alert('Failed to search images. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectImage = async (image: UnsplashImage) => {
    // Track download as per Unsplash API guidelines
    await trackUnsplashDownload(image.links.download_location)

    // Use the regular size image URL
    onSelect(image.urls.regular)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface border border-border rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Generate Placeholder Image
            </h2>
            <p className="text-text-muted text-sm">
              Beautiful gradient placeholders for your posts
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-2xl"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter keywords for gradient theme..."
              className="flex-1 px-4 py-3 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-bg-darkest font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <p className="text-text-muted text-xs mt-2">
            Suggested: <span className="text-primary">{generateSearchQuery(title, tags)}</span>
          </p>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-text-muted">Generating placeholders...</div>
            </div>
          ) : !searched ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <p className="text-text-secondary mb-2">Ready to generate placeholder images</p>
              <p className="text-text-muted text-sm">Click "Generate" to create gradients</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-text-secondary mb-2">Could not generate placeholders</p>
              <p className="text-text-muted text-sm">Try a different term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleSelectImage(image)}
                  className="group relative aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all"
                >
                  <img
                    src={image.urls.small}
                    alt={image.alt_description || 'Unsplash image'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      Select
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs">
                      by {image.user.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-bg-dark">
          <p className="text-text-muted text-xs text-center">
            Automatically generated gradient placeholders • Free to use
          </p>
        </div>
      </div>
    </div>
  )
}
