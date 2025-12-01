'use client'

import { useState, useRef } from 'react'
import ImageCropper from './ImageCropper'
import UnsplashImagePicker from './UnsplashImagePicker'
import { getCroppedImg } from '@/lib/cropImage'
import { Area } from 'react-easy-crop'

// Use proxy for client-side API calls (keeps backend internal)
const API_URL = '/api/proxy'

type ImagePreset = 'featured-image' | 'og-image' | 'square' | 'portrait' | 'custom'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  preset?: ImagePreset
  aspectRatio?: number // Used only if preset is 'custom'
  postTitle?: string // For Unsplash search
  postTags?: string[] // For Unsplash search
}

const PRESETS = {
  'featured-image': { ratio: 16/9, dimensions: '1920x1080', label: 'Featured Image' },
  'og-image': { ratio: 1200/630, dimensions: '1200x630', label: 'OG Image (Social)' },
  'square': { ratio: 1/1, dimensions: '800x800', label: 'Square' },
  'portrait': { ratio: 3/4, dimensions: '600x800', label: 'Portrait' },
  'custom': { ratio: 16/9, dimensions: 'Custom', label: 'Custom' }
}

export default function ImageUpload({
  value,
  onChange,
  label,
  preset = 'featured-image',
  aspectRatio,
  postTitle,
  postTags
}: ImageUploadProps) {
  const presetConfig = PRESETS[preset]
  const finalAspectRatio = preset === 'custom' && aspectRatio ? aspectRatio : presetConfig.ratio
  const finalLabel = label || `${presetConfig.label} (${presetConfig.dimensions})`
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value)
  const [showCropper, setShowCropper] = useState(false)
  const [showUnsplashPicker, setShowUnsplashPicker] = useState(false)
  const [tempImage, setTempImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAuthHeader = (): Record<string, string> => {
    if (typeof window !== 'undefined') {
      const token = document.cookie.split('; ').find(row => row.startsWith('thejord_admin_token='))
      if (token) {
        return { Authorization: `Bearer ${token.split('=')[1]}` }
      }
    }
    return {}
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create temporary URL for cropper
    const imageUrl = URL.createObjectURL(file)
    setTempImage(imageUrl)
    setShowCropper(true)
  }

  const handleCropComplete = async (croppedAreaPixels: Area, backgroundColor?: string) => {
    try {
      setUploading(true)
      setShowCropper(false)

      // Get cropped image blob with background color
      const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels, backgroundColor)

      // Upload cropped image
      const formData = new FormData()
      formData.append('image', croppedBlob, 'cropped-image.jpg')

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      // Use proxy URL for images too
      const imageUrl = `/api/proxy${data.data.url}`

      setPreview(imageUrl)
      onChange(imageUrl)

      // Clean up temp URL
      URL.revokeObjectURL(tempImage)
      setTempImage('')
    } catch (error) {
      alert('Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    URL.revokeObjectURL(tempImage)
    setTempImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlChange = (url: string) => {
    setPreview(url)
    onChange(url)
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary mb-2">
          {finalLabel}
        </label>

        {/* URL Input */}
        <div className="flex flex-col lg:flex-row gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1 px-4 py-2 bg-bg-dark border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm"
            placeholder="https://... or upload"
          />
          <div className="flex gap-2">
            {postTitle && (
              <button
                type="button"
                onClick={() => setShowUnsplashPicker(true)}
                className="flex-1 lg:flex-none px-3 py-2 bg-secondary hover:bg-secondary/80 text-text-primary font-medium rounded-lg transition-colors text-sm"
              >
                Generate
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1 lg:flex-none px-3 py-2 bg-primary hover:bg-primary-dark text-bg-darkest font-medium rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              {uploading ? '...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs max-h-48 rounded-lg border border-border"
              onError={() => setPreview('')}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={finalAspectRatio}
        />
      )}

      {/* Unsplash Image Picker Modal */}
      {showUnsplashPicker && postTitle && (
        <UnsplashImagePicker
          title={postTitle}
          tags={postTags || []}
          onSelect={(url) => {
            handleUrlChange(url)
            setShowUnsplashPicker(false)
          }}
          onClose={() => setShowUnsplashPicker(false)}
        />
      )}
    </>
  )
}
