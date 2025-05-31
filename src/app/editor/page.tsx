'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNote } from '@/hooks/useNote'
import TextEditor from '@/components/TextEditor'
import EditorDock from '@/components/EditorDock'

export default function EditorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  
  const noteId = searchParams.get('id')
  const [extractedText, setExtractedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Use the note hook for auto-saving functionality
  const {
    note,
    content,
    isLoading: noteLoading,
    savedStatus,
    updateContent,
    createNewNote,
    error
  } = useNote(user?.uid || null, {
    noteId: noteId || undefined,
    initialContent: '<p>Welcome to Noteally!</p><p>Upload an image to extract text, or start typing directly in this editor.</p>',
    autoSaveDelay: 2000 // Auto-save after 2 seconds of inactivity
  })

  const handleTextExtracted = async (text: string) => {
    setExtractedText(text)
    
    // Automatically add the extracted text to the editor
    if (text.trim()) {
      const currentContent = content
      const newContent = currentContent + `<h3>📖 Extracted from Image</h3><p>${text}</p>`
      updateContent(newContent)
      
      // If this is a new note and user is authenticated, create it
      if (!noteId && user?.uid) {
        try {
          const newNoteId = await createNewNote()
          if (newNoteId) {
            // Update URL to include the new note ID
            router.push(`/editor?id=${newNoteId}`)
          }
        } catch (err) {
          console.error('Failed to create new note:', err)
        }
      }
    }
  }

  const handleImageSelect = async (file: File) => {
    setIsLoading(true)
    console.log('Processing image:', file.name)
    // The actual image processing is handled by the EditorDock component
  }

  const handleEditorUpdate = async (newContent: string) => {
    updateContent(newContent)
    
    // If this is a new note (no noteId) and user is authenticated, create it
    if (!noteId && user?.uid && newContent.trim() && !note) {
      try {
        const newNoteId = await createNewNote()
        if (newNoteId) {
          // Update URL to include the new note ID
          router.push(`/editor?id=${newNoteId}`)
        }
      } catch (err) {
        console.error('Failed to create new note:', err)
      }
    }
  }

  // Show loading state while note is being loaded
  if (noteLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Header with note title and save status */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-medium text-gray-900">
              {note?.title || 'New Note'}
            </h1>
            {!isAuthenticated && (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                Not saved - Sign in to save your notes
              </span>
            )}
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-2 text-sm">
              {savedStatus === 'saving' && (
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                  <span>Saving...</span>
                </div>
              )}
              {savedStatus === 'saved' && (
                <div className="flex items-center gap-1 text-green-600">
                  <span>✓</span>
                  <span>Saved to cloud</span>
                </div>
              )}
              {savedStatus === 'unsaved' && (
                <div className="flex items-center gap-1 text-orange-600">
                  <span>●</span>
                  <span>Unsaved changes</span>
                </div>
              )}
              {savedStatus === 'error' && (
                <div className="flex items-center gap-1 text-red-600">
                  <span>⚠</span>
                  <span>Save failed</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            Error: {error}
          </div>
        )}
      </div>

      {/* Main Editor Area - Takes most of the screen */}
      <div className="flex-1 flex flex-col p-4 pb-32">
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <TextEditor 
            content={content}
            placeholder="Start typing your notes here..."
            onUpdate={handleEditorUpdate}
            className="h-full"
            fullScreen={true}
            savedStatus={isAuthenticated ? savedStatus : 'unsaved'}
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