import { Queue, Worker, QueueEvents } from 'bullmq';
import { redisConnection } from './redis';
import { logger } from '../config/logger';

const QUEUE_NAME = 'vaquita-high-priority';

export const highPriorityQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
});

export const highPriorityWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    logger.info({ jobId: job.id, data: job.data }, 'Processing high priority job via BullMQ');
    // Implement BullMQ processing logic here if needed
    return { processed: true };
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);

highPriorityWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'BullMQ job completed');
});

highPriorityWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'BullMQ job failed');
});

const queueEvents = new QueueEvents(QUEUE_NAME, {
  connection: redisConnection,
});

queueEvents.on('error', (err) => {
  logger.error({ err }, 'BullMQ events error');
});

export const startBullMQ = async () => {
  logger.info('BullMQ worker initialized and connected to Redis');
};
