import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleOrderCreateWebhook } from '../../../../webhooks/shopify/orders-create';
import { syncOrder } from '../../../../services/order.service';
import { triggerAutomation } from '../../../../services/automation/engine';
import { logger } from '../../../../lib/logger';

vi.mock('../../../../services/order.service', () => ({
  syncOrder: vi.fn()
}));
vi.mock('../../../../services/automation/engine', () => ({
  triggerAutomation: vi.fn()
}));

describe('Orders Create Webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Processes valid order webhook', async () => {
    const payload = { id: 12345, total_price: '100.00' };
    vi.mocked(syncOrder).mockResolvedValueOnce({ id: 'db_order_1' } as any);

    await handleOrderCreateWebhook(payload as any);
    
    expect(syncOrder).toHaveBeenCalledWith(payload);
    expect(triggerAutomation).toHaveBeenCalledWith('ORDER_CREATED', expect.any(Object));
  });

  it('Handles duplicate order', async () => {
    const payload = { id: 12345 };
    vi.mocked(syncOrder).mockRejectedValueOnce(new Error('Unique constraint failed'));

    await handleOrderCreateWebhook(payload as any);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('duplicate'));
  });

  it('Triggers automations', async () => {
    const payload = { id: 12345 };
    vi.mocked(syncOrder).mockResolvedValueOnce({ id: '1' } as any);
    await handleOrderCreateWebhook(payload as any);
    expect(triggerAutomation).toHaveBeenCalled();
  });

  it('Handles missing store gracefully', async () => {
    const payload = null;
    await expect(handleOrderCreateWebhook(payload as any)).rejects.toThrow();
  });
});
