import { PrismaClient } from '@vaquita/database';
import { logger } from './logger';
import { env } from './env';

const dbLogger = logger.child({ module: 'Database' });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Setup Prisma logging via Pino
// Note: In Prisma 5+, client extensions are the recommended way to intercept queries.
// However, since we just need simple logging, event listeners work.

// @ts-ignore Prisma types for events
prisma.$on('query', (e: any) => {
  dbLogger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
});

// @ts-ignore
prisma.$on('error', (e: any) => {
  dbLogger.error(`Prisma Error: ${e.message}`);
});

// @ts-ignore
prisma.$on('info', (e: any) => {
  dbLogger.info(`Prisma Info: ${e.message}`);
});

// @ts-ignore
prisma.$on('warn', (e: any) => {
  dbLogger.warn(`Prisma Warn: ${e.message}`);
});

// Implement soft-delete middleware via Prisma Client Extensions
export const extendedPrisma = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (
          operation === 'findUnique' ||
          operation === 'findFirst' ||
          operation === 'findMany' ||
          operation === 'count' ||
          operation === 'groupBy' ||
          operation === 'aggregate'
        ) {
          // If the model has a deletedAt field (most of our soft-delete models should)
          // We would inject `{ deletedAt: null }` into the where clause.
          // Since Prisma's extension API lacks robust runtime schema introspection for soft deletes without specific model typing,
          // we assume our schema includes `deletedAt: DateTime?` on models that need it.
          // For safety and generic operation, we check if `args.where` exists and could theoretically have `deletedAt: null`.
          
          if (!args.where) {
            args.where = {};
          }
          // @ts-ignore
          if (args.where.deletedAt === undefined) {
             // @ts-ignore
            args.where.deletedAt = null;
          }
        }

        if (operation === 'delete') {
          // Transform delete to update with deletedAt
          const newArgs = {
            ...args,
            data: { deletedAt: new Date() },
          };
          // @ts-ignore
          return prisma[model].update(newArgs);
        }
        
        if (operation === 'deleteMany') {
          const newArgs = {
             ...args,
             data: { deletedAt: new Date() }
          };
          // @ts-ignore
          return prisma[model].updateMany(newArgs);
        }

        return query(args);
      },
    },
  },
});
