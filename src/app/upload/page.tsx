'use client'

import ImageUpload from '@/components/ImageUpload'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Book Photos
          </h1>
          <p className="text-lg text-gray-600">
            Drag and drop or click to select photos of book pages for OCR processing
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ImageUpload 
            onImageSelect={(file) => {
              console.log('Selected file:', file.name)
            }}
          />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Tips for Best Results
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Ensure good lighting when taking photos</li>
            <li>Keep the camera parallel to the page to minimize skew</li>
            <li>Make sure text is clear and readable</li>
            <li>Supported formats: JPEG, PNG (max 5MB each)</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 