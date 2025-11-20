'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const [previewData, setPreviewData] = useState<any>(null)

  useEffect(() => {
    // Get preview data from sessionStorage
    const data = sessionStorage.getItem('postPreview')
    if (data) {
      setPreviewData(JSON.parse(data))
    }
  }, [])

  if (!previewData) {
    return (
      <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
        <div className="text-text-muted">No preview data available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      {/* Preview Header */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm font-medium">PREVIEW MODE</span>
            <span className="text-text-muted text-sm">This is how your post will appear</span>
          </div>
          <button
            onClick={() => window.close()}
            className="text-text-secondary hover:text-text-primary text-sm"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* Post Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Featured Image with responsive srcset */}
        {previewData.image && (previewData.image.startsWith('http://') || previewData.image.startsWith('https://')) && (
          <div className="w-full mb-8 rounded-lg bg-white p-8 flex items-center justify-center overflow-hidden">
            <img
              src={previewData.image}
              srcSet={`
                ${previewData.image.replace('.webp', '-small.webp')} 640w,
                ${previewData.image.replace('.webp', '-medium.webp')} 1024w,
                ${previewData.image} 1920w
              `}
              sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
              alt={previewData.title}
              style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
              loading="eager"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-5xl font-bold text-text-primary mb-4">
          {previewData.title || 'Untitled Post'}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-text-secondary text-sm mb-8">
          <span>{previewData.author || 'Anonymous'}</span>
          <span>•</span>
          <span>{previewData.readTime || '5 min read'}</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>

        {/* Excerpt */}
        {previewData.excerpt && (
          <div className="text-xl text-text-secondary mb-8 italic border-l-4 border-primary pl-4">
            {previewData.excerpt}
          </div>
        )}

        {/* Tags */}
        {previewData.tags && previewData.tags.length > 0 && (
          <div className="flex gap-2 mb-8">
            {previewData.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: previewData.content || '<p>No content</p>' }}
        />
      </article>
    </div>
  )
}
