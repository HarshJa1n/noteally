'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { runFlow } from '@genkit-ai/next/client'
import { ocrFlow } from '@/genkit/ocrFlow'

interface CameraCaptureProps {
  onCapture?: (imageData: string) => void
  onTextExtracted?: (text: string, confidence?: number) => void
  className?: string
}

export default function CameraCapture({ 
  onCapture, 
  onTextExtracted, 
  className = '' 
}: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const startCamera = useCallback(async (deviceId?: string) => {
    setError('')
    setIsStreaming(false)
    
    try {
      console.log('Starting camera with deviceId:', deviceId)
      
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: deviceId ? undefined : 'environment'
        }
      }

      console.log('Requesting media with constraints:', constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Got media stream:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for the video to load metadata
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, starting stream')
          setIsStreaming(true)
          
          // Start the video playback
          videoRef.current?.play().catch((playError) => {
            console.error('Error playing video:', playError)
            setError('Failed to start video playback')
          })
        }
        
        // Handle video errors
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e)
          setError('Video playback error')
        }
      }
      
    } catch (err) {
      console.error('Error accessing camera:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions and try again.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera and try again.')
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application.')
        } else {
          setError(`Camera error: ${err.message}`)
        }
      } else {
        setError('Failed to access camera')
      }
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    
    // Stop the camera stream
    stopStream()

    // Notify parent component
    if (onCapture) {
      onCapture(imageData)
    }
  }, [isStreaming, stopStream, onCapture])

  const processWithOCR = useCallback(async () => {
    if (!capturedImage) return

    try {
      setIsProcessing(true)
      setError('')

      // Remove data URL prefix to get base64 string
      const base64 = capturedImage.split(',')[1]

      // Call the OCR flow
      const result = await runFlow<typeof ocrFlow>({
        url: '/api/ocr',
        input: { 
          imageData: base64,
          prompt: 'This is a camera capture of a book page. Please extract all text accurately, maintaining structure and formatting.' 
        },
      })

      // Notify parent component
      if (onTextExtracted) {
        onTextExtracted(result.extractedText, result.confidence)
      }

    } catch (error) {
      console.error('OCR processing failed:', error)
      setError('Failed to extract text from image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [capturedImage, onTextExtracted])

  const resetCapture = useCallback(() => {
    setCapturedImage(null)
    setError('')
    startCamera(selectedDeviceId)
  }, [startCamera, selectedDeviceId])

  // Initialize available devices
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput')
        setDevices(videoDevices)
        
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId)
        }
        
        console.log('Found video devices:', videoDevices)
      } catch (err) {
        console.error('Error enumerating devices:', err)
        setError('Failed to access camera devices')
      }
    }

    initializeDevices()
  }, [])

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Camera Controls */}
      {!isStreaming && !capturedImage && (
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center space-y-3">
            <Camera className="w-12 h-12 text-gray-400" />
            <p className="text-gray-600">Start your camera to capture book pages</p>
          </div>
          
          {devices.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Camera:</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  stopStream()
                  startCamera(e.target.value)
                }}
                value={selectedDeviceId}
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${devices.indexOf(device) + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <Button onClick={() => startCamera(selectedDeviceId)} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Camera Stream */}
      {isStreaming && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden min-h-[300px] flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-auto max-w-full max-h-[60vh] object-contain"
              playsInline
              muted
              autoPlay
              style={{ display: isStreaming ? 'block' : 'none' }}
            />
            
            {/* Loading indicator while camera is starting */}
            {isStreaming && !videoRef.current?.videoWidth && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p>Initializing camera...</p>
                </div>
              </div>
            )}
            
            {/* Capture Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <Button 
                onClick={capturePhoto}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 shadow-lg"
                disabled={!isStreaming}
              >
                <Camera className="w-6 h-6" />
              </Button>
              <Button 
                onClick={stopStream}
                variant="destructive"
                size="lg"
                className="rounded-full w-16 h-16 shadow-lg"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600">
            Position your book page within the frame and tap the camera button to capture
          </p>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full rounded-lg border"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={processWithOCR} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Extract Text'
              )}
            </Button>
            <Button 
              onClick={resetCapture}
              variant="outline"
              disabled={isProcessing}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
          </div>
        </div>
      )}

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 