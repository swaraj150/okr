import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjectiveModule } from './models/objective/objective.module';

import { KeyResultModule } from './models/objective/key-result/key-result.module';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

@Module({
    imports: [
        ObjectiveModule,
        KeyResultModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        RouterModule.register([
            {
                path: 'v2/objective',
                module: ObjectiveModule,
                children: [
                    {
                        module: KeyResultModule,
                        path: ':objectiveId/key-results',
                    },
                ],
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
