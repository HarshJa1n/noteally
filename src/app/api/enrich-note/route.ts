import { NextRequest, NextResponse } from 'next/server';
import { enrichNoteFlow } from '@/genkit/enrichNoteFlow';

export async function POST(req: NextRequest) {
  try {
    const { content, currentTitle, currentTags, currentCategories } = await req.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    // Call the Genkit flow for note enrichment
    const enrichmentResult = await enrichNoteFlow({
      content,
      currentTitle,
      currentTags: currentTags || [],
      currentCategories: currentCategories || []
    });

    return NextResponse.json({
      success: true,
      data: enrichmentResult
    });

  } catch (error) {
    console.error('Error in note enrichment API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to enrich note',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 