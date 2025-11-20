'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'
import ColorThief from 'colorthief'

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedAreaPixels: Area, backgroundColor?: string) => void
  onCancel: () => void
  aspectRatio?: number
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  aspectRatio = 16 / 9 // Default 16:9 aspect ratio
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(0.5)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
  const [dominantColor, setDominantColor] = useState<string>('#ffffff')
  const [showEyedropper, setShowEyedropper] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const onCropChange = (location: { x: number; y: number }) => {
    setCrop(location)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteInternal = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  // Extract dominant color from image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = image
    img.onload = () => {
      imageRef.current = img
      try {
        const colorThief = new ColorThief()
        const color = colorThief.getColor(img)
        const hexColor = `#${color.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`
        setDominantColor(hexColor)
        setBackgroundColor(hexColor)
      } catch (error) {
        console.error('Failed to extract color:', error)
      }
    }
  }, [image])

  // Draw image on canvas when eyedropper is shown
  useEffect(() => {
    if (showEyedropper && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = imageRef.current.width
        canvas.height = imageRef.current.height
        ctx.drawImage(imageRef.current, 0, 0)
      }
    }
  }, [showEyedropper])

  const handleEyedropperClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const hexColor = `#${[pixel[0], pixel[1], pixel[2]].map(c => c.toString(16).padStart(2, '0')).join('')}`
    setBackgroundColor(hexColor)
    setShowEyedropper(false)
  }

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels, backgroundColor)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Crop Image</h2>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-bg-dark hover:bg-bg-darkest text-text-primary rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-bg-darkest font-medium rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Cropper Area */}
      <div className="flex-1 relative" style={{ backgroundColor }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteInternal}
          restrictPosition={false}
          style={{
            containerStyle: {
              backgroundColor: backgroundColor,
            },
          }}
        />
      </div>

      {/* Controls */}
      <div className="bg-bg-surface border-t border-border px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Zoom Control */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Zoom
            </label>
            <div className="flex items-center gap-4">
              <span className="text-text-muted text-sm">-</span>
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-bg-dark rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-text-muted text-sm">+</span>
            </div>
          </div>

          {/* Background Color Control */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              {/* Color Preview */}
              <div
                className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                style={{ backgroundColor }}
                title={backgroundColor}
              />

              {/* Quick Actions */}
              <div className="flex gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => setBackgroundColor('#ffffff')}
                  className="px-3 py-2 bg-bg-dark hover:bg-bg-darkest text-text-primary text-sm rounded-lg transition-colors"
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => setBackgroundColor(dominantColor)}
                  className="px-3 py-2 bg-bg-dark hover:bg-bg-darkest text-text-primary text-sm rounded-lg transition-colors"
                  title={`Dominant color: ${dominantColor}`}
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setShowEyedropper(!showEyedropper)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    showEyedropper
                      ? 'bg-primary text-bg-darkest'
                      : 'bg-bg-dark hover:bg-bg-darkest text-text-primary'
                  }`}
                >
                  Eyedropper
                </button>
              </div>

              {/* Manual Input */}
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#ffffff"
                className="w-28 px-3 py-2 bg-bg-dark border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <p className="text-xs text-text-muted mt-2">
              {showEyedropper ? 'Click on the image above to pick a color' : 'Choose background color for empty areas'}
            </p>
          </div>
        </div>
      </div>

      {/* Eyedropper Canvas (hidden, used for color picking) */}
      {showEyedropper && imageRef.current && (
        <canvas
          ref={canvasRef}
          onClick={handleEyedropperClick}
          className="fixed inset-0 z-[60] cursor-crosshair"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
        />
      )}
    </div>
  )
}
