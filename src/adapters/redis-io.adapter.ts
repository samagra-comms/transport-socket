import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { config } from '../config/config';
import { createAdapter } from 'socket.io-redis';
import { createClient } from 'redis';

const appConfig = config().app;
const pubClient = createClient({
  url: `redis://${appConfig.redisHost}:${appConfig.redisPort}`,
});
const subClient = createClient({
  url: `redis://${appConfig.redisHost}:${appConfig.redisPort}`,
});
const redisAdapter = createAdapter({ pubClient, subClient });

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, { ...options, cors: true });
    server.adapter(redisAdapter);
    return server;
  }
}
