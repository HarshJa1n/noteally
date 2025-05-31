'use client'

import { useState, useEffect } from 'react'
import CameraCapture from '@/components/CameraCapture'

export default function CameraTestPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [cameraInfo, setCameraInfo] = useState<any>({})

  useEffect(() => {
    // Check camera capabilities
    const checkCamera = async () => {
      const info: any = {
        hasMediaDevices: !!navigator.mediaDevices,
        hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        protocol: window.location.protocol,
        userAgent: navigator.userAgent,
        permissions: 'unknown'
      }

      try {
        if (navigator.mediaDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices()
          info.videoDevices = devices.filter(d => d.kind === 'videoinput').length
          
          // Try to get permission status
          if ('permissions' in navigator) {
            try {
              const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
              info.permissions = permission.state
            } catch (e) {
              info.permissions = 'query failed'
            }
          }
        }
      } catch (e) {
        info.error = e instanceof Error ? e.message : 'Unknown error'
      }

      setCameraInfo(info)
      addLog('Camera info gathered')
    }

    checkCamera()
  }, [])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleCapture = (imageData: string) => {
    addLog('Photo captured successfully!')
  }

  const handleTextExtracted = (text: string) => {
    addLog(`Text extracted: ${text.slice(0, 50)}...`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">📷 Camera Test Page</h1>
          <p className="text-gray-600 mb-6">
            This page helps diagnose camera issues. Use this to test if your camera is working properly.
          </p>

          {/* System Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Protocol:</strong> {cameraInfo.protocol} 
                {cameraInfo.protocol === 'https:' ? ' ✅' : ' ❌ (HTTPS required)'}
              </div>
              <div>
                <strong>Media Devices API:</strong> {cameraInfo.hasMediaDevices ? '✅ Available' : '❌ Not available'}
              </div>
              <div>
                <strong>getUserMedia:</strong> {cameraInfo.hasGetUserMedia ? '✅ Available' : '❌ Not available'}
              </div>
              <div>
                <strong>Video Devices:</strong> {cameraInfo.videoDevices ?? 'Unknown'}
              </div>
              <div>
                <strong>Camera Permission:</strong> {cameraInfo.permissions}
              </div>
              <div>
                <strong>Browser:</strong> {
                  cameraInfo.userAgent?.includes('Chrome') ? 'Chrome' :
                  cameraInfo.userAgent?.includes('Firefox') ? 'Firefox' :
                  cameraInfo.userAgent?.includes('Safari') ? 'Safari' :
                  'Other'
                }
              </div>
            </div>
            {cameraInfo.error && (
              <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded text-red-700">
                <strong>Error:</strong> {cameraInfo.error}
              </div>
            )}
          </div>

          {/* Camera Component */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Camera Test</h2>
            <CameraCapture 
              onCapture={handleCapture}
              onTextExtracted={handleTextExtracted}
            />
          </div>

          {/* Logs */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Activity Log</h2>
            <div className="max-h-40 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">No activity yet...</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono text-gray-700">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">🔧 Troubleshooting Steps</h2>
            <div className="space-y-2 text-sm text-blue-800">
              <div>1. Make sure you're using HTTPS (https://localhost:3000)</div>
              <div>2. Check browser permissions for camera access</div>
              <div>3. Close other applications that might be using the camera</div>
              <div>4. Try a different browser (Chrome recommended)</div>
              <div>5. Refresh the page after granting permissions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 