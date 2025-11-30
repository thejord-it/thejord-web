'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getPost, updatePost, getAllPosts, BlogPost } from '@/lib/api'
import { translate, translateBatch, generateSlug, type TranslationLanguage } from '@/lib/translation'
import MarkdownEditor from '@/components/MarkdownEditor'
import WysiwygEditor from '@/components/WysiwygEditor'
import ImageUpload from '@/components/ImageUpload'
import TagInput from '@/components/TagInput'
import ErrorModal from '@/components/ErrorModal'
import IconPicker from '@/components/IconPicker'

type EditorType = 'markdown' | 'wysiwyg'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)
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
    icon: null as string | null,
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
        icon: post.icon || null,
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

  const handleTranslate = async () => {
    const targetLang: TranslationLanguage = formData.language === 'it' ? 'en' : 'it'
    const sourceLang: TranslationLanguage = formData.language as TranslationLanguage
    const translationGroup = formData.translationGroup || formData.slug

    // Check if translation already exists
    try {
      const allPosts = await getAllPosts()
      const existingTranslation = allPosts.find(
        p => p.translationGroup === translationGroup && p.language === targetLang
      )

      if (existingTranslation) {
        const choice = window.confirm(
          `Esiste già una traduzione in ${targetLang.toUpperCase()} per questo post.\n\n` +
          `OK = Sovrascrivi con nuova traduzione\n` +
          `Annulla = Modifica traduzione esistente`
        )

        if (!choice) {
          // User wants to edit existing translation
          router.push(`/admin/posts/${existingTranslation.id}`)
          return
        }
        // User wants to overwrite - continue with translation and will update existing
      }

      setTranslating(true)

      // Translate title, excerpt, content, metaTitle, metaDescription in batch
      const textsToTranslate = [
        formData.title,
        formData.excerpt,
        formData.content,
        formData.metaTitle || formData.title,
        formData.metaDescription || formData.excerpt,
      ]

      const results = await translateBatch(
        textsToTranslate,
        sourceLang,
        targetLang
      )

      // Check if all translations succeeded
      const allSuccess = results.every(r => r.success)
      if (!allSuccess) {
        const failedIndex = results.findIndex(r => !r.success)
        throw new Error(`Translation failed: ${results[failedIndex].error}`)
      }

      const [translatedTitle, translatedExcerpt, translatedContent, translatedMetaTitle, translatedMetaDescription] = results.map(r => r.translatedText)

      // If overwriting existing translation, update it directly
      if (existingTranslation) {
        await updatePost(existingTranslation.id, {
          title: translatedTitle,
          excerpt: translatedExcerpt,
          content: translatedContent,
          metaTitle: translatedMetaTitle,
          metaDescription: translatedMetaDescription,
          author: formData.author,
          readTime: formData.readTime,
          tags: formData.tags,
          image: formData.image,
          icon: formData.icon,
          keywords: formData.keywords,
          ogImage: formData.ogImage,
          editorType: editorType,
          published: false, // Reset to draft after overwrite
        })

        // Update original post's translationGroup if needed
        if (!formData.translationGroup) {
          await updatePost(postId, { translationGroup })
        }

        const provider = results[0].provider
        alert(`Traduzione sovrascritta usando ${provider === 'deepl' ? 'DeepL' : 'MyMemory'}!`)
        router.push(`/admin/posts/${existingTranslation.id}`)
        return
      }

      // Generate translated slug with language suffix to ensure uniqueness
      const translatedSlug = generateSlug(translatedTitle, targetLang)

      // Prepare the translated post data for new post
      const translatedPost = {
        title: translatedTitle,
        slug: translatedSlug,
        language: targetLang,
        translationGroup: translationGroup,
        excerpt: translatedExcerpt,
        content: translatedContent,
        author: formData.author,
        readTime: formData.readTime,
        tags: formData.tags,
        image: formData.image,
        icon: formData.icon,
        metaTitle: translatedMetaTitle,
        metaDescription: translatedMetaDescription,
        keywords: formData.keywords,
        ogImage: formData.ogImage,
        canonicalUrl: '',
        published: false,
        editorType: editorType,
      }

      // Store in sessionStorage and redirect to new post page
      sessionStorage.setItem('translatedPost', JSON.stringify(translatedPost))

      // Update original post's translationGroup if needed
      if (!formData.translationGroup) {
        await updatePost(postId, { translationGroup })
      }

      const provider = results[0].provider
      alert(`Traduzione completata usando ${provider === 'deepl' ? 'DeepL' : 'MyMemory'}!\n\nRedirect alla versione ${targetLang.toUpperCase()}...`)

      router.push('/admin/posts/new?fromTranslation=true')
    } catch (error: any) {
      console.error('Translation error:', error)
      alert(`Translation failed: ${error.message}`)
    } finally {
      setTranslating(false)
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
        <div className="flex items-center gap-4">
          <button
            onClick={handleTranslate}
            disabled={translating || saving}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-dark text-bg-darkest font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translating ? (
              <>
                <span className="animate-spin">⏳</span>
                Translating...
              </>
            ) : (
              <>
                🌐 Translate to {formData.language === 'it' ? 'EN' : 'IT'}
              </>
            )}
          </button>
          <button
            onClick={() => router.back()}
            className="text-text-secondary hover:text-text-primary"
          >
            ← Back
          </button>
        </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <ImageUpload
                value={formData.image}
                onChange={(url) => handleChange('image', url)}
                preset="featured-image"
                postTitle={formData.title}
                postTags={formData.tags}
              />

              <IconPicker
                value={formData.icon}
                onChange={(iconId) => handleChange('icon', iconId || '')}
                label="Post Icon (optional)"
              />
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-text-primary">Content *</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditorType('markdown')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
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
                className={`px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
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
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-bg-surface border border-border rounded-lg p-4 md:p-6">
          <button
            onClick={() => router.back()}
            className="text-text-secondary hover:text-text-primary order-last md:order-first"
            disabled={saving}
          >
            Cancel
          </button>

          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="border border-border hover:bg-bg-dark text-text-primary font-medium px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              Preview
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="bg-bg-dark hover:bg-bg-darkest text-text-primary font-medium px-4 md:px-6 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="bg-primary hover:bg-primary-dark text-bg-darkest font-medium px-4 md:px-6 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base"
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
