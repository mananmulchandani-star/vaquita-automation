import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';

export class MessageQueueService {
  async enqueue(params: { storeId: string; type: string; payload: any; priority: number }) {
    logger.info(`Enqueueing message ${params.type} (priority ${params.priority}) for store ${params.storeId}`);
    return prisma.messageQueue.create({
      data: {
        storeId: params.storeId,
        payload: { ...params.payload, type: params.type }, // Inject type into payload if needed
        priority: params.priority,
        status: 'PENDING',
      },
    });
  }

  async enqueueBatch(messages: Array<{ storeId: string; type: string; payload: any; priority: number }>) {
    logger.info(`Enqueueing batch of ${messages.length} messages`);
    return prisma.messageQueue.createMany({
      data: messages.map(msg => ({
        storeId: msg.storeId,
        priority: msg.priority,
        payload: { ...msg.payload, type: msg.type },
        status: 'PENDING',
      })),
    });
  }

  async dequeue(batchSize: number) {
    const messages = await prisma.messageQueue.findMany({
      where: {
        status: 'PENDING',
        OR: [
          { nextRetryAt: null },
          { nextRetryAt: { lte: new Date() } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
      take: batchSize,
    });

    if (messages.length > 0) {
      await prisma.messageQueue.updateMany({
        where: { id: { in: messages.map(m => m.id) } },
        data: { status: 'PROCESSING', updatedAt: new Date() },
      });
    }

    return messages;
  }

  async complete(queueId: string, result: any) {
    logger.info(`Message completed ${queueId}`);
    return prisma.messageQueue.update({
      where: { id: queueId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async fail(queueId: string, error: string) {
    logger.error(`Message failed ${queueId}: ${error}`);
    const message = await prisma.messageQueue.findUnique({ where: { id: queueId } });
    if (!message) throw new Error('Message not found');

    const maxAttempts = 5;
    const attempt = message.attempts + 1;
    
    if (attempt >= maxAttempts) {
      return prisma.messageQueue.update({
        where: { id: queueId },
        data: {
          status: 'DEAD_LETTER',
          error,
          attempts: attempt,
          updatedAt: new Date(),
        },
      });
    }

    const nextRetryAt = new Date(Date.now() + 1000 * Math.pow(2, attempt)); // Exponential backoff

    return prisma.messageQueue.update({
      where: { id: queueId },
      data: {
        status: 'PENDING',
        error,
        attempts: attempt,
        nextRetryAt,
        updatedAt: new Date(),
      },
    });
  }

  async getQueueStats(storeId: string) {
    const stats = await prisma.messageQueue.groupBy({
      by: ['status'],
      where: { storeId },
      _count: true,
    });
    
    return stats.reduce((acc, curr) => {
      acc[curr.status.toLowerCase()] = curr._count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getDeadLetterMessages(storeId: string) {
    return prisma.messageQueue.findMany({
      where: { storeId, status: 'DEAD_LETTER' },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async retryDeadLetter(queueId: string) {
    return prisma.messageQueue.update({
      where: { id: queueId },
      data: {
        status: 'PENDING',
        attempts: 0,
        error: null,
        nextRetryAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async purgeCompleted(olderThan: Date) {
    return prisma.messageQueue.deleteMany({
      where: {
        status: 'COMPLETED',
        completedAt: { lt: olderThan },
      },
    });
  }
}

export const messageQueueService = new MessageQueueService();
