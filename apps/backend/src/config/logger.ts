import pino from 'pino';
import { env } from './env';

const isProduction = env.NODE_ENV === 'production';

export const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers["x-shopify-access-token"]',
      'accessToken',
      'passwordHash',
      'authorization',
      'SHOPIFY_API_SECRET',
      'JWT_SECRET',
      'ENCRYPTION_KEY'
    ],
    censor: '[REDACTED]',
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }),
});

export const createChildLogger = (moduleName: string, correlationId?: string) => {
  return logger.child({
    module: moduleName,
    ...(correlationId ? { correlationId } : {}),
  });
};
