'use client'

import { useState } from 'react'
import { 
  Upload, 
  Camera, 
  Home, 
  FileText, 
  Tags, 
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react'
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ImageUpload from '@/components/ImageUpload'
import CameraCapture from '@/components/CameraCapture'
import Link from 'next/link'

interface EditorDockProps {
  onImageSelect?: (file: File) => void
  onTextExtracted?: (text: string, confidence?: number) => void
  isLoading?: boolean
  extractedText?: string
}

export default function EditorDock({ 
  onImageSelect, 
  onTextExtracted, 
  isLoading,
  extractedText 
}: EditorDockProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const handleImageSelect = (file: File) => {
    if (onImageSelect) {
      onImageSelect(file)
    }
  }

  const handleTextExtracted = (text: string, confidence?: number) => {
    if (onTextExtracted) {
      onTextExtracted(text, confidence)
    }
    // Close upload modal after successful extraction
    setIsUploadOpen(false)
  }

  const handleCameraCapture = (imageData: string) => {
    // Convert base64 to File object for consistency
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        handleImageSelect(file)
      })
    setIsCameraOpen(false)
  }

  const dockItems = [
    {
      title: 'Home',
      icon: <Home className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: '/',
    },
    {
      title: 'Notes',
      icon: <FileText className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: '/notes',
    },
    {
      title: 'Upload Image',
      icon: <Upload className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      action: () => setIsUploadOpen(true),
    },
    {
      title: 'Camera',
      icon: <Camera className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      action: () => setIsCameraOpen(true),
    },
    {
      title: 'Tags',
      icon: <Tags className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: '/tags',
    },
    {
      title: 'Categories',
      icon: <FolderOpen className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: '/categories',
    },
  ]

  return (
    <>
      {/* Dock positioned at the bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Dock className="items-end pb-3">
          {dockItems.map((item, idx) => (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer"
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>
                {item.href ? (
                  <Link href={item.href} className="w-full h-full flex items-center justify-center">
                    {item.icon}
                  </Link>
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    onClick={item.action}
                  >
                    {item.icon}
                  </div>
                )}
              </DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Upload & Extract Text
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <ImageUpload 
              onImageSelect={handleImageSelect}
              onTextExtracted={handleTextExtracted}
            />
            
            {isLoading && (
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-blue-700">Processing image...</span>
              </div>
            )}

            {/* Extracted Text Preview */}
            {extractedText && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🔍 Extracted Text
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono">{extractedText}</pre>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  This text has been automatically added to your editor.
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Modal */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Capture
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <CameraCapture 
              onCapture={handleCameraCapture}
              onTextExtracted={handleTextExtracted}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 