import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
});

const NoteEnrichmentOutputSchema = z.object({
  title: z.string().describe('An improved, descriptive title for the note based on its content'),
  tags: z.array(z.string()).describe('3-8 relevant tags that categorize the content'),
  categories: z.array(z.string()).describe('1-3 high-level categories the note belongs to'),
  confidence: z.number().min(0).max(1).describe('Confidence score for the enrichment accuracy'),
  summary: z.string().describe('A brief 1-2 sentence summary of the note content'),
  processingTime: z.number()
});

export const enrichNoteFlow = ai.defineFlow(
  {
    name: 'enrichNoteFlow',
    inputSchema: z.object({ 
      content: z.string().describe('The note content to analyze and enrich (up to 2000 characters)'),
      currentTitle: z.string().optional().describe('Current title of the note'),
      currentTags: z.array(z.string()).optional().describe('Current tags assigned to the note'),
      currentCategories: z.array(z.string()).optional().describe('Current categories assigned to the note')
    }),
    outputSchema: NoteEnrichmentOutputSchema,
  },
  async ({ content, currentTitle, currentTags = [], currentCategories = [] }) => {
    const startTime = Date.now();
    
    // Truncate content to 2000 characters to manage API costs and context
    const truncatedContent = content.length > 2000 ? content.substring(0, 2000) + '...' : content;
    
    const enrichmentPrompt = `Analyze the following note content and provide improved metadata:

**Current Information:**
- Title: ${currentTitle || 'Untitled Note'}
- Existing Tags: ${currentTags.length > 0 ? currentTags.join(', ') : 'None'}
- Existing Categories: ${currentCategories.length > 0 ? currentCategories.join(', ') : 'None'}

**Note Content to Analyze:**
${truncatedContent}

**Instructions:**
1. **Title**: Generate a clear, descriptive title (max 60 characters) that captures the main topic or theme
2. **Tags**: Suggest 3-8 specific, actionable tags that would help with searching and organization
   - Use lowercase, hyphenated format (e.g., "machine-learning", "study-notes")
   - Focus on topics, concepts, subjects, and key themes
   - Include existing relevant tags if they're still appropriate
3. **Categories**: Suggest 1-3 broad, high-level categories
   - Examples: "academic", "research", "personal", "work", "literature", "science", "technology"
   - Keep categories general and reusable across multiple notes
4. **Summary**: Write a concise 1-2 sentence summary of the main content
5. **Confidence**: Rate your confidence in these suggestions (0.0-1.0)

Focus on creating metadata that will make this note easier to find, organize, and understand in the future.`;

    try {
      const { output } = await ai.generate({
        model: googleAI.model('gemini-2.0-flash'),
        prompt: enrichmentPrompt,
        output: { schema: NoteEnrichmentOutputSchema }
      });

      if (output == null) {
        throw new Error("Response doesn't satisfy schema.");
      }

      return {
        ...output,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Note enrichment processing error:', error);
      throw new Error('Failed to process note for enrichment');
    }
  }
); 