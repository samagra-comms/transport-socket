import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { RedisOptions, Transport } from '@nestjs/microservices';

import { config } from '../config/config';

@Controller('health')
export class HealthController {
  private redisHost;
  private redisPort;
  public appConfig;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {
    this.appConfig = config().app;
    this.redisHost = this.appConfig.redisHost;
    this.redisPort = this.appConfig.redisPort;
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: {
            url: `redis://${this.redisHost}:${this.redisPort}`,
          },
        }),
    ]);
  }
}
