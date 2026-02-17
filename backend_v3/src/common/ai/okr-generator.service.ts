import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { SchemaType } from '@google/generative-ai';

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

const okrSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    keyResults: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          descritpion: {
            type: 'string',
          },
        },
        propertyOrdering: ['descritpion'],
      },
    },
  },
  propertyOrdering: ['title', 'keyResults'],
};
export class OkrGeneratorService {
  private ai: any;
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  async generate(prompt: string) {
//     const customprompt = `
// You are a JSON generator.
// Your task is to convert the user's input into a valid JSON object .
// Rules:
// Output ONLY valid JSON.
// Do NOT include explanations, markdown, comments, or extra text.
// The "title" must summarize the main objective.
// Extract measurable or actionable sub-points as "keyResults".
// If no key results are mentioned, then you can add 2 most important key results related to the title.
// Always return both fields: "title" and "keyResults".
// Ensure JSON is syntactically valid.

// User Input:
// ${prompt}
// `;
    const systemPrompt=` You are a deterministic JSON generator for an OKR system. Convert natural language into a single structured JSON object matching the schema:
    { "title": String, "keyResults": [{ "description": String, "currentValue": Int, "targetValue": Int, "metricType": String }] }
    Input:
    A natural-language statement describing an Objective and optionally Key Results.
    Output:
    Return ONLY valid JSON.
    No markdown, no explanations, no extra text.
    All numeric fields must be integers.
    Rules:
    Extract the main goal as "title".
    Extract all provided Key Results. If none are provided, generate exactly 1 measurable Key Result.
    currentValue defaults to 0 unless a starting value is given.
    Extract numeric targets; if missing infer: percentage=100, boolean=1, count=1, currency=1.
    metricType selection:
    • currency → $, ₹, €, revenue, profit, MRR, ARR, sales
    • percentage → %, rate, churn, retention, accuracy
    • boolean → launch, ship, release, deploy, complete
    • otherwise → count
    Normalize: k=×1000, m=×1000000, round decimals, time treated as count.
    Examples:
    Input: "Increase revenue to $50k and close 10 deals."
    Output:
    {
    "title": "Increase revenue",
    "keyResults": [
    { "description": "Reach $50k in revenue", "currentValue": 0, "targetValue": 50000, "metricType": "currency" },
    { "description": "Close 10 deals", "currentValue": 0, "targetValue": 10, "metricType": "count" }
    ]
    }`

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:systemPrompt,
      },
      // generationConfig: {
      //   responseMimeType: 'application/json',
      //   responseJsonSchema: {
      //     type: 'OBJECT',
      //     properties: {
      //       title: {
      //         type: 'STRING',
      //       },
      //       keyResults: {
      //         type: 'ARRAY',
      //         items: {
      //           type: 'OBJECT',
      //           properties: {
      //             description: {
      //               type: "STRING"
      //             },
      //             currentValue: {
      //               type: "INTEGER"
      //             },
      //             targetValue: {
      //               type: "INTEGER"
      //             },
      //             metricType: {
      //               type: "STRING",
      //               description: "The unit of measurement.",
      //               enum: ["currency", "count", "percentage", "boolean", "other"]
      //             }
      //           },
      //           propertyOrdering: ["description", "currentValue", "targetValue", "metricType"],
      //         },
      //       },
      //     },
      //     propertyOrdering: ['title', 'keyResults'],
      //   },

      //   temperature: 0.2,
      // },
    });
    return response.text;
  }
}
