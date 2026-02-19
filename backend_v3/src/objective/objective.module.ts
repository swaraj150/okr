import { Module } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { PrismaService } from '../prisma.service';
import { OkrGeneratorService } from '../common/ai/okr-generator.service';
import { GeminiService } from 'src/common/ai/gemini.service';

@Module({
  providers: [ObjectiveService, PrismaService, OkrGeneratorService,GeminiService],
  controllers: [ObjectiveController],
})
export class ObjectiveModule {}
