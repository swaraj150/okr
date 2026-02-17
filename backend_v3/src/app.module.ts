import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjectiveModule } from './objective/objective.module';
import { KeyResultModule } from './key-result/key-result.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatBotModule } from './chat-bot/chat-bot.module';

@Module({
  imports: [
    ObjectiveModule,
    KeyResultModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ChatBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
