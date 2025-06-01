import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
});

const OCROutputSchema = z.object({
  extractedText: z.string(),
  confidence: z.number(),
  processingTime: z.number()
});

export const ocrFlow = ai.defineFlow(
  {
    name: 'ocrFlow',
    inputSchema: z.object({ 
      imageData: z.string().describe('Base64 encoded image data'),
      prompt: z.string().optional().describe('Optional additional instructions for OCR')
    }),
    outputSchema: OCROutputSchema,
  },
  async ({ imageData, prompt = '' }) => {
    const startTime = Date.now();
    
    // Prepare the multimodal prompt for Gemini
    const fullPrompt = `Extract all visible text from this image as accurately as possible. By default:
    - Preserve line breaks and paragraph structure
    - Maintain proper spacing between words
    - Include all legible text, even if partially obscured
    - Correct clear OCR errors where appropriate
    
    ${
      prompt
        ? `The user has provided specific instructions. Follow them carefully:\n"${prompt}"`
        : "If no specific instructions are given, just return the plain extracted text."
    }
    
    Also provide a confidence score between 0 and 1 indicating how confident you are in the accuracy of the extracted text.
    
    Respond with text only. Do not add explanations or formatting beyond what the user asked for.`;
    try {
      const { output } = await ai.generate({
        model: googleAI.model('gemini-2.0-flash'),
        prompt: [
          { text: fullPrompt },
          { media: { contentType: 'image/jpeg', url: `data:image/jpeg;base64,${imageData}` } }
        ],
        output: { schema: OCROutputSchema }
      });

      if (output == null) {
        throw new Error("Response doesn't satisfy schema.");
      }

      return {
        ...output,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('OCR processing error:', error);
      throw new Error('Failed to process image for text extraction');
    }
  }
); 