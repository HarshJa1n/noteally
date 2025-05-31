'use client'

import { ReactNode } from 'react'
import { useRouteProtection } from '@/hooks/useRouteProtection'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
  allowAnonymous?: boolean
  requireEmailAuth?: boolean
  loadingComponent?: ReactNode
}

export default function ProtectedRoute({
  children,
  redirectTo = '/auth',
  allowAnonymous = true, // Default to allow anonymous for notes access
  requireEmailAuth = false,
  loadingComponent
}: ProtectedRouteProps) {
  const { loading, isProtected } = useRouteProtection({
    redirectTo,
    allowAnonymous,
    requireEmailAuth
  })

  // Show loading state while checking authentication
  if (loading) {
    return (
      loadingComponent || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      )
    )
  }

  // If the route is protected (user should be redirected), show nothing
  // The useRouteProtection hook will handle the redirect
  if (isProtected) {
    return null
  }

  // Render the protected content
  return <>{children}</>
} 