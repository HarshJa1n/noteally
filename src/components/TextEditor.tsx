'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface TextEditorProps {
  content?: string
  placeholder?: string
  onUpdate?: (content: string) => void
  className?: string
  editable?: boolean
  fullScreen?: boolean
  savedStatus?: 'saved' | 'saving' | 'unsaved' | 'error'
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title?: string
}

const ToolbarButton = ({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      px-2 py-1 rounded text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
    `}
  >
    {children}
  </button>
)

export default function TextEditor({ 
  content = '', 
  placeholder = 'Start typing...', 
  onUpdate,
  className = '',
  editable = true,
  fullScreen = false,
  savedStatus = 'saved'
}: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML())
      }
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        Loading editor...
      </div>
    )
  }

  return (
    <div className={`${fullScreen ? 'h-full flex flex-col' : ''} border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <span className="font-bold">B</span>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <span className="italic">I</span>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <span className="line-through">S</span>
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              H1
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              H2
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive('paragraph')}
              title="Paragraph"
            >
              P
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              •
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              1.
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              "
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo (Ctrl+Z)"
            >
              ↶
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo (Ctrl+Shift+Z)"
            >
              ↷
            </ToolbarButton>
          </div>

          {/* Save Status */}
          {onUpdate && (
            <div className="ml-auto flex items-center text-xs text-gray-500">
              {savedStatus === 'saving' && (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                  <span>Saving...</span>
                </div>
              )}
              {savedStatus === 'saved' && (
                <div className="flex items-center gap-1 text-green-600">
                  <span>✓</span>
                  <span>Saved</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Editor Content */}
      <div className={`prose prose-sm max-w-none p-4 ${fullScreen ? 'flex-1 overflow-y-auto' : 'min-h-[200px]'} [&_.ProseMirror]:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0`}>
        <EditorContent editor={editor} />
      </div>

      {/* Word Count and Stats */}
      {editable && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span>{editor.getCharacterCount()} characters</span>
            <span>~{Math.ceil(editor.getCharacterCount() / 5)} words</span>
          </div>
          <div className="text-right">
            <span>Use Ctrl+B for bold, Ctrl+I for italic</span>
          </div>
        </div>
      )}
    </div>
  )
} 