'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getPost, updatePost, BlogPost } from '@/lib/api'
import MarkdownEditor from '@/components/MarkdownEditor'
import WysiwygEditor from '@/components/WysiwygEditor'
import ImageUpload from '@/components/ImageUpload'
import TagInput from '@/components/TagInput'
import ErrorModal from '@/components/ErrorModal'

type EditorType = 'markdown' | 'wysiwyg'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editorType, setEditorType] = useState<EditorType>('markdown')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showErrorModal, setShowErrorModal] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    language: 'it',
    translationGroup: '',
    excerpt: '',
    content: '',
    author: '',
    readTime: '',
    tags: [] as string[],
    image: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
    ogImage: '',
    canonicalUrl: '',
    published: false,
  })

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      const post = await getPost(postId)
      setFormData({
        title: post.title,
        slug: post.slug,
        language: post.language,
        translationGroup: post.translationGroup || '',
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        readTime: post.readTime,
        tags: post.tags,
        image: post.image || '',
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        keywords: post.keywords,
        ogImage: post.ogImage || '',
        canonicalUrl: post.canonicalUrl || '',
        published: post.published,
      })
      // Set editor type from post if available
      if (post.editorType) {
        setEditorType(post.editorType as EditorType)
      }
    } catch (error) {
      alert('Failed to load post')
      router.push('/admin/posts')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error for this field if value is provided
    if (value && typeof value === 'string' && value.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    } else if (Array.isArray(value) && value.length > 0) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePreview = () => {
    const previewData = {
      ...formData,
      editorType: editorType,
    }
    sessionStorage.setItem('postPreview', JSON.stringify(previewData))
    window.open('/admin/posts/preview', '_blank')
  }

  const validateFormAndGetErrors = () => {
    const newErrors: { [key: string]: string } = {}

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'

    return newErrors
  }

  const handleSubmit = async (publish: boolean) => {
    // Validate form
    const newErrors = validateFormAndGetErrors()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setShowErrorModal(true)
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0]
      const errorElement = document.querySelector(`[name="${firstError}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setSaving(true)
    try {
      const post: Partial<BlogPost> = {
        ...formData,
        editorType: editorType,
        published: publish,
        publishedAt: publish && !formData.published ? new Date().toISOString() : undefined,
      }

      await updatePost(postId, post)
      router.push('/admin/posts')
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update post'
      alert(`Error: ${errorMessage}`)
      console.error('Update post error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-text-muted">Loading post...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Edit Post</h1>
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text-primary"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-2 bg-bg-dark border rounded-lg text-text-primary focus:outline-none ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                }`}
                placeholder="Post title..."
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className={`w-full px-4 py-2 bg-bg-dark border rounded-lg text-text-primary focus:outline-none ${
                  errors.slug ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                }`}
                placeholder="post-slug"
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="it">Italian</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Translation Group
                </label>
                <input
                  type="text"
                  value={formData.translationGroup}
                  onChange={(e) => handleChange('translationGroup', e.target.value)}
                  className="w-full px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                  placeholder="es: git-tutorial"
                />
                <p className="text-text-muted text-xs mt-1">Stesso ID per collegare traduzioni</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className={`w-full px-4 py-2 bg-bg-dark border rounded-lg text-text-primary focus:outline-none ${
                    errors.author ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                  }`}
                  placeholder="Domenico Jordan"
                />
                {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                className={`w-full px-4 py-2 bg-bg-dark border rounded-lg text-text-primary focus:outline-none ${
                  errors.excerpt ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                }`}
                placeholder="Brief description..."
                rows={3}
              />
              {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => handleChange('readTime', e.target.value)}
                  className="w-full px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                  placeholder="5 min read"
                />
              </div>

              <div>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => handleChange('image', url)}
                  preset="featured-image"
                  postTitle={formData.title}
                  postTags={formData.tags}
                />
              </div>
            </div>

            <div>
              <TagInput value={formData.tags} onChange={(tags) => handleChange('tags', tags)} label="Tags" />
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className={`bg-bg-surface border rounded-lg p-6 ${
          errors.content ? 'border-red-500' : 'border-border'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Content *</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditorType('markdown')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  editorType === 'markdown'
                    ? 'bg-primary text-bg-darkest'
                    : 'bg-bg-dark text-text-secondary hover:text-text-primary'
                }`}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => setEditorType('wysiwyg')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  editorType === 'wysiwyg'
                    ? 'bg-primary text-bg-darkest'
                    : 'bg-bg-dark text-text-secondary hover:text-text-primary'
                }`}
              >
                WYSIWYG
              </button>
            </div>
          </div>

          {editorType === 'markdown' ? (
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
            />
          ) : (
            <WysiwygEditor
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
            />
          )}
          {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
        </div>

        {/* SEO Settings */}
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">SEO Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="w-full px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                placeholder="Leave empty to use post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                className="w-full px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                placeholder="Leave empty to use excerpt"
                rows={2}
              />
            </div>

            <div>
              <TagInput value={formData.keywords} onChange={(keywords) => handleChange('keywords', keywords)} label="Keywords" />
            </div>

            <div>
              <ImageUpload
                value={formData.ogImage}
                onChange={(url) => handleChange('ogImage', url)}
                preset="og-image"
                postTitle={formData.title}
                postTags={formData.tags}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Canonical URL
              </label>
              <input
                type="text"
                value={formData.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                className="w-full px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between bg-bg-surface border border-border rounded-lg p-6">
          <button
            onClick={() => router.back()}
            className="text-text-secondary hover:text-text-primary"
            disabled={saving}
          >
            Cancel
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="border border-border hover:bg-bg-dark text-text-primary font-medium px-6 py-2 rounded-lg transition-colors"
            >
              👁️ Preview
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="bg-bg-dark hover:bg-bg-darkest text-text-primary font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="bg-primary hover:bg-primary-dark text-bg-darkest font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Validation Error"
        errors={Object.values(errors)}
      />
    </div>
  )
}
