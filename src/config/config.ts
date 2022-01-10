export const config = () => ({
  app: {
    redisport: process.env.REDIS_PORT,
    redishost: process.env.REDIS_HOST,
    port: process.env.SERVER_PORT,
    bot_session_event: process.env.SKT_SESSION_EVT || 'session',
    socket_timeout: process.env.SKT_TIMEOUT || 60000,
    socket_ping_interval: process.env.SKT_PING_INTERVAL || 60000,
    socket_ping_timeout: process.env.SKT_PING_TIMEOUT || 60000,
    throttle_ttl: process.env.THROTTLE_TTL || 60,
    throttle_limit: process.env.THROTTLE_LIMIT || 10,
  },
  ADAPTER_URL: process.env.ADAPTER_URL,
  database: {},
});
