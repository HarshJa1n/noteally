'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus, Hash } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
  maxTags?: number
  disabled?: boolean
}

export default function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Add tags...',
  suggestions = [],
  maxTags = 10,
  disabled = false
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
    !tags.includes(suggestion)
  )

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (
      trimmedTag &&
      !tags.includes(trimmedTag) &&
      tags.length < maxTags
    ) {
      onTagsChange([...tags, trimmedTag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200)
  }

  useEffect(() => {
    if (inputValue && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }, [inputValue, suggestions.length])

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[2.5rem] bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            <Hash className="h-3 w-3" />
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        
        {!disabled && tags.length < maxTags && (
          <div className="flex-1 min-w-[120px] relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={tags.length === 0 ? placeholder : ''}
              className="border-none shadow-none focus-visible:ring-0 p-0 h-6"
            />
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Hash className="h-3 w-3 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {!disabled && inputValue && tags.length < maxTags && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => addTag(inputValue)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {tags.length >= maxTags && (
        <p className="text-xs text-orange-600">
          Maximum {maxTags} tags allowed
        </p>
      )}
      
      <p className="text-xs text-gray-500">
        Press Enter or comma to add tags. {tags.length}/{maxTags} tags used.
      </p>
    </div>
  )
} 