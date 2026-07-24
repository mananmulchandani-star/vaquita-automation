import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../config/logger';

let _connection: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!_connection) {
    const url = env.REDIS_URL;
    _connection = new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      ...(url.startsWith('rediss://') ? { tls: { rejectUnauthorized: false } } : {}),
    });

    _connection.on('error', (err: any) => {
      logger.error({ err }, 'Redis connection error');
    });

    _connection.on('ready', () => {
      logger.info('Redis connected successfully');
    });
  }
  return _connection;
}

export async function closeRedis(): Promise<void> {
  if (_connection) {
    await _connection.quit();
    _connection = null;
  }
}
