import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncCustomer, segmentCustomers, calculateCustomerMetrics } from '../../../services/customer.service';
import { prisma } from '../../../lib/prisma';

describe('Customer Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('syncCustomer creates new customer', async () => {
    vi.mocked(prisma.customer.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.customer.create).mockResolvedValueOnce({
      id: 'cust_1',
      shopifyId: 'shop_123',
      phone: '1234567890',
      email: 'test@example.com',
      ltv: 0
    } as any);

    const result = await syncCustomer({
      id: 'shop_123',
      phone: '1234567890',
      email: 'test@example.com'
    } as any);

    expect(prisma.customer.findUnique).toHaveBeenCalledWith({ where: { shopifyId: 'shop_123' } });
    expect(prisma.customer.create).toHaveBeenCalled();
    expect(result.id).toBe('cust_1');
  });

  it('syncCustomer updates existing customer', async () => {
    vi.mocked(prisma.customer.findUnique).mockResolvedValueOnce({ id: 'cust_1', shopifyId: 'shop_123' } as any);
    vi.mocked(prisma.customer.update).mockResolvedValueOnce({
      id: 'cust_1',
      shopifyId: 'shop_123',
      phone: '0987654321',
      email: 'new@example.com',
      ltv: 100
    } as any);

    const result = await syncCustomer({
      id: 'shop_123',
      phone: '0987654321',
      email: 'new@example.com'
    } as any);

    expect(prisma.customer.update).toHaveBeenCalled();
    expect(result.phone).toBe('0987654321');
  });

  it('segmentCustomers filters correctly', async () => {
    const mockCustomers = [
      { id: '1', ltv: 50 },
      { id: '2', ltv: 200 }
    ];
    vi.mocked(prisma.customer.findMany).mockResolvedValueOnce(mockCustomers as any);

    const result = await segmentCustomers({ minLtv: 100 });
    
    expect(prisma.customer.findMany).toHaveBeenCalledWith({
      where: { ltv: { gte: 100 } }
    });
    expect(result.length).toBe(2);
  });

  it('calculateCustomerMetrics computes accurately', async () => {
    vi.mocked(prisma.customer.aggregate).mockResolvedValueOnce({
      _sum: { ltv: 1000 },
      _avg: { ltv: 100 }
    } as any);
    vi.mocked(prisma.customer.count).mockResolvedValueOnce(10);

    const result = await calculateCustomerMetrics();

    expect(result.totalLtv).toBe(1000);
    expect(result.averageLtv).toBe(100);
    expect(result.totalCustomers).toBe(10);
  });
});
