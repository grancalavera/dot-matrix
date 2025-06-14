import { z } from 'zod';
import type { SymbolDescription } from '../symbol/model.js';

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001';

// Zod schemas for API response validation
const SymbolDataSchema = z.object({
  id: z.string(),
  data: z.array(z.boolean()).length(63), // 9x7 = 63 pixels
});

const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: SymbolDataSchema,
});

const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

type ApiResponse = z.infer<typeof ApiResponseSchema>;
type ApiError = z.infer<typeof ApiErrorSchema>;

export const predict = async (char: string): Promise<SymbolDescription> => {
  if (char.length !== 1) {
    throw new Error(`Invalid input: ${char}`);
  }

  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ character: char }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        const errorParseResult = ApiErrorSchema.safeParse(errorData);
        
        if (errorParseResult.success) {
          const error: ApiError = errorParseResult.data;
          throw new Error(error.message || error.error);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (jsonError) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const rawData = await response.json();
    
    // Validate response structure
    const parseResult = ApiResponseSchema.safeParse(rawData);
    if (!parseResult.success) {
      console.error('API response validation failed:', parseResult.error);
      throw new Error('Invalid response format from AI service');
    }
    
    const data: ApiResponse = parseResult.data;
    
    if (!data.success) {
      throw new Error('AI service returned unsuccessful response');
    }

    // Return validated data with correct type
    return data.data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('AI service is unavailable. Please ensure the server is running.');
    }
    throw error;
  }
};
