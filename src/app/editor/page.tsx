'use client'

import { useState } from 'react'
import TextEditor from '@/components/TextEditor'
import EditorDock from '@/components/EditorDock'

export default function EditorPage() {
  const [editorContent, setEditorContent] = useState('<p>Welcome to Noteally!</p><p>Upload an image to extract text, or start typing directly in this editor.</p>')
  const [extractedText, setExtractedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTextExtracted = (text: string) => {
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
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Main Editor Area - Takes most of the screen */}
      <div className="flex-1 flex flex-col p-4 pb-32">
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <TextEditor 
            content={editorContent}
            placeholder="Start typing your notes here..."
            onUpdate={handleEditorUpdate}
            className="h-full"
            fullScreen={true}
          />
        </div>
      </div>

      {/* Dock at the bottom */}
      <EditorDock
        onImageSelect={handleImageSelect}
        onTextExtracted={handleTextExtracted}
        isLoading={isLoading}
        extractedText={extractedText}
      />
    </div>
  )
} 