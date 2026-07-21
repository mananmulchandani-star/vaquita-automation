import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerAutomation, executeBlock } from '../../../../services/automation/engine';
import { prisma } from '../../../../lib/prisma';
import { sendTemplateMessage } from '../../../../services/whatsapp/message.service';

vi.mock('../../../../services/whatsapp/message.service', () => ({
  sendTemplateMessage: vi.fn()
}));

describe('Automation Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggerAutomation finds matching automations', async () => {
    const mockAutomations = [{ id: 'a1', blocks: [] }];
    vi.mocked(prisma.automation.findMany).mockResolvedValueOnce(mockAutomations as any);

    await triggerAutomation('ORDER_CREATED', { id: 'order_1', total: 100 });
    expect(prisma.automation.findMany).toHaveBeenCalledWith({
      where: { isActive: true, triggerType: 'ORDER_CREATED' },
      include: { blocks: true }
    });
  });

  it('executeBlock processes trigger block', async () => {
    const block = { type: 'TRIGGER', nextBlockId: 'b2' };
    const context = { orderId: '1' };
    const result = await executeBlock(block as any, context);
    expect(result.nextBlockId).toBe('b2');
  });

  it('executeBlock processes delay block', async () => {
    const block = { type: 'DELAY', config: { duration: 60 }, nextBlockId: 'b3' };
    const context = { orderId: '1' };
    // Assuming delay queues a job
    const result = await executeBlock(block as any, context);
    expect(result.delayed).toBe(true);
    expect(result.duration).toBe(60);
  });

  it('executeBlock processes condition block', async () => {
    const block = { type: 'CONDITION', config: { field: 'total', operator: 'gt', value: 50 }, trueBlockId: 'bTrue', falseBlockId: 'bFalse' };
    const context = { order: { total: 100 } };
    const result = await executeBlock(block as any, context);
    expect(result.nextBlockId).toBe('bTrue');
  });

  it('executeBlock processes action block', async () => {
    const block = { type: 'ACTION', config: { actionType: 'SEND_WHATSAPP', templateName: 'cod' }, nextBlockId: null };
    const context = { customer: { phone: '123' } };
    await executeBlock(block as any, context);
    expect(sendTemplateMessage).toHaveBeenCalled();
  });

  it('Full COD confirmation flow test', async () => {
    const automations = [{
      id: 'a1',
      triggerType: 'ORDER_CREATED',
      isActive: true,
      blocks: [
        { id: 'b1', type: 'CONDITION', config: { field: 'isCOD', operator: 'eq', value: true }, trueBlockId: 'b2' },
        { id: 'b2', type: 'ACTION', config: { actionType: 'SEND_WHATSAPP', templateName: 'cod_confirm' } }
      ]
    }];
    vi.mocked(prisma.automation.findMany).mockResolvedValueOnce(automations as any);
    await triggerAutomation('ORDER_CREATED', { id: 'order1', isCOD: true, customer: { phone: '123' } });
    
    expect(sendTemplateMessage).toHaveBeenCalled();
  });
});
