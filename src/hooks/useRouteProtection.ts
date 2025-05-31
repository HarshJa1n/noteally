import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

interface UseRouteProtectionOptions {
  redirectTo?: string
  allowAnonymous?: boolean
  requireEmailAuth?: boolean
}

export function useRouteProtection(options: UseRouteProtectionOptions = {}) {
  const {
    redirectTo = '/auth',
    allowAnonymous = false,
    requireEmailAuth = false
  } = options
  
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (loading) return

    // If not authenticated at all, redirect to auth
    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // If authenticated but anonymous access not allowed and user is anonymous
    if (!allowAnonymous && user?.isAnonymous) {
      router.push(redirectTo)
      return
    }

    // If email auth required but user is anonymous
    if (requireEmailAuth && user?.isAnonymous) {
      router.push(redirectTo)
      return
    }
  }, [user, loading, isAuthenticated, router, redirectTo, allowAnonymous, requireEmailAuth])

  return {
    user,
    loading,
    isAuthenticated,
    isProtected: !loading && (
      !isAuthenticated || 
      (!allowAnonymous && user?.isAnonymous) ||
      (requireEmailAuth && user?.isAnonymous)
    )
  }
} 