import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateKeyResultDto,
  DeleteKeyResultsDto,
  UpdateCurrentValueDto,
  UpdateKeyResultDto,
} from './dto/key-result.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

type OkrIdType={keyResultId:string;objectiveId:string}
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
  getOneById(okrIds:OkrIdType) {
    return this.prismaService.keyResult.findUnique({
      where: {
        id: okrIds.keyResultId,
      },
    });
  }

  async update(dto: UpdateKeyResultDto,okrIds:OkrIdType) {
    const { ...data } = dto;
    await this.prismaService.keyResult.update({
      where: { id:okrIds.keyResultId },
      data,
    });
    if (dto.currentValue) {
      this.eventEmitter.emit('update_completeness', {
        objectiveId: okrIds.objectiveId,
      });
    }
  }

  delete(okrIds:OkrIdType) {
    return this.prismaService.keyResult.delete({ where: { id:okrIds.keyResultId } });
  }

  async updateCurrentValue(updateCurrentValueDto: UpdateCurrentValueDto,okrIds:OkrIdType) {
    await this.prismaService.keyResult.update({
      where: {
        id: okrIds.keyResultId,
      },
      data: {
        currentValue: updateCurrentValueDto.currentValue,
      },
    });

    await this.eventEmitter.emitAsync('update_completeness', {
      objectiveId: okrIds.objectiveId,
    });
  }

  deleteAll(deleteKeyResultsDto: DeleteKeyResultsDto,okrIds:OkrIdType) {
    return this.prismaService.keyResult.deleteMany({
      where: {
        id: {
          in: deleteKeyResultsDto.keyResultsToDelete,
        },
        objectiveId: okrIds.objectiveId,
      },
    });
  }
}
