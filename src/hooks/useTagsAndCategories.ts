import { useState, useEffect } from 'react'
import { FirestoreService } from '@/services/firestoreService'
import { Tag, Category } from '@/types/note'
import { useAuth } from '@/hooks/useAuth'

interface UseTagsAndCategoriesReturn {
  tags: Tag[]
  categories: Category[]
  loading: boolean
  error: string | null
  createTag: (name: string, color?: string) => Promise<void>
  createCategory: (name: string, color?: string) => Promise<void>
  updateTag: (tagId: string, updates: Partial<Tag>) => Promise<void>
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>
  deleteTag: (tagId: string) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  getTagSuggestions: () => string[]
  getCategorySuggestions: () => string[]
  clearError: () => void
}

export function useTagsAndCategories(): UseTagsAndCategoriesReturn {
  const { user } = useAuth()
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTags([])
      setCategories([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Set up real-time listeners
    const unsubscribeTags = FirestoreService.subscribeToTags(user.uid, (newTags) => {
      setTags(newTags)
      setLoading(false)
    })

    const unsubscribeCategories = FirestoreService.subscribeToCategories(user.uid, (newCategories) => {
      setCategories(newCategories)
      setLoading(false)
    })

    return () => {
      unsubscribeTags()
      unsubscribeCategories()
    }
  }, [user])

  const clearError = () => setError(null)

  const handleAsyncAction = async (action: () => Promise<void>) => {
    try {
      setError(null)
      await action()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const createTag = async (name: string, color: string = '#3B82F6') => {
    if (!user) throw new Error('User not authenticated')
    
    await handleAsyncAction(async () => {
      await FirestoreService.createTag(user.uid, {
        name,
        color,
        usageCount: 0
      })
    })
  }

  const createCategory = async (name: string, color: string = '#8B5CF6') => {
    if (!user) throw new Error('User not authenticated')
    
    await handleAsyncAction(async () => {
      await FirestoreService.createCategory(user.uid, {
        name,
        color,
        usageCount: 0
      })
    })
  }

  const updateTag = async (tagId: string, updates: Partial<Tag>) => {
    if (!user) throw new Error('User not authenticated')
    
    await handleAsyncAction(async () => {
      await FirestoreService.updateTag(tagId, user.uid, updates)
    })
  }

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    if (!user) throw new Error('User not authenticated')
    
    await handleAsyncAction(async () => {
      await FirestoreService.updateCategory(categoryId, user.uid, updates)
    })
  }

  const deleteTag = async (tagId: string) => {
    if (!user) throw new Error('User not authenticated')
    
    await handleAsyncAction(async () => {
      await FirestoreService.deleteTag(tagId, user.uid)
    })
  }

  const deleteCategory = async (categoryId: string) => {
    if (!user) throw new Error('User not authenticated')
    
    await handleAsyncAction(async () => {
      await FirestoreService.deleteCategory(categoryId, user.uid)
    })
  }

  const getTagSuggestions = (): string[] => {
    return tags
      .sort((a, b) => b.usageCount - a.usageCount)
      .map(tag => tag.name)
  }

  const getCategorySuggestions = (): string[] => {
    return categories
      .sort((a, b) => b.usageCount - a.usageCount)
      .map(category => category.name)
  }

  return {
    tags,
    categories,
    loading,
    error,
    createTag,
    createCategory,
    updateTag,
    updateCategory,
    deleteTag,
    deleteCategory,
    getTagSuggestions,
    getCategorySuggestions,
    clearError
  }
} 