import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultService } from './key-result.service';
import { PrismaService } from '../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('KeyResultService', () => {
  let keyResultService: KeyResultService;

  const mockPrismaService = {
    keyResult: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
    emitAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyResultService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    keyResultService = module.get<KeyResultService>(KeyResultService);
    jest.clearAllMocks();
  });


  const buildKeyResult = (overrides: Record<string, unknown> = {}) => ({
    id: 'kr-1',
    description: 'Reach 1000 users',
    currentValue: 0,
    targetValue: 1000,
    metricType: 'NUMBER',
    objectiveId: 'obj-1',
    createdAt: new Date(),
    ...overrides,
  });


  describe('create', () => {
    it('should create a key result with the provided data', async () => {
      const dto = {
        description: 'Reach 1000 users',
        currentValue: 0,
        targetValue: 1000,
        metricType: 'NUMBER',
        objectiveId: 'obj-1',
      };
      const created = buildKeyResult();
      mockPrismaService.keyResult.create.mockResolvedValue(created);

      const result = await keyResultService.create(dto);

      expect(result).toEqual(created);
      expect(mockPrismaService.keyResult.create).toHaveBeenCalledWith({
        data: {
          description: dto.description,
          currentValue: dto.currentValue,
          targetValue: dto.targetValue,
          metricType: dto.metricType,
          objectiveId: dto.objectiveId,
        },
      });
    });
  });


  describe('getOneById', () => {
    it('should return the key result matching the given id', async () => {
      const keyResult = buildKeyResult();
      mockPrismaService.keyResult.findUnique.mockResolvedValue(keyResult);

      const result = await keyResultService.getOneById({ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(result).toEqual(keyResult);
      expect(mockPrismaService.keyResult.findUnique).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
      });
    });

    it('should return null when no key result is found', async () => {
      mockPrismaService.keyResult.findUnique.mockResolvedValue(null);

      const result = await keyResultService.getOneById({ keyResultId: 'nonexistent', objectiveId: 'obj-1' });

      expect(result).toBeNull();
    });
  });


  describe('update', () => {
    it('should update the key result with the provided data', async () => {
      const dto = {
        id: 'kr-1',
        description: 'Updated description',
        objectiveId: 'obj-1',
      };
      mockPrismaService.keyResult.update.mockResolvedValue(buildKeyResult());

      await keyResultService.update(dto,{ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: { description: 'Updated description', objectiveId: 'obj-1' },
      });
    });

    it('should emit update_completeness when currentValue is provided', async () => {
      const dto = {
        id: 'kr-1',
        currentValue: 500,
        objectiveId: 'obj-1',
      };
      mockPrismaService.keyResult.update.mockResolvedValue(buildKeyResult());

      await keyResultService.update(dto,{ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(mockEventEmitter.emit).toHaveBeenCalledWith('update_completeness', {
        objectiveId: 'obj-1',
      });
    });

    it('should not emit update_completeness when currentValue is not provided', async () => {
      const dto = {
        id: 'kr-1',
        description: 'Only description updated',
        objectiveId: 'obj-1',
      };
      mockPrismaService.keyResult.update.mockResolvedValue(buildKeyResult());

      await keyResultService.update(dto,{ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(mockEventEmitter.emit).not.toHaveBeenCalled();
    });

  });

  describe('delete', () => {
    it('should call prisma delete with the correct id', async () => {
      mockPrismaService.keyResult.delete.mockResolvedValue(buildKeyResult());

      await keyResultService.delete({ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(mockPrismaService.keyResult.delete).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
      });
    });
  });


  describe('updateCurrentValue', () => {
    it('should update only the currentValue field', async () => {
      const dto = { id: 'kr-1', currentValue: 750, objectiveId: 'obj-1' };
      mockPrismaService.keyResult.update.mockResolvedValue(buildKeyResult());
      mockEventEmitter.emitAsync.mockResolvedValue([]);

      await keyResultService.updateCurrentValue(dto,{ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: { currentValue: 750 },
      });
    });

    it('should emit update_completeness asynchronously after updating', async () => {
      const dto = { id: 'kr-1', currentValue: 750, objectiveId: 'obj-1' };
      mockPrismaService.keyResult.update.mockResolvedValue(buildKeyResult());
      mockEventEmitter.emitAsync.mockResolvedValue([]);

      await keyResultService.updateCurrentValue(dto,{ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith(
        'update_completeness',
        { objectiveId: 'obj-1' },
      );
    });

    it('should await the event before resolving (emitAsync called, not emit)', async () => {
      const dto = { id: 'kr-1', currentValue: 100, objectiveId: 'obj-1' };
      mockPrismaService.keyResult.update.mockResolvedValue(buildKeyResult());
      mockEventEmitter.emitAsync.mockResolvedValue([]);

      await keyResultService.updateCurrentValue(dto,{ keyResultId: 'kr-1', objectiveId: 'obj-1' });

      expect(mockEventEmitter.emit).not.toHaveBeenCalled();
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledTimes(1);
    });
  });


  describe('deleteAll', () => {
    it('should delete all key results matching the provided ids and objectiveId', async () => {
      const dto = {
        keyResultsToDelete: ['kr-1', 'kr-2'],
        objectiveId: 'obj-1',
      };
      mockPrismaService.keyResult.deleteMany.mockResolvedValue({ count: 2 });

      const result = await keyResultService.deleteAll(dto,{ keyResultId: '', objectiveId: 'obj-1' });

      expect(result).toEqual({ count: 2 });
      expect(mockPrismaService.keyResult.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['kr-1', 'kr-2'] },
          objectiveId: 'obj-1',
        },
      });
    });

    it('should return count 0 when no matching key results exist', async () => {
      const dto = { keyResultsToDelete: ['nonexistent'], objectiveId: 'obj-1' };
      mockPrismaService.keyResult.deleteMany.mockResolvedValue({ count: 0 });

      const result = await keyResultService.deleteAll(dto,{ keyResultId: '', objectiveId: 'obj-1' });

      expect(result).toEqual({ count: 0 });
    });
  });
});