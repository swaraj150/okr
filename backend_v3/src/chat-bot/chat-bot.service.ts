import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatBotService {
  private ai: any;
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generate(dto:CreateChatDto){
      const systemPrompt=`
      You are an OKR chatbot inside an OKR app.
 
  You will receive:

  - A chat history as an array of { role, content } objects.

  - OKR data in JSON-like format, for example:

    {

      "objective": {"title":"Improve retention","progress":100},

      "keyResults": [

        { "description": "Reduce churn", "progress": 10, "target": 20, "metric": "%" }

      ]

    }
  
  Your job:

  - Use the latest user message as the primary request.

  - Use any provided OKR data as context.

  - Respond with a short, helpful answer about OKRs, progress, or next steps.
  
  Output format:

  - Return plain text only.

  - Use bullet points with "- " prefix.

  - No JSON, no code blocks, no markdown headings.

  - Keep it concise (3–7 bullets), unless the user asks for more detail.
  
  Behavior rules:

  - If the user asks to create or update OKRs, describe the proposed objective and key results in bullets (not JSON).

  - If the user asks for analysis, summarize progress and highlight gaps in bullets.

  - If the user asks a general question, answer briefly and offer a next step related to OKRs.
  
  Do not:

  - Return JSON.l̥

  - Repeat the full OKR input unless asked.`;
      const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents:[
    // Convert previous chats
    ...dto.chats.map(chat => ({
      role: chat.role.toLowerCase() === "ai" ? "model" : "user",
      parts: [{ text: chat.content }]
    })),

    // Send OKR data as structured JSON text
    {
      role: "user",
      parts: [
        {
          text: `
Here are my OKRs in JSON format:

${JSON.stringify(dto.data, null, 2)}

Please calculate the overall progress and return a structured response.
`
        }
      ]
    }
  ],
      config: {
        systemInstruction:systemPrompt,
      },
    });
    return response.text;
  }


  

  
  
}
