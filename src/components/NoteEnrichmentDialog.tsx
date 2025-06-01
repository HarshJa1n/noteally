'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Sparkles, Clock, Target } from 'lucide-react'
import { Note } from '@/types/note'
import { NoteEnrichmentResult } from '@/hooks/useNoteEnrichment'

interface NoteEnrichmentDialogProps {
  isOpen: boolean
  onClose: () => void
  note: Note
  enrichmentResult: NoteEnrichmentResult
  onApply: (updates: Partial<Note>) => Promise<void>
  isApplying?: boolean
}

export default function NoteEnrichmentDialog({
  isOpen,
  onClose,
  note,
  enrichmentResult,
  onApply,
  isApplying = false
}: NoteEnrichmentDialogProps) {
  const [editableTitle, setEditableTitle] = useState(enrichmentResult.title)
  const [editableTags, setEditableTags] = useState<string[]>(enrichmentResult.tags)
  const [editableCategories, setEditableCategories] = useState<string[]>(enrichmentResult.categories)
  const [newTag, setNewTag] = useState('')
  const [newCategory, setNewCategory] = useState('')

  const handleAddTag = () => {
    if (newTag.trim() && !editableTags.includes(newTag.trim().toLowerCase())) {
      setEditableTags([...editableTags, newTag.trim().toLowerCase()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditableTags(editableTags.filter(tag => tag !== tagToRemove))
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !editableCategories.includes(newCategory.trim().toLowerCase())) {
      setEditableCategories([...editableCategories, newCategory.trim().toLowerCase()])
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    setEditableCategories(editableCategories.filter(cat => cat !== categoryToRemove))
  }

  const handleApply = async () => {
    await onApply({
      title: editableTitle,
      tags: editableTags,
      categories: editableCategories,
    })
  }

  const confidenceColor = enrichmentResult.confidence >= 0.8 
    ? 'text-green-600' 
    : enrichmentResult.confidence >= 0.6 
    ? 'text-yellow-600' 
    : 'text-red-600'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Note Enhancement Results
          </DialogTitle>
          <DialogDescription>
            Review and customize the AI-generated suggestions for your note.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Confidence and processing time */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Confidence:</span>
              <span className={`font-medium ${confidenceColor}`}>
                {Math.round(enrichmentResult.confidence * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {enrichmentResult.processingTime}ms
            </div>
          </div>

          {/* Summary */}
          <div>
            <Label className="text-sm font-medium text-gray-700">AI Summary</Label>
            <p className="mt-1 text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
              {enrichmentResult.summary}
            </p>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Enhanced Title
            </Label>
            <div className="mt-1 space-y-2">
              <Input
                id="title"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full"
              />
              {note.title !== enrichmentResult.title && (
                <p className="text-xs text-gray-500">
                  Original: <span className="italic">{note.title}</span>
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Enhanced Tags</Label>
            <div className="mt-2 space-y-3">
              <div className="flex flex-wrap gap-2">
                {editableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <XCircle className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm" variant="outline">
                  Add
                </Button>
              </div>
              {note.tags.length > 0 && (
                <p className="text-xs text-gray-500">
                  Original tags: {note.tags.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Enhanced Categories</Label>
            <div className="mt-2 space-y-3">
              <div className="flex flex-wrap gap-2">
                {editableCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    {category}
                    <XCircle className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button onClick={handleAddCategory} size="sm" variant="outline">
                  Add
                </Button>
              </div>
              {note.categories.length > 0 && (
                <p className="text-xs text-gray-500">
                  Original categories: {note.categories.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isApplying}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={isApplying}
            className="flex items-center gap-2"
          >
            {isApplying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                Applying...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Apply Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 