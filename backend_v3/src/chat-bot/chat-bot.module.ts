import { Module } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { ChatBotController } from './chat-bot.controller';
import { PrismaService } from 'src/prisma.service';
import { GeminiService } from 'src/common/ai/gemini.service';

@Module({
  controllers: [ChatBotController],
  providers: [ChatBotService,GeminiService,PrismaService],
})
export class ChatBotModule {}
