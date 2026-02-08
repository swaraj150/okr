import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectiveDto } from './dto/objective.dto';
import { PrismaService } from '../../prisma.service';
import { KeyResultService } from './key-result/key-result.service';

@Injectable()
export class ObjectiveService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly keyResultService: KeyResultService,
    ) {}
    getAll() {
        return this.prismaService.objective.findMany({
            include: {
                keyResults: {
                    orderBy: {
                        created_at: 'asc',
                    },
                },
            },
            orderBy: {
                created_at: 'asc',
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

    getAllByTitle(title: string) {
        return this.prismaService.objective.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
            include: {
                keyResults: true,
            },
        });
    }
    create(createObjectiveDto: ObjectiveDto) {
        return this.prismaService.objective.create({
            data: {
                title: createObjectiveDto.title,
                keyResults: {
                    create: createObjectiveDto.keyResults.map((kr) => ({
                        description: kr.description,
                        progress: parseInt(kr.progress, 10),
                    })),
                },
            },
            include: {
                keyResults: true,
            },
        });
    }

    async update(updateObjectiveDto: ObjectiveDto) {
        const objectiveId = updateObjectiveDto.id;
        if (!objectiveId) {
            throw new BadRequestException('Objective is required');
        }
        await this.prismaService.$transaction(async (tx) => {
            await tx.objective.update({
                where: { id: objectiveId },
                data: { title: updateObjectiveDto.title },
            });
            await this.keyResultService.updateOkr(
                objectiveId,
                updateObjectiveDto.keyResults,
                tx,
            );
        });
        const ob = await this.getOneById(objectiveId);
        console.log(ob);
        return ob;
    }

    delete(id: string) {
        return this.prismaService.objective.delete({ where: { id } });
    }
}
