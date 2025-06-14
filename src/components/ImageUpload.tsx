'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { runFlow } from '@genkit-ai/next/client'
import { ocrFlow } from '@/genkit/ocrFlow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Settings } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface ImageUploadProps {
  onImageSelect?: (file: File) => void
  onTextExtracted?: (text: string, confidence?: number) => void
  className?: string
}

interface UploadedFile {
  file: File
  preview: string
  id: string
  extractedText?: string
  isProcessing?: boolean
  confidence?: number
}

export default function ImageUpload({ onImageSelect, onTextExtracted, className = '' }: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string>('')
  const [ocrPrompt, setOcrPrompt] = useState('')
  const [showPromptInput, setShowPromptInput] = useState(false)
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)

  const processImageOCR = async (file: File, fileId: string, customPrompt?: string) => {
    try {
      // Update file status to processing
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, isProcessing: true } : f)
      )

      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          const base64String = result.split(',')[1] // Remove data:image/jpeg;base64, prefix
          resolve(base64String)
        }
        reader.readAsDataURL(file)
      })

      // Determine the prompt to use
      const promptToUse = customPrompt || 'This is a book page. Please extract all text accurately, maintaining structure and formatting.'

      // Call the OCR flow
      const result = await runFlow<typeof ocrFlow>({
        url: '/api/ocr',
        input: { 
          imageData: base64,
          prompt: promptToUse
        },
      })

      // Update file with extracted text
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { 
          ...f, 
          extractedText: result.extractedText,
          confidence: result.confidence,
          isProcessing: false 
        } : f)
      )

      // Call the callback if provided
      if (onTextExtracted) {
        onTextExtracted(result.extractedText, result.confidence)
      }

    } catch (error) {
      console.error('OCR processing failed:', error)
      setError('Failed to extract text from image. Please try again.')
      
      // Update file status to show error
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, isProcessing: false } : f)
      )
    }
  }

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
          id: Math.random().toString(36).substr(2, 9),
          isProcessing: false
        }
        
        setUploadedFiles(prev => [...prev, newFile])
        
        // Call the callback if provided
        if (onImageSelect) {
          onImageSelect(file)
        }

        // Start OCR processing with appropriate prompt
        const promptToUse = useCustomPrompt && ocrPrompt ? ocrPrompt : undefined
        processImageOCR(file, newFile.id, promptToUse)
      }
      reader.readAsDataURL(file)
    })
  }, [onImageSelect, onTextExtracted, useCustomPrompt, ocrPrompt])

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

  const reprocessFile = (fileId: string, customPrompt?: string) => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (file) {
      processImageOCR(file.file, fileId, customPrompt)
    }
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
      {/* OCR Settings */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Upload Images for OCR</h3>
        <Popover open={showPromptInput} onOpenChange={setShowPromptInput}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              OCR Settings
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" side="bottom" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Custom OCR Instructions
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="use-custom-prompt"
                      checked={useCustomPrompt}
                      onChange={(e) => setUseCustomPrompt(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="use-custom-prompt" className="text-sm">
                      Use custom instructions
                    </Label>
                  </div>
                  {useCustomPrompt && (
                    <Input
                      placeholder="e.g., 'Extract only highlighted text' or 'Focus on handwritten notes'"
                      value={ocrPrompt}
                      onChange={(e) => setOcrPrompt(e.target.value)}
                      className="text-sm"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {useCustomPrompt 
                    ? "Custom instructions will be used for new uploads" 
                    : "Default: Extract all text accurately, maintaining structure and formatting"
                  }
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
          touch-manipulation
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <svg
            className={`w-10 h-10 sm:w-12 sm:h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
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
            <p className="text-blue-600 font-medium text-sm sm:text-base">Drop the images here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-medium">Tap to upload</span> or drag and drop
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                JPEG or PNG files only • Max 5MB per file
              </p>
              <p className="text-xs text-blue-600">
                Text will be automatically extracted using AI
                {useCustomPrompt && ocrPrompt && (
                  <span className="block mt-1 text-yellow-600">
                    Using custom instructions: "{ocrPrompt.substring(0, 50)}{ocrPrompt.length > 50 ? '...' : ''}"
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
            Uploaded Images ({uploadedFiles.length})
          </h3>
          <div className="space-y-4 sm:space-y-6">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 p-3 sm:p-4">
                  {/* Image Preview */}
                  <div className="relative">
                    <div className="aspect-video relative">
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 transition-colors touch-manipulation"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                  </div>

                  {/* Extracted Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Extracted Text</h4>
                      <div className="flex items-center gap-2">
                        {uploadedFile.confidence && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                            {Math.round(uploadedFile.confidence * 100)}% confidence
                          </span>
                        )}
                        {!uploadedFile.isProcessing && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs gap-1"
                              >
                                <Sparkles className="h-3 w-3" />
                                Reprocess
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" side="bottom" align="end">
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    Custom OCR Instructions
                                  </Label>
                                  <Input
                                    placeholder="e.g., 'Extract only highlighted text'"
                                    className="text-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        const input = e.target as HTMLInputElement
                                        reprocessFile(uploadedFile.id, input.value || undefined)
                                        input.value = ''
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-gray-500">
                                    Leave empty for default extraction. Press Enter to reprocess.
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => reprocessFile(uploadedFile.id)}
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    Default Extract
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                    
                    {uploadedFile.isProcessing ? (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Processing with AI...</span>
                      </div>
                    ) : uploadedFile.extractedText ? (
                      <div className="bg-gray-50 p-3 rounded border max-h-40 sm:max-h-48 overflow-y-auto">
                        <pre className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-mono">
                          {uploadedFile.extractedText}
                        </pre>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-3 rounded border">
                        <p className="text-sm text-yellow-800">
                          No text extracted. The image might not contain readable text.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 