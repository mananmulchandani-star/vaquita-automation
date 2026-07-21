import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';

export class DeadLetterService {
  async getDeadLetterQueue(storeId: string, pagination: { skip: number; take: number }) {
    const [total, messages] = await prisma.$transaction([
      prisma.messageQueue.count({ where: { storeId, status: 'DEAD_LETTER' } }),
      prisma.messageQueue.findMany({
        where: { storeId, status: 'DEAD_LETTER' },
        orderBy: { updatedAt: 'desc' },
        ...pagination,
      }),
    ]);

    return { total, messages };
  }

  async retryMessage(messageId: string) {
    logger.info({ messageId }, `Retrying dead letter message`);
    return prisma.messageQueue.update({
      where: { id: messageId },
      data: {
        status: 'PENDING',
        attempts: 0,
        error: null,
        nextRetryAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async retryAll(storeId: string) {
    logger.info({ storeId }, `Retrying all dead letter messages for store`);
    return prisma.messageQueue.updateMany({
      where: { storeId, status: 'DEAD_LETTER' },
      data: {
        status: 'PENDING',
        attempts: 0,
        error: null,
        nextRetryAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async discardMessage(messageId: string) {
    logger.info({ messageId }, `Discarding dead letter message`);
    return prisma.messageQueue.delete({
      where: { id: messageId },
    });
  }
}

export const deadLetterService = new DeadLetterService();
