import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { GeminiService } from 'src/common/ai/gemini.service';
import { PrismaService } from 'src/prisma.service';
import { chatBotPrompt } from 'src/common/ai/system-prompts';

@Injectable()
export class ChatBotService {
  constructor(private readonly geminiService: GeminiService, private readonly prismaService: PrismaService) { }

  async generate(dto: CreateChatDto) {
    const userQuery = dto.chats[dto.chats.length - 1].content;

    const userQueryEmbedding = await this.geminiService.createEmbedding(userQuery);

    const vectorString = `[${userQueryEmbedding!.join(',')}]`;
    const results: { objectiveId: string, distance: number }[] = await this.prismaService.$queryRawUnsafe(
      `
      SELECT "objectiveId",
            embedding <=> $1::vector AS distance
      FROM "OkrEmbedding" 
      WHERE embedding <=> $1::vector < 0.5
      ORDER BY distance
      LIMIT 5
      `,
      vectorString
    );
    console.log(results);

    const retrievedOkrs = await this.prismaService.objective.findMany({
      where: {
        id: {
          in: results.map(r => r.objectiveId),
        },
      },
      include:{
        keyResults:true
      }
    });

      




   
    const systemPrompt=chatBotPrompt;
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

            ${JSON.stringify(this.convert(retrievedOkrs), null, 2)}

            Please calculate the overall progress and return a structured response.`
          }
        ]
      }
    ];
    return this.geminiService.generate(contents, systemPrompt);
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
