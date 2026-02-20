import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('v3/chat-bot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService) {}

  @Post()
  async generate(@Body() createChatBotDto: CreateChatDto) {
    const chatResponse = await this.chatBotService.generate(createChatBotDto);
    console.log(chatResponse);
    return chatResponse;
  }
}
