'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  onImageSelect?: (file: File) => void
  className?: string
}

interface UploadedFile {
  file: File
  preview: string
  id: string
}

export default function ImageUpload({ onImageSelect, className = '' }: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Clear any previous errors
    setError('')

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size must be less than 5MB')
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Only JPEG and PNG files are allowed')
      } else {
        setError('Invalid file selected')
      }
      return
    }

    // Process accepted files
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newFile: UploadedFile = {
          file,
          preview: reader.result as string,
          id: Math.random().toString(36).substr(2, 9)
        }
        
        setUploadedFiles(prev => [...prev, newFile])
        
        // Call the callback if provided
        if (onImageSelect) {
          onImageSelect(file)
        }
      }
      reader.readAsDataURL(file)
    })
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  })

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <svg
            className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the images here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                JPEG or PNG files only • Max 5MB per file
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Uploaded Images ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="aspect-video relative">
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 