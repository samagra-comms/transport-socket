import * as winston from 'winston';

import { CacheModule, Logger, Module } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket/socket.gateway';
import { TerminusModule } from '@nestjs/terminus';
import { config } from './config/config';
import path from 'path';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => ({
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.printf(
            (info) =>
              `${info.timestamp} ${info.level} [${info.context}] :  ${info.message}` +
              (info.splat !== undefined ? `${info.splat}` : ' '),
          ),
        ),
        transports: [
          new winston.transports.Console({
            format: nestWinstonModuleUtilities.format.nestLike(),
          }),
          new winston.transports.File({
            dirname: 'log',
            filename: 'debug.log',
            level: 'debug',
          }),
          new winston.transports.File({
            dirname: 'log',
            filename: 'info.log',
            level: 'info',
          }),
          new winston.transports.File({
            dirname: 'log',
            filename: 'error.log',
            level: 'error',
          }),
        ],
      }),
      inject: [],
    }),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TerminusModule,
    CacheModule.register(),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, SocketGateway, Logger],
  exports: [SocketGateway],
})
export class AppModule {}
