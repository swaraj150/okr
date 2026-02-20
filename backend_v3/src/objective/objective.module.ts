import { Module } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { PrismaService } from '../prisma.service';
import { GeminiService } from 'src/common/ai/gemini.service';

@Module({
  providers: [ObjectiveService, PrismaService,GeminiService],
  controllers: [ObjectiveController],
})
export class ObjectiveModule {}
