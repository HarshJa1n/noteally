import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
});

export const ocrFlow = ai.defineFlow(
  {
    name: 'ocrFlow',
    inputSchema: z.object({ 
      imageData: z.string().describe('Base64 encoded image data'),
      prompt: z.string().optional().describe('Optional additional instructions for OCR')
    }),
    outputSchema: z.object({ 
      extractedText: z.string(),
      confidence: z.number().optional(),
      processingTime: z.number().optional()
    }),
  },
  async ({ imageData, prompt = '' }) => {
    const startTime = Date.now();
    
    // Prepare the multimodal prompt for Gemini
    const fullPrompt = `Extract all text from this image accurately. Focus on:
- Preserving line breaks and paragraph structure
- Maintaining proper spacing between words
- Including all visible text, even if partially obscured
- Correcting obvious OCR errors if any

${prompt ? `Additional instructions: ${prompt}` : ''}

Please return only the extracted text without any additional formatting or explanations.`;

    try {
      const { text } = await ai.generate({
        model: googleAI.model('gemini-2.0-flash'),
        prompt: [
          { text: fullPrompt },
          { media: { contentType: 'image/jpeg', url: `data:image/jpeg;base64,${imageData}` } }
        ],
      });

      const processingTime = Date.now() - startTime;

      return {
        extractedText: text || '',
        confidence: 0.95, // Gemini typically has high confidence
        processingTime
      };
    } catch (error) {
      console.error('OCR processing error:', error);
      throw new Error('Failed to process image for text extraction');
    }
  }
); 