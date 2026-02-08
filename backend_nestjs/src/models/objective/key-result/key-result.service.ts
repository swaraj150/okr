import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { KeyResultDto } from './dto/key-result.dto';

@Injectable()
export class KeyResultService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(
        createKeyResultDto: KeyResultDto,
        objectiveId: string,
        tx?: any,
    ) {
        const prisma = tx || this.prismaService;
        return prisma.keyResult.create({
            data: {
                description: createKeyResultDto.description,
                progress: parseInt(createKeyResultDto.progress, 10),
                objectiveId,
            },
        });
    }

    update(updateKeyResultDto: KeyResultDto, tx?: any) {
        const prisma = tx || this.prismaService;
        return prisma.keyResult.update({
            where: {
                id: updateKeyResultDto.id,
            },
            data: {
                description: updateKeyResultDto.description,
                progress: parseInt(updateKeyResultDto.progress, 10),
            },
        });
    }

    async updateOkr(
        objectiveId: string,
        keyResultDtos: KeyResultDto[],
        tx?: any,
    ) {
        const prisma = tx || this.prismaService;

        const { toDelete, toUpdate, toCreate } =
            this.categorizeDtos(keyResultDtos);

        await Promise.all([
            toDelete.length > 0
                ? this.deleteAll(toDelete, prisma)
                : Promise.resolve(),
            ...toUpdate.map((kr) => this.update(kr, prisma)),

            ...toCreate.map((kr) => this.create(kr, objectiveId, prisma)),
        ]);
    }
    deleteAll(keyResultIds: string[], tx?: any) {
        const prisma = tx || this.prismaService;
        return prisma.keyResult.deleteMany({
            where: {
                id: {
                    in: keyResultIds,
                },
            },
        });
    }

    private categorizeDtos(keyResultDtos: KeyResultDto[]) {
        return {
            toDelete: keyResultDtos
                .filter((kr) => kr.toDelete && kr.id)
                .map((kr) => kr.id!),

            toUpdate: keyResultDtos.filter(
                (kr) => kr.id && !kr.toDelete && !kr.toCreate,
            ),

            toCreate: keyResultDtos.filter((kr) => kr.toCreate!),
        };
    }
}
