import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CreateChatDto } from './dto/create-chat.dto';
import { ObjectiveService } from 'src/objective/objective.service';
import { GeminiService } from 'src/common/ai/gemini.service';

@Injectable()
export class ChatBotService {
  constructor(private readonly geminiService: GeminiService) {}

  async generate(dto: CreateChatDto) {
    const data = []
    const promptData = this.convert(data);

    const systemPrompt = `
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

    - Generate response so that it looks good in chats
    
    Behavior rules:

    - If the user asks to create or update OKRs, describe the proposed objective and key results in bullets (not JSON).

    - If the user asks for analysis, summarize progress and highlight gaps in bullets.

    - If the user asks a general question, answer briefly and offer a next step related to OKRs.


  
      Do not:

      - Return JSON.l̥

      - Repeat the full OKR input unless asked.`;
    const contents = [
      ...dto.chats.map(chat => ({
        role: chat.role.toLowerCase() === "ai" ? "model" : "user",
        parts: [{ text: chat.content }]
      })),

      {
        role: "user",
        parts: [
          {
            text: `
            Here are my OKRs in JSON format:

            ${JSON.stringify(promptData, null, 2)}

            Please calculate the overall progress and return a structured response.`
          }
        ]
      }
    ];
    const response = await this.geminiService.generate(contents, systemPrompt);
  }


  private convert(data: any) {
    return data.map((item) => {
      return {
        objective: {
          title: item.title,
          progress: item.progress
        },
        keyResults: item.keyResults.map((kr) => {
          return { description: kr.description, progress: kr.currentValue, target: kr.targetValue, metric: kr.metricType }
        })

      }
    })
  }
}
