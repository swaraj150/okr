import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { GeminiService } from 'src/common/ai/gemini.service';
import { PrismaService } from 'src/prisma.service';
import { chatBotPrompt } from 'src/common/ai/system-prompts';
import { Type } from '@google/genai';
import { ObjectiveService } from '../objective/objective.service';

@Injectable()
export class ChatBotService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly prismaService: PrismaService,
    private readonly objectiveService: ObjectiveService,
  ) {}

  async generate(dto: CreateChatDto) {
    const userQuery = dto.chats[dto.chats.length - 1].content;

    const userQueryEmbedding =
      await this.geminiService.createEmbedding(userQuery);

    const vectorString = `[${userQueryEmbedding!.join(',')}]`;
    const results: { objectiveId: string; distance: number }[] =
      await this.prismaService.$queryRawUnsafe(
        `
      SELECT "objectiveId",
            embedding <=> $1::vector AS distance
      FROM "OkrEmbedding" 
      WHERE embedding <=> $1::vector < 0.5
      ORDER BY distance
      LIMIT 5
      `,
        vectorString,
      );
    console.log(results);

    const retrievedOkrs = await this.prismaService.objective.findMany({
      where: {
        id: {
          in: results.map((r) => r.objectiveId),
        },
      },
      include: {
        keyResults: true,
      },
    });

    const createOkrDeclaration = {
      name: 'create_okr',
      description: "Create a new OKR based on the user'\s input.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: {
            type: Type.STRING,
            description: 'The user query that describes the OKR to be created.',
          },
        },
        required: ['query'],
      },
    };

    const systemPrompt = chatBotPrompt;

    const contents = [
      ...dto.chats.map((chat) => ({
        role: chat.role.toLowerCase() === 'ai' ? 'model' : 'user',
        parts: [{ text: chat.content }],
      })),

      {
        role: 'user',
        parts: [
          {
            text: `
            Here are my OKRs in JSON format:

            ${JSON.stringify(this.convert(retrievedOkrs), null, 2)}

            Please calculate the overall progress and return a structured response.`,
          },
        ],
      },
    ];
    return this.geminiService.generate(contents, systemPrompt, undefined, [
      {
        toolDef: createOkrDeclaration,
        execute: (args) => this.objectiveService.generate(args.query),
      },
    ]);
  }

  private convert(data: any) {
    return data.map((item) => {
      return {
        objective: {
          title: item.title,
          progress: item.progress,
        },
        keyResults: item.keyResults.map((kr) => {
          return {
            description: kr.description,
            progress: kr.currentValue,
            target: kr.targetValue,
            metric: kr.metricType,
          };
        }),
      };
    });
  }
}
