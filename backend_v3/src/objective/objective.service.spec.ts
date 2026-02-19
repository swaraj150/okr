import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveService } from './objective.service';
import { PrismaService } from '../prisma.service';
import { OkrGeneratorService } from '../common/ai/okr-generator.service';
import { GeminiService } from '../common/ai/gemini.service';
import { NotFoundException } from '@nestjs/common';
describe('ObjectiveService', () => {
  let objectiveService: ObjectiveService;

  const mockPrismaService = {
    objective: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $executeRaw: jest.fn(),
  };

  const mockOkrGeneratorService = {
    generate: jest.fn(),
  };

  const mockGeminiService = {
    createEmbedding: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectiveService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: OkrGeneratorService, useValue: mockOkrGeneratorService },
        { provide: GeminiService, useValue: mockGeminiService },
      ],
    }).compile();

    objectiveService = module.get<ObjectiveService>(ObjectiveService);
    jest.clearAllMocks();
  });

  const buildKeyResult = (
    currentValue: number,
    targetValue: number,
    index = 0,
  ) => ({
    id: String(index),
    description: 'KR description',
    currentValue,
    targetValue,
    metricType: 'NUMBER',
    objectiveId: '1',
    createdAt: new Date(),
  });

  const buildObjective = (
    keyResults: ReturnType<typeof buildKeyResult>[],
    overrides: Record<string, unknown> = {},
  ) => ({
    id: '1',
    title: 'Test Objective',
    isCompleted: false,
    progress: 0,
    createdAt: new Date(),
    keyResults,
    ...overrides,
  });

  describe('getAll', () => {
    it('should return all objectives with key results ordered by createdAt', async () => {
      const objectives = [buildObjective([buildKeyResult(50, 100)])];
      mockPrismaService.objective.findMany.mockResolvedValue(objectives);

      const result = await objectiveService.getAll();

      expect(result).toEqual(objectives);
      expect(mockPrismaService.objective.findMany).toHaveBeenCalledWith({
        include: { keyResults: { orderBy: { createdAt: 'asc' } } },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('getOneById', () => {
    it('should return the objective matching the given id', async () => {
      const objective = buildObjective([buildKeyResult(100, 100)]);
      mockPrismaService.objective.findUnique.mockResolvedValue(objective);

      const result = await objectiveService.getOneById('1');

      expect(result).toEqual(objective);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { keyResults: true },
      });
    });

    it('should return null when no objective is found', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(null);

      const result = await objectiveService.getOneById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should call prisma delete with the correct id', async () => {
      mockPrismaService.objective.delete.mockResolvedValue({ id: '1' });

      await objectiveService.delete('1');

      expect(mockPrismaService.objective.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    beforeEach(() => {
      mockGeminiService.createEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
      mockPrismaService.$executeRaw.mockResolvedValue(1);
    });

    it('should create an objective with progress 0 when key results are provided', async () => {
      const dto = {
        title: 'New Objective',
        keyResults: [
          {
            description: 'KR1',
            currentValue: 0,
            targetValue: 100,
            metricType: 'NUMBER',
          },
        ],
      };
      const created = buildObjective([buildKeyResult(0, 100)], {
        title: dto.title,
      });
      mockPrismaService.objective.create.mockResolvedValue(created);

      const result = await objectiveService.create(dto);

      expect(result).toEqual(created);
      expect(mockPrismaService.objective.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isCompleted: false, progress: 0 }),
        }),
      );
    });

    it('should mark the objective as completed with progress 100 when no key results are provided', async () => {
      const dto = { title: 'Empty Objective', keyResults: [] };
      const created = buildObjective([], { isCompleted: true, progress: 100 });
      mockPrismaService.objective.create.mockResolvedValue(created);

      const result = await objectiveService.create(dto);

      expect(result).toEqual(created);
      expect(mockPrismaService.objective.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isCompleted: true, progress: 100 }),
        }),
      );
    });

    it('should create an embedding after creating the objective', async () => {
      const dto = { title: 'Obj', keyResults: [] };
      const created = buildObjective([], {
        id: 'abc',
        isCompleted: true,
        progress: 100,
      });
      mockPrismaService.objective.create.mockResolvedValue(created);

      await objectiveService.create(dto);

      expect(mockGeminiService.createEmbedding).toHaveBeenCalledWith(
        JSON.stringify(created),
      );
    });
  });

  describe('update', () => {
    it('should update the objective title', async () => {
      const dto = { id: '1', title: 'Updated Title' };
      const updated = buildObjective([], { title: dto.title });
      mockPrismaService.objective.update.mockResolvedValue(updated);

      const result = await objectiveService.update(dto);

      expect(result).toEqual(updated);
      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Updated Title' },
      });
    });
  });

  describe('updateCompleteness', () => {
    it('should throw NotFoundException when the objective does not exist', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(null);

      await expect(
        objectiveService.updateCompleteness({ objectiveId: 'nonexistent' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should compute progress as the mean of (currentValue / targetValue * 100) across key results', async () => {
      const keyResults = [
        buildKeyResult(50, 100, 0),
        buildKeyResult(75, 100, 1),
      ];
      const objective = buildObjective(keyResults);
      mockPrismaService.objective.findUnique.mockResolvedValue(objective);
      mockPrismaService.objective.update.mockResolvedValue({});

      await objectiveService.updateCompleteness({ objectiveId: '1' });

      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isCompleted: false, progress: 62.5 },
      });
    });

    it('should set isCompleted to true when all key results reach 100%', async () => {
      const keyResults = [
        buildKeyResult(100, 100, 0),
        buildKeyResult(100, 100, 1),
      ];
      const objective = buildObjective(keyResults);
      mockPrismaService.objective.findUnique.mockResolvedValue(objective);
      mockPrismaService.objective.update.mockResolvedValue({});

      await objectiveService.updateCompleteness({ objectiveId: '1' });

      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isCompleted: true, progress: 100 },
      });
    });

    it('should set progress to 100 and isCompleted to true when there are no key results', async () => {
      const objective = buildObjective([]);
      mockPrismaService.objective.findUnique.mockResolvedValue(objective);
      mockPrismaService.objective.update.mockResolvedValue({});

      await objectiveService.updateCompleteness({ objectiveId: '1' });

      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isCompleted: true, progress: 100 },
      });
    });

    it.each([
      [[50, 100], [150, 100], 100], // one over-target KR
      [[0, 100], [0, 100], 0], // all at zero
      [[33, 100], [67, 100], 50], // mixed partial progress
    ])(
      'should compute the correct progress for various currentValue/targetValue combinations',
      async (kr1, kr2, expectedProgress) => {
        const keyResults = [
          buildKeyResult(kr1[0], kr1[1], 0),
          buildKeyResult(kr2[0], kr2[1], 1),
        ];
        const objective = buildObjective(keyResults);
        mockPrismaService.objective.findUnique.mockResolvedValue(objective);
        mockPrismaService.objective.update.mockResolvedValue({});

        await objectiveService.updateCompleteness({ objectiveId: '1' });

        expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
          where: { id: '1' },
          data: expect.objectContaining({ progress: expectedProgress }),
        });
      },
    );
  });
});
