import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultService } from './key-result.service';
import { PrismaService } from '../../../prisma.service';
import { KeyResultDto } from './dto/key-result.dto';
import { KeyResult } from '../../../common/interfaces/key-result.interface';
import { PrismaClientKnownRequestError } from '../../../../generated/prisma/internal/prismaNamespace';
import { describe } from 'node:test';

describe('KeyResultService', () => {
    let keyResultService: KeyResultService;
    let mockPrismaService = {
        keyResult: {
            create: jest.fn(),
            update: jest.fn(),
            deleteMany: jest.fn(),
        },
    };
    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KeyResultService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        keyResultService =
            await module.resolve<KeyResultService>(KeyResultService);
    });

    describe('create', () => {
        it('Should create a new Key result', async () => {
            const mockObjectiveId = '1';
            const mockKeyResultDto: KeyResultDto = {
                description: 'Key Result 1',
                progress: '50',
                toDelete: false,
            };

            const mockCreatedKeyResult: KeyResult = {
                id: '1',
                description: mockKeyResultDto.description,
                progress: parseInt(mockKeyResultDto.progress, 10),
                isCompleted: false,
                objectiveId: mockObjectiveId,
            };

            mockPrismaService.keyResult.create.mockResolvedValue(
                mockCreatedKeyResult,
            );
            const result = await keyResultService.create(
                mockKeyResultDto,
                mockObjectiveId,
            );
            expect(result).toBe(mockCreatedKeyResult);
            expect(mockPrismaService.keyResult.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('update', () => {
        const mockKeyResults = [
            {
                id: '1',
                description: 'Key Result 1',
                progress: '50',
                isCompleted: false,
                objectiveId: '1',
            },
        ];
        it('Should update an existing Key result', async () => {
            const mockKeyResultDto: KeyResultDto = {
                id: mockKeyResults[0].id,
                description: 'Key Result 2',
                progress: '50',
                toDelete: false,
            };

            const mockUpdatedKeyResult: KeyResult = {
                id: mockKeyResults[0].id,
                description: mockKeyResultDto.description,
                progress: parseInt(mockKeyResultDto.progress, 10),
                isCompleted: mockKeyResults[0].isCompleted,
                objectiveId: mockKeyResults[0].objectiveId,
            };

            mockPrismaService.keyResult.update.mockResolvedValue(
                mockUpdatedKeyResult,
            );
            const result = await keyResultService.update(mockKeyResultDto);
            expect(result).toBe(mockUpdatedKeyResult);
            expect(mockPrismaService.keyResult.update).toHaveBeenCalledTimes(1);
        });

        it('Should throw PrismaClientKnownRequestError with error code "\P2025"\ , when trying to update a non-existent Key result', async () => {
            const mockKeyResultDto: KeyResultDto = {
                id: mockKeyResults[0].id + 'x',
                description: 'Key Result 2',
                progress: '50',
                toDelete: false,
            };
            const prismaError = new PrismaClientKnownRequestError(
                'Record to update not found.',
                {
                    code: 'P2025',
                    clientVersion: '5.0.0',
                    meta: {
                        modelName: 'KeyResult',
                    },
                },
            );

            mockPrismaService.keyResult.update.mockRejectedValue(prismaError);

            await expect(async () => {
                await keyResultService.update(mockKeyResultDto);
            }).rejects.toMatchObject(prismaError);

            expect(mockPrismaService.keyResult.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete', () => {
        const mockKeyResults = [
            {
                id: '1',
                description: 'Key Result 1',
                progress: 50,
                isCompleted: false,
                objectiveId: '1',
            },
        ];

        it('Should delete a list of existing Key results', async () => {
            const mockKeyResultIdsToBeDeleted: string[] = [
                mockKeyResults[0].id,
            ];

            const mockDeletedKeyResultCount: any = {
                count: mockKeyResultIdsToBeDeleted.length,
            };

            mockPrismaService.keyResult.deleteMany.mockResolvedValue(
                mockDeletedKeyResultCount,
            );
            const result = await keyResultService.deleteAll(
                mockKeyResultIdsToBeDeleted,
            );
            expect(result).toBe(mockDeletedKeyResultCount);
            expect(
                mockPrismaService.keyResult.deleteMany,
            ).toHaveBeenCalledTimes(1);
        });
    });
});
