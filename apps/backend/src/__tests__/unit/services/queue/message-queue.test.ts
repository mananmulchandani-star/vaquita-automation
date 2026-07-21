import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueueService } from '../../../../services/queue/message-queue';
import { prisma } from '../../../../lib/prisma';

describe('Message Queue', () => {
  let queueService: QueueService;

  beforeEach(() => {
    vi.clearAllMocks();
    queueService = new QueueService();
  });

  it('enqueue adds to queue', async () => {
    vi.mocked(prisma.messageQueue.create).mockResolvedValueOnce({ id: 'q1', priority: 1 } as any);
    const result = await queueService.enqueue('TEST', { data: 1 }, 1);
    expect(prisma.messageQueue.create).toHaveBeenCalled();
    expect(result.id).toBe('q1');
  });

  it('dequeue returns highest priority first', async () => {
    const mockJobs = [{ id: 'q1', priority: 10 }, { id: 'q2', priority: 5 }];
    vi.mocked(prisma.messageQueue.findMany).mockResolvedValueOnce(mockJobs as any);
    vi.mocked(prisma.messageQueue.update).mockResolvedValueOnce({ id: 'q1', status: 'PROCESSING' } as any);

    const job = await queueService.dequeue();
    expect(job?.id).toBe('q1');
  });

  it('fail increments attempts and calculates retry', async () => {
    vi.mocked(prisma.messageQueue.update).mockResolvedValueOnce({ id: 'q1', retries: 1 } as any);
    await queueService.fail('q1', new Error('test'));
    expect(prisma.messageQueue.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'FAILED' })
    }));
  });

  it('fail moves to dead letter after max attempts', async () => {
    vi.mocked(prisma.messageQueue.update).mockResolvedValueOnce({ id: 'q1', retries: 5 } as any); // Assuming max is 5
    await queueService.fail('q1', new Error('test'), 5);
    expect(prisma.messageQueue.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'DEAD_LETTER' })
    }));
  });

  it('retryDeadLetter resets message', async () => {
    vi.mocked(prisma.messageQueue.update).mockResolvedValueOnce({ id: 'q1', status: 'PENDING' } as any);
    await queueService.retryDeadLetter('q1');
    expect(prisma.messageQueue.update).toHaveBeenCalledWith({
      where: { id: 'q1' },
      data: { status: 'PENDING', retries: 0 }
    });
  });
});
