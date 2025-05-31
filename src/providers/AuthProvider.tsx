'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthService, AuthUser } from '@/services/authService'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInAnonymously: () => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const clearError = () => setError(null)

  const handleAuthAction = async (action: () => Promise<AuthUser | void>) => {
    try {
      setError(null)
      setLoading(true)
      await action()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    await handleAuthAction(() => AuthService.signInWithEmail(email, password))
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    await handleAuthAction(() => AuthService.signUpWithEmail(email, password, displayName))
  }

  const signInWithGoogle = async () => {
    await handleAuthAction(() => AuthService.signInWithGoogle())
  }

  const signInAnonymously = async () => {
    await handleAuthAction(() => AuthService.signInAnonymously())
  }

  const signOut = async () => {
    await handleAuthAction(() => AuthService.signOut())
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAnonymously,
    signOut,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 