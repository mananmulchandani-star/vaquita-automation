import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendTemplateMessage, sendTextMessage, updateMessageStatus, getMessageStats } from '../../../../services/whatsapp/message.service';
import { prisma } from '../../../../lib/prisma';
import { queueService } from '../../../../services/queue/message-queue';

vi.mock('../../../../services/queue/message-queue', () => ({
  queueService: {
    enqueue: vi.fn()
  }
}));

describe('WhatsApp Message Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sendTemplateMessage enqueues message', async () => {
    const params = { to: '1234567890', templateName: 'cod_confirm', language: 'en', variables: [] };
    vi.mocked(queueService.enqueue).mockResolvedValueOnce({ id: 'q1' } as any);

    const result = await sendTemplateMessage(params);
    expect(queueService.enqueue).toHaveBeenCalledWith('whatsapp_template', params, expect.any(Number));
    expect(result.id).toBe('q1');
  });

  it('sendTextMessage enqueues message', async () => {
    const params = { to: '1234567890', text: 'Hello' };
    vi.mocked(queueService.enqueue).mockResolvedValueOnce({ id: 'q2' } as any);

    const result = await sendTextMessage(params);
    expect(queueService.enqueue).toHaveBeenCalledWith('whatsapp_text', params, expect.any(Number));
    expect(result.id).toBe('q2');
  });

  it('updateMessageStatus updates correctly', async () => {
    vi.mocked(prisma.messageLog.update).mockResolvedValueOnce({ id: 'msg1', status: 'READ' } as any);
    const result = await updateMessageStatus('msg1', 'READ');
    expect(prisma.messageLog.update).toHaveBeenCalledWith({
      where: { id: 'msg1' },
      data: { status: 'READ' }
    });
    expect(result.status).toBe('READ');
  });

  it('getMessageStats aggregates properly', async () => {
    vi.mocked(prisma.messageLog.groupBy).mockResolvedValueOnce([
      { status: 'DELIVERED', _count: { _all: 50 } },
      { status: 'READ', _count: { _all: 30 } }
    ] as any);

    const result = await getMessageStats();
    expect(result.DELIVERED).toBe(50);
    expect(result.READ).toBe(30);
  });
});
