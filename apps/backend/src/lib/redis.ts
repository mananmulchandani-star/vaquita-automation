import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../config/logger';

const redisUrl = env.REDIS_URL || 'redis://localhost:6379';

export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
});

redisConnection.on('error', (err) => {
  logger.error({ err }, 'Redis connection error');
});

redisConnection.on('ready', () => {
  logger.info('Redis connected successfully');
});
