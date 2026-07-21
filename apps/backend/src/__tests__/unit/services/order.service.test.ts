import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncOrder, confirmCOD, cancelOrder, getOrders, getOrderTimeline } from '../../../services/order.service';
import { prisma } from '../../../lib/prisma';

describe('Order Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('syncOrder creates new order', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.order.create).mockResolvedValueOnce({ id: '1', shopifyId: '123', status: 'PENDING', isCOD: true } as any);
    
    const result = await syncOrder({ id: '123', financial_status: 'pending', gateway: 'Cash on Delivery' } as any);
    
    expect(prisma.order.create).toHaveBeenCalled();
    expect(result.id).toBe('1');
    expect(result.isCOD).toBe(true);
  });

  it('syncOrder updates existing order', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce({ id: '1', shopifyId: '123' } as any);
    vi.mocked(prisma.order.update).mockResolvedValueOnce({ id: '1', shopifyId: '123', status: 'PAID' } as any);
    
    const result = await syncOrder({ id: '123', financial_status: 'paid' } as any);
    
    expect(prisma.order.update).toHaveBeenCalled();
    expect(result.status).toBe('PAID');
  });

  it('syncOrder correctly determines COD vs Prepaid', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.order.create).mockImplementationOnce((args: any) => Promise.resolve({ id: '1', isCOD: args.data.isCOD } as any));
    
    const result = await syncOrder({ id: '123', gateway: 'stripe' } as any);
    expect(result.isCOD).toBe(false);
  });

  it('confirmCOD marks order confirmed', async () => {
    vi.mocked(prisma.order.update).mockResolvedValueOnce({ id: '1', status: 'CONFIRMED' } as any);
    const result = await confirmCOD('1');
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { status: 'CONFIRMED' } });
    expect(result.status).toBe('CONFIRMED');
  });

  it('cancelOrder updates status', async () => {
    vi.mocked(prisma.order.update).mockResolvedValueOnce({ id: '1', status: 'CANCELLED' } as any);
    const result = await cancelOrder('1');
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { status: 'CANCELLED' } });
    expect(result.status).toBe('CANCELLED');
  });

  it('getOrders returns paginated results', async () => {
    vi.mocked(prisma.order.findMany).mockResolvedValueOnce([{ id: '1' }] as any);
    vi.mocked(prisma.order.count).mockResolvedValueOnce(1);
    
    const result = await getOrders({ page: 1, limit: 10 });
    expect(result.data.length).toBe(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('getOrderTimeline combines events correctly', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce({ id: '1', createdAt: new Date() } as any);
    // Mocking message logs related to order
    vi.mocked(prisma.messageLog.findMany).mockResolvedValueOnce([{ id: 'msg1', status: 'DELIVERED', createdAt: new Date() }] as any);
    
    const result = await getOrderTimeline('1');
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });
});
