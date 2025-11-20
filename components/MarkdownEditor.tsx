'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const options = useMemo(() => ({
    spellChecker: false,
    placeholder: 'Write your content in Markdown...',
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'guide',
    ],
    status: ['lines', 'words', 'cursor'],
    autofocus: false,
    autosave: {
      enabled: false,
    },
  }), [])

  return (
    <div className="markdown-editor">
      <SimpleMDE value={value} onChange={onChange} options={options} />
    </div>
  )
}
