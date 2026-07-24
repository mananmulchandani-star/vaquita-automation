import { Queue, Worker, QueueEvents } from 'bullmq';
import { getRedisConnection, closeRedis } from './redis';
import { logger } from '../config/logger';

const QUEUE_NAME = 'vaquita-messages';

let _queue: Queue | null = null;
let _worker: Worker | null = null;
let _events: QueueEvents | null = null;

export function getQueue(): Queue {
  if (!_queue) {
    _queue = new Queue(QUEUE_NAME, {
      connection: getRedisConnection(),
    });
  }
  return _queue;
}

export async function startBullMQ(): Promise<void> {
  const connection = getRedisConnection();
  
  _worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      logger.info({ jobId: job.id, jobName: job.name }, 'Processing job');
      // TODO: Route to actual job processors based on job.name
      return { processed: true };
    },
    {
      connection,
      concurrency: 10,
    }
  );

  _worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Job completed');
  });

  _worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Job failed');
  });

  _events = new QueueEvents(QUEUE_NAME, { connection });
  _events.on('error', (err) => {
    logger.error({ err }, 'BullMQ events error');
  });

  logger.info('BullMQ worker initialized');
}

export async function stopBullMQ(): Promise<void> {
  if (_worker) await _worker.close();
  if (_events) await _events.close();
  if (_queue) await _queue.close();
  _worker = null;
  _events = null;
  _queue = null;
}
