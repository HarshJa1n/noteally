'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { FirestoreService } from '@/services/firestoreService'
import { Note } from '@/types/note'
import Link from 'next/link'
import { FileText, Plus, Search, Calendar, Tag, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotesPage() {
  const { user, isAuthenticated, signInAnonymously, loading: authLoading } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  // Initialize user session if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      signInAnonymously()
        .then(() => {
          setAuthError(null)
          setRetryCount(0)
        })
        .catch((err) => {
          console.error('Anonymous sign in failed:', err)
          setAuthError(`Authentication failed: ${err.message}`)
        })
    }
  }, [authLoading, isAuthenticated, signInAnonymously])

  // Fetch notes when user is available
  useEffect(() => {
    if (user?.uid && isAuthenticated) {
      fetchNotes()
    }
  }, [user?.uid, isAuthenticated])

  const fetchNotes = async () => {
    if (!user?.uid) {
      setError('No user authenticated')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Attempting to fetch notes for user: ${user.uid}`)
      const fetchedNotes = await FirestoreService.getNotes(user.uid)
      setNotes(fetchedNotes)
      console.log(`Successfully fetched ${fetchedNotes.length} notes`)
      setRetryCount(0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notes'
      console.error('Error fetching notes:', err)
      
      // Handle specific Firebase errors
      if (errorMessage.includes('ADMIN_ONLY_OPERATION')) {
        setError('Database access denied. Please check your Firebase configuration and security rules.')
      } else if (errorMessage.includes('permission-denied')) {
        setError('Permission denied. Your account may not have proper access rights.')
      } else if (errorMessage.includes('unauthenticated')) {
        setError('Authentication expired. Please refresh the page.')
        setAuthError('Authentication expired')
      } else {
        setError(errorMessage)
      }
      
      setRetryCount(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryAuth = async () => {
    setAuthError(null)
    setError(null)
    try {
      await signInAnonymously()
    } catch (err) {
      console.error('Retry authentication failed:', err)
      setAuthError(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  const filteredNotes = notes.filter(note => 
    searchTerm === '' || 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Initializing your session...</p>
        </div>
      </div>
    )
  }

  // Authentication error state
  if (authError && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Authentication Issue</h1>
            <p className="text-gray-600">
              We're having trouble setting up your session. This might be due to Firebase configuration.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {authError}
            </div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={handleRetryAuth} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Authentication
            </Button>
            
            <Link href="/editor" className="block">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Use Editor Without Saving
              </Button>
            </Link>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>If this persists, check that:</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Anonymous authentication is enabled in Firebase</li>
              <li>Firestore security rules allow authenticated access</li>
              <li>Firebase configuration is correct</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Notes</h1>
                {user && (
                  <p className="text-sm text-gray-500">
                    {user.isAnonymous ? 'Anonymous Session' : user.email}
                  </p>
                )}
              </div>
            </div>
            <Link href="/editor">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error handling */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Error loading notes</p>
                <p className="text-sm mt-1">{error}</p>
                
                {retryCount > 2 && (
                  <div className="mt-3 text-xs bg-red-200 rounded p-2">
                    <p className="font-medium">Multiple retry attempts failed.</p>
                    <p>This might indicate a Firebase configuration issue:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Check Firebase Console for error logs</li>
                      <li>Verify Anonymous Auth is enabled</li>
                      <li>Check Firestore security rules</li>
                      <li>Ensure proper environment variables</li>
                    </ul>
                  </div>
                )}
                
                <div className="mt-3 space-x-2">
                  <Button 
                    onClick={fetchNotes} 
                    variant="outline" 
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-red-700 mr-2"></div>
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Try Again ({retryCount + 1})
                      </>
                    )}
                  </Button>
                  
                  <Link href="/editor">
                    <Button variant="outline" size="sm">
                      <FileText className="h-3 w-3 mr-2" />
                      Use Editor Anyway
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Loading your notes...</p>
            </div>
          </div>
        ) : filteredNotes.length === 0 && !error ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No notes match "${searchTerm}". Try a different search term.`
                : 'Start by creating your first note from a book photo or typing directly.'
              }
            </p>
            {!searchTerm && (
              <Link href="/editor">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Note
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Link key={note.id} href={`/editor?id=${note.id}`}>
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {note.excerpt || 'No preview available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {note.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{note.tags.length} tags</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        {notes.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {filteredNotes.length} of {notes.length} notes
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </div>
    </div>
  )
} 