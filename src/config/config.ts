export const config = () => ({
  app: {
    redisPort: process.env.REDIS_PORT || 6380,
    redisHost: process.env.REDIS_HOST || '0.0.0.0',
    port: process.env.SERVER_PORT || 3005,
    bot_session_event: process.env.SKT_SESSION_EVT || 'session',
    socket_timeout: process.env.SKT_TIMEOUT || 60000,
    socket_ping_interval: process.env.SKT_PING_INTERVAL || 60000,
    socket_ping_timeout: process.env.SKT_PING_TIMEOUT || 60000,
  },
  ADAPTER_URL: process.env.ADAPTER_URL,
  database: {},
});
