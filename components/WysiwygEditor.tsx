'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function WysiwygEditor({ value, onChange }: WysiwygEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] px-4 py-3 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const MenuBar = () => (
    <div className="border-b border-border bg-bg-dark px-2 py-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('bold')
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('italic')
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('strike')
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Heading 3"
      >
        H3
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('bulletList')
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Bullet List"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('orderedList')
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Numbered List"
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-3 py-1 rounded transition-colors ${
          editor.isActive('blockquote')
            ? 'bg-primary text-bg-darkest'
            : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
        }`}
        title="Quote"
      >
        " Quote
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter image URL:')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
        className="px-3 py-1 rounded text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors"
        title="Insert Image"
      >
        🖼️ Image
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-3 py-1 rounded text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors"
        title="Horizontal Rule"
      >
        ─ HR
      </button>
    </div>
  )

  return (
    <div className="wysiwyg-editor border border-border rounded-lg overflow-hidden bg-bg-surface">
      <MenuBar />
      <EditorContent editor={editor} />
    </div>
  )
}
