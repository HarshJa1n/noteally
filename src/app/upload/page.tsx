'use client'

import { useCallback } from 'react'
import ImageUpload from '@/components/ImageUpload'

export default function UploadPage() {
  const handleImageSelect = useCallback((file: File) => {
    console.log('Selected file:', file.name)
  }, [])

  const handleTextExtracted = useCallback((text: string, confidence?: number) => {
    console.log('Extracted text:', text)
    console.log('Confidence:', confidence)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Upload Book Photos
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Drag and drop or click to select photos of book pages for OCR processing
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <ImageUpload 
            onImageSelect={handleImageSelect}
            onTextExtracted={handleTextExtracted}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-blue-900 mb-3 sm:mb-4">
            📱 Tips for Best Results
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-blue-800">
            <li>Ensure good lighting when taking photos</li>
            <li>Keep the camera parallel to the page to minimize skew</li>
            <li>Make sure text is clear and readable</li>
            <li>Supported formats: JPEG, PNG (max 5MB each)</li>
            <li className="sm:hidden">Tap and hold to access camera on mobile</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 