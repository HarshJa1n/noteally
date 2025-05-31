export interface Note {
  id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  categories: string[]
  createdAt: Date
  updatedAt: Date
  extractedText?: string
  originalImage?: string
  ocrConfidence?: number
}

export interface Tag {
  id: string
  name: string
  color: string
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  usageCount: number
  createdAt: Date
  updatedAt: Date
} 