import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateKeyResultDto,
  UpdateCurrentValueDto,
  UpdateKeyResultDto,
} from './dto/key-result.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class KeyResultService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createKeyResultDto: CreateKeyResultDto) {
    return this.prismaService.keyResult.create({
      data: {
        description: createKeyResultDto.description,
        currentValue: createKeyResultDto.currentValue,
        targetValue: createKeyResultDto.targetValue,
        metricType: createKeyResultDto.metricType,
        objectiveId: createKeyResultDto.objectiveId,
      },
    });
  }
  getOneById(id: string) {
    return this.prismaService.keyResult.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(dto: UpdateKeyResultDto) {
    const { id, ...data } = dto;
    await this.prismaService.keyResult.update({
      where: { id },
      data,
    });
    if (dto.currentValue) {
      this.eventEmitter.emit('update_completeness', {
        objectiveId: dto.objectiveId,
      });
    }
  }

  delete(id: string) {
    return this.prismaService.keyResult.delete({ where: { id } });
  }

  async updateCurrentValue(updateCurrentValueDto: UpdateCurrentValueDto) {
    await this.prismaService.keyResult.update({
      where: {
        id: updateCurrentValueDto.id,
      },
      data: {
        currentValue: updateCurrentValueDto.currentValue,
      },
    });

    this.eventEmitter.emit('update_completeness', {
      objectiveId: updateCurrentValueDto.objectiveId,
    });
  }
}
