import pino from 'pino';
import { env } from './env';

const isProduction = env.NODE_ENV === 'production';

let transportConfig: any = undefined;

if (!isProduction) {
  try {
    require.resolve('pino-pretty');
    transportConfig = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  } catch (e) {
    // pino-pretty is not installed in production runner environment, fall back to standard JSON logger
    transportConfig = undefined;
  }
}

export const logger = pino({
  level: env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
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
  ...(transportConfig ? { transport: transportConfig } : {}),
});

export const createChildLogger = (moduleName: string, correlationId?: string) => {
  return logger.child({
    module: moduleName,
    ...(correlationId ? { correlationId } : {}),
  });
};
