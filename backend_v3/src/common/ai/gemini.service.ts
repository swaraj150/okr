// gemini.service.ts

import { Injectable } from '@nestjs/common';
import {
  FunctionCall,
  GoogleGenAI,
  ToolListUnion,
  ToolUnion,
} from '@google/genai';
import { Tool } from '@google/genai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async createEmbedding(text: string) {
    const result = await this.genAI.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
    });

    return result.embeddings?.[0]?.values;
  }

  async generate(
    userPrompt: any,
    systemPrompt: string,
    schema?: any,
    tools?: {
      toolDef: NonNullable<Tool['functionDeclarations']>[number];
      execute: (args: any) => Promise<any>;
    }[],
  ) {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        ...(schema && {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }),
        ...(tools && {
          tools: [
            {
              functionDeclarations: tools.map((tool) => tool.toolDef),
            },
          ],
        }),
      },
    });

    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall: FunctionCall = response.functionCalls[0]; // Assuming one function call

      tools
        ?.find((tool) => tool.toolDef.name === functionCall.name)
        ?.execute(functionCall.args);

      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      // In a real app, you would call your actual function here:
      // const result = await getCurrentTemperature(functionCall.args);
    } else {
      console.log('No function call found in the response.');
      console.log(response.text);
    }

    return response.text;
  }
}
