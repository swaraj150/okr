import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateObjectiveDto, UpdateObjectiveDto } from './dto/objective.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { Injector } from '@nestjs/core/injector/injector';
import { OkrGeneratorService } from '../common/ai/okr-generator.service';
import { GeminiService } from 'src/common/ai/gemini.service';

@Injectable()
export class ObjectiveService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly okrGeneratorService: OkrGeneratorService,
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

  update(updateObjectiveDto: UpdateObjectiveDto) {
    return this.prismaService.objective.update({
      where: {
        id: updateObjectiveDto.id,
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
    console.log(completeness);
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
    const response = await this.okrGeneratorService.generate(prompt);
    console.log(response);
    const parsed: CreateObjectiveDto = JSON.parse(response);
    await this.create(parsed);
  }

  private checkIsCompleted(keyResults: any) {
    let sum = 0;

    for (const keyResult of keyResults) {
      console.log(`${keyResult.currentValue} and ${keyResult.targetValue}`);
      sum = sum + (keyResult.currentValue / keyResult.targetValue) * 100;
    }
    console.log(sum);
    const progress = keyResults.length === 0 ? 100 : sum / keyResults.length;
    console.log(sum / keyResults.length);
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
}
