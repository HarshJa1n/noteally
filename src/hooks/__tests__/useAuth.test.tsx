import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { AuthProvider } from '@/providers/AuthProvider'
import { AuthService } from '@/services/authService'

// Mock AuthService
jest.mock('@/services/authService')

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with null user and loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('signs in with email successfully', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' }
    ;(AuthService.signInWithEmail as jest.Mock).mockResolvedValue(mockUser)
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.signInWithEmail('test@example.com', 'password')
    })
    
    expect(AuthService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password')
  })

  it('signs up with email successfully', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' }
    ;(AuthService.signUpWithEmail as jest.Mock).mockResolvedValue(mockUser)
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.signUpWithEmail('test@example.com', 'password')
    })
    
    expect(AuthService.signUpWithEmail).toHaveBeenCalledWith('test@example.com', 'password', undefined)
  })

  it('signs in with Google successfully', async () => {
    const mockUser = { uid: '123', email: 'test@gmail.com' }
    ;(AuthService.signInWithGoogle as jest.Mock).mockResolvedValue(mockUser)
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.signInWithGoogle()
    })
    
    expect(AuthService.signInWithGoogle).toHaveBeenCalled()
  })

  it('signs out successfully', async () => {
    ;(AuthService.signOut as jest.Mock).mockResolvedValue(undefined)
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.signOut()
    })
    
    expect(AuthService.signOut).toHaveBeenCalled()
  })

  it('handles authentication errors', async () => {
    const error = new Error('Authentication failed')
    ;(AuthService.signInWithEmail as jest.Mock).mockRejectedValue(error)
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      try {
        await result.current.signInWithEmail('test@example.com', 'wrongpassword')
      } catch (e) {
        expect(e).toBe(error)
      }
    })
    
    expect(AuthService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'wrongpassword')
  })
}) 