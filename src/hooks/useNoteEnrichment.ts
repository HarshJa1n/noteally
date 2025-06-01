import { useState } from 'react';
import { Note } from '@/types/note';

export interface NoteEnrichmentResult {
  title: string;
  tags: string[];
  categories: string[];
  confidence: number;
  summary: string;
  processingTime: number;
}

interface UseNoteEnrichmentReturn {
  enrichNote: (note: Note) => Promise<NoteEnrichmentResult | null>;
  isEnriching: boolean;
  enrichmentError: string | null;
  lastEnrichmentResult: NoteEnrichmentResult | null;
  clearError: () => void;
}

export function useNoteEnrichment(): UseNoteEnrichmentReturn {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);
  const [lastEnrichmentResult, setLastEnrichmentResult] = useState<NoteEnrichmentResult | null>(null);

  const enrichNote = async (note: Note): Promise<NoteEnrichmentResult | null> => {
    if (!note.content || note.content.trim().length === 0) {
      setEnrichmentError('Note content is empty or invalid');
      return null;
    }

    setIsEnriching(true);
    setEnrichmentError(null);

    try {
      const response = await fetch('/api/enrich-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: note.content,
          currentTitle: note.title,
          currentTags: note.tags,
          currentCategories: note.categories,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Enrichment failed');
      }

      setLastEnrichmentResult(result.data);
      return result.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setEnrichmentError(errorMessage);
      console.error('Note enrichment error:', error);
      return null;
    } finally {
      setIsEnriching(false);
    }
  };

  const clearError = () => {
    setEnrichmentError(null);
  };

  return {
    enrichNote,
    isEnriching,
    enrichmentError,
    lastEnrichmentResult,
    clearError,
  };
} 