import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';

export type CustomerOptInStatus = 'OPTED_IN' | 'OPTED_OUT' | 'BLOCKED';

export interface SegmentFilter {
  totalSpend?: { gt?: number; lt?: number };
  orderCount?: { gt?: number; lt?: number };
  tags?: { contains: string[] };
  city?: { eq: string };
  paymentMethod?: { eq: string };
  lastOrderAt?: { before?: Date; after?: Date };
  whatsappOptIn?: { eq: CustomerOptInStatus };
  customerLifetimeValue?: { gt?: number; lt?: number };
}

export class CustomerService {
  async syncCustomer(storeId: string, shopifyCustomer: any) {
    logger.info(`Syncing customer ${shopifyCustomer.id} for store ${storeId}`);
    
    const data = {
      shopifyCustomerId: shopifyCustomer.id.toString(),
      storeId,
      firstName: shopifyCustomer.first_name,
      lastName: shopifyCustomer.last_name,
      email: shopifyCustomer.email,
      phone: shopifyCustomer.phone || shopifyCustomer.default_address?.phone || '',
      tags: shopifyCustomer.tags ? shopifyCustomer.tags.split(',').map((t: string) => t.trim()) : [],
      totalSpend: parseFloat(shopifyCustomer.total_spent) || 0,
      orderCount: shopifyCustomer.orders_count || 0,
      state: shopifyCustomer.default_address?.province || shopifyCustomer.state || '',
      city: shopifyCustomer.default_address?.city || '',
      country: shopifyCustomer.default_address?.country || '',
      pincode: shopifyCustomer.default_address?.zip || '',
    };

    return prisma.customer.upsert({
      where: {
        storeId_shopifyCustomerId: {
          storeId,
          shopifyCustomerId: data.shopifyCustomerId,
        }
      },
      update: data,
      create: {
        ...data,
        whatsappOptIn: 'OPTED_IN',
      },
    });
  }

  async getCustomers(storeId: string, filters: any) {
    const { skip = 0, take = 50, search, whatsappOptIn } = filters;
    
    const where: any = { storeId };
    
    if (whatsappOptIn) where.whatsappOptIn = whatsappOptIn;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, customers] = await prisma.$transaction([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, customers };
  }

  async getCustomerById(storeId: string, customerId: string) {
    return prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async updateCustomerOptIn(storeId: string, customerId: string, status: CustomerOptInStatus) {
    return prisma.customer.update({
      where: { id: customerId },
      data: { whatsappOptIn: status },
    });
  }

  async getCustomerConversation(storeId: string, customerId: string) {
    return prisma.whatsAppMessage.findMany({
      where: { customerId, storeId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async segmentCustomers(storeId: string, filter: SegmentFilter) {
    // Construct dynamic Prisma where clause based on filter
    const where: any = { storeId };

    if (filter.totalSpend) {
      where.totalSpend = {};
      if (filter.totalSpend.gt !== undefined) where.totalSpend.gt = filter.totalSpend.gt;
      if (filter.totalSpend.lt !== undefined) where.totalSpend.lt = filter.totalSpend.lt;
    }

    if (filter.orderCount) {
      where.orderCount = {};
      if (filter.orderCount.gt !== undefined) where.orderCount.gt = filter.orderCount.gt;
      if (filter.orderCount.lt !== undefined) where.orderCount.lt = filter.orderCount.lt;
    }

    if (filter.tags?.contains && filter.tags.contains.length > 0) {
      where.tags = { hasSome: filter.tags.contains };
    }

    if (filter.whatsappOptIn) {
      where.whatsappOptIn = filter.whatsappOptIn.eq;
    }

    // Return matching customers
    return prisma.customer.findMany({
      where,
      orderBy: { totalSpend: 'desc' },
    });
  }

  async calculateCustomerMetrics(storeId: string, customerId: string) {
    const orders = await prisma.order.findMany({
      where: { customerId, storeId, financialStatus: 'PAID' as any },
    });

    const totalSpend = orders.reduce((sum: any, order: any) => sum + Number(order.totalPrice), 0);
    const orderCount = orders.length;
    const customerLifetimeValue = totalSpend; // simplified CLV

    return prisma.customer.update({
      where: { id: customerId },
      data: {
        totalSpend,
        orderCount,
        customerLifetimeValue,
      },
    });
  }
}

export const customerService = new CustomerService();
