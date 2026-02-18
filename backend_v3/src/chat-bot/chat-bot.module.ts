import { Module } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { ChatBotController } from './chat-bot.controller';
import { ObjectiveService } from 'src/objective/objective.service';
import { PrismaService } from 'src/prisma.service';
import { OkrGeneratorService } from 'src/common/ai/okr-generator.service';
import { GeminiService } from 'src/common/ai/gemini.service';

@Module({
  controllers: [ChatBotController],
  providers: [ChatBotService,GeminiService],
})
export class ChatBotModule {}
