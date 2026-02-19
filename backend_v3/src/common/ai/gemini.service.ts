import { Injectable } from '@nestjs/common';
import { FunctionCall, GoogleGenAI, Tool } from '@google/genai';

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

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall: FunctionCall = response.functionCalls[0];
      const toolResponse = await tools
        ?.find((tool) => tool.toolDef.name === functionCall.name)
        ?.execute(functionCall.args);
      console.log('Tool Response', toolResponse);
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      const functionResponsePart = {
        name: functionCall.name,
        response: toolResponse,
      };
      const toolResponseMessage = {
        role: 'user',
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      };
      console.log(response.candidates?.[0].content);
      const updatedChatHistory = [...userPrompt, toolResponseMessage];
      return await this.generate(
        updatedChatHistory,
        systemPrompt,
        undefined,
        tools,
      );
    }

    return response.text;
  }
}
