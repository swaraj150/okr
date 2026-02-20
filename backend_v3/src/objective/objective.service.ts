import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateObjectiveDto, UpdateObjectiveDto } from './dto/objective.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { GeminiService } from '../common/ai/gemini.service';
import { okrGeneratorPrompt } from 'src/common/ai/system-prompts';

@Injectable()
export class ObjectiveService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  getAll() {
    return this.prismaService.objective.findMany({
      include: {
        keyResults: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
  getOneById(id: string) {
    return this.prismaService.objective.findUnique({
      where: {
        id: id,
      },
      include: {
        keyResults: true,
      },
    });
  }
  delete(id: string) {
    return this.prismaService.objective.delete({ where: { id } });
  }
  async create(createObjectiveDto: CreateObjectiveDto) {
    const res = await this.prismaService.objective.create({
      data: {
        title: createObjectiveDto.title,
        isCompleted: createObjectiveDto.keyResults.length === 0,
        progress: createObjectiveDto.keyResults.length === 0 ? 100 : 0, // need attention here
        keyResults: {
          create: createObjectiveDto.keyResults.map((kr) => ({
            description: kr.description,
            currentValue: kr.currentValue,
            targetValue: kr.targetValue,
            metricType: kr.metricType,
          })),
        },
      },
      include: {
        keyResults: true,
      },
    });

    await this.createEmbedding(JSON.stringify(res), { objectiveId: res.id });
    return res;
  }

  update(updateObjectiveDto: UpdateObjectiveDto, id: string) {
    return this.prismaService.objective.update({
      where: {
        id: id,
      },
      data: {
        title: updateObjectiveDto.title,
      },
    });
  }

  @OnEvent('update_completeness')
  async updateCompleteness(payload: { objectiveId: string }) {
    const objective = await this.getOneById(payload.objectiveId);
    if (!objective) {
      throw new NotFoundException('Objective not found.');
    }
    const completeness = this.checkIsCompleted(objective.keyResults);

    await this.prismaService.objective.update({
      where: {
        id: payload.objectiveId,
      },
      data: {
        isCompleted: completeness.isCompleted,
        progress: completeness.progress,
      },
    });
  }

  async generate(prompt: string) {
    const response = await this.generateOkr(prompt);
    console.log(response);
    const parsed: CreateObjectiveDto = JSON.parse(response);
    return await this.create(parsed);
  }

  private checkIsCompleted(keyResults: any) {
    let sum = 0;
    for (const keyResult of keyResults) {
      sum = sum + (keyResult.currentValue / keyResult.targetValue) * 100;
    }
    const progress = keyResults.length === 0 ? 100 : sum / keyResults.length;
    return {
      progress: progress,
      isCompleted: progress === 100,
    };
  }
  async createEmbedding(okrText: string, metaData: { objectiveId: string }) {
    const embedding = await this.geminiService.createEmbedding(okrText);
    await this.prismaService.$executeRaw`
      INSERT INTO "OkrEmbedding" ("id", "objectiveId", "embedding")
      VALUES (
        gen_random_uuid(),
        ${metaData.objectiveId},
        ${`[${embedding!.join(',')}]`}::vector
      )
    `;
  }

  async generateOkr(prompt: string) {
    const systemPrompt = okrGeneratorPrompt;
    const schema = {
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
    };

    return await this.geminiService.generate(
      prompt,
      systemPrompt,
      schema,
      undefined,
    );
  }
}
