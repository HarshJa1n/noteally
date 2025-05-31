'use client'

import { useState } from 'react'
import TextEditor from '@/components/TextEditor'
import ImageUpload from '@/components/ImageUpload'

export default function EditorPage() {
  const [editorContent, setEditorContent] = useState('<p>Welcome to Noteally!</p><p>Upload an image to extract text, or start typing directly in this editor.</p>')
  const [extractedText, setExtractedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTextExtracted = (text: string, confidence?: number) => {
    setExtractedText(text)
    
    // Automatically add the extracted text to the editor
    if (text.trim()) {
      const currentContent = editorContent
      const newContent = currentContent + `<h3>📖 Extracted from Image</h3><p>${text}</p>`
      setEditorContent(newContent)
    }
  }

  const handleImageSelect = async (file: File) => {
    setIsLoading(true)
    console.log('Processing image:', file.name)
  }

  const handleEditorUpdate = (content: string) => {
    setEditorContent(content)
    console.log('Editor updated:', content.length, 'characters')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ✍️ Text Editor
          </h1>
          <p className="text-lg text-gray-600">
            Extract text from images using AI OCR and edit them with our modern rich text editor
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📸 Upload & Extract
              </h2>
              <ImageUpload 
                onImageSelect={handleImageSelect}
                onTextExtracted={handleTextExtracted}
              />
              
              {isLoading && (
                <div className="mt-4 flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-blue-700">Processing image...</span>
                </div>
              )}
            </div>

            {/* Extracted Text Preview */}
            {extractedText && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🔍 Extracted Text
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono">{extractedText}</pre>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  This text has been automatically added to your editor below.
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Text Editor */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ✏️ Rich Text Editor
              </h2>
              <TextEditor 
                content={editorContent}
                placeholder="Start typing your notes here..."
                onUpdate={handleEditorUpdate}
                className="w-full"
              />
            </div>

            {/* Editor Features */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                ✨ Editor Features
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Rich text formatting (bold, italic, strikethrough)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Headings and paragraph styles
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Bullet lists and numbered lists
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Blockquotes for highlighting text
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Undo/redo with keyboard shortcuts
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Auto-save indicator and word count
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ⌨️ Keyboard Shortcuts
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Formatting</h4>
              <div className="space-y-1 text-gray-600">
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+B</kbd> Bold</div>
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+I</kbd> Italic</div>
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Shift+S</kbd> Strikethrough</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Structure</h4>
              <div className="space-y-1 text-gray-600">
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Alt+1</kbd> Heading 1</div>
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Alt+2</kbd> Heading 2</div>
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Shift+{'>'}</kbd> Quote</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Actions</h4>
              <div className="space-y-1 text-gray-600">
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Z</kbd> Undo</div>
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Shift+Z</kbd> Redo</div>
                <div><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+A</kbd> Select All</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 