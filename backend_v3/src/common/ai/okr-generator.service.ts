import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { okrGeneratorPrompt } from './system-prompts';
import { GeminiService } from './gemini.service';

const metricTypeEnum = z.enum(['currency', 'count', 'percentage', 'boolean']);

export const KeyResultSchema = z.object({
  description: z.string().min(1),
  currentValue: z.number().int(),
  targetValue: z.number().int(),
  metricType: metricTypeEnum,
});

export const ObjectiveSchema = z.object({
  title: z.string().min(1),
  keyResults: z.array(KeyResultSchema).min(1),
});

export class OkrGeneratorService {
  
  constructor(private geminiService:GeminiService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  async generate(prompt: string) {
    console.log(`invoking okr generate method with prompt`, prompt);
    const systemPrompt = okrGeneratorPrompt;
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0,
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'OBJECT',
          required: ['title', 'keyResults'],
          properties: {
            title: {
              type: 'STRING',
            },
            keyResults: {
              type: 'ARRAY',
              minItems: 2,
              maxItems: 5,
              items: {
                type: 'OBJECT',
                required: [
                  'description',
                  'currentValue',
                  'targetValue',
                  'metricType',
                ],
                properties: {
                  description: {
                    type: 'STRING',
                  },
                  currentValue: {
                    type: 'INTEGER',
                  },
                  targetValue: {
                    type: 'INTEGER',
                  },
                  metricType: {
                    type: 'STRING',
                    enum: ['kg', 'INR', 'days', 'count', '%'],
                  },
                },
              },
            },
          },
        },
      },
    });
    return response.text;
  }
}
