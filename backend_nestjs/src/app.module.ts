import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OkrModule } from './okr/okr.module';

@Module({
  imports: [OkrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
