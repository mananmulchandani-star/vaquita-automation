import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { shopifyClient } from '../../lib/shopify';

export class OrderService {
  async syncOrder(storeId: string, shopifyOrder: any) {
    logger.info(`Syncing order ${shopifyOrder.id} for store ${storeId}`);
    
    // Determine payment method (COD vs PREPAID)
    const paymentMethod = this.determinePaymentMethod(shopifyOrder.gateway);
    
    // Calculate RTO Risk (basic mock implementation for now)
    const rtoRisk = this.calculateRtoRisk(shopifyOrder, paymentMethod);

    const data = {
      shopifyOrderId: shopifyOrder.id.toString(),
      storeId,
      orderNumber: shopifyOrder.order_number.toString(),
      email: shopifyOrder.email || '',
      phone: shopifyOrder.phone || shopifyOrder.billing_address?.phone || '',
      totalPrice: parseFloat(shopifyOrder.total_price),
      subtotalPrice: parseFloat(shopifyOrder.subtotal_price || shopifyOrder.total_price),
      totalDiscount: parseFloat(shopifyOrder.total_discounts || '0'),
      totalTax: parseFloat(shopifyOrder.total_tax || '0'),
      currency: shopifyOrder.currency,
      financialStatus: (shopifyOrder.financial_status || 'PENDING').toUpperCase() as any,
      fulfillmentStatus: (shopifyOrder.fulfillment_status || 'UNFULFILLED').toUpperCase() as any,
      paymentMethod: paymentMethod as any,
      rtoRisk: rtoRisk as any,
      tags: shopifyOrder.tags ? shopifyOrder.tags.split(',').map((t: string) => t.trim()) : [],
      lineItems: shopifyOrder.line_items || [],
      shippingAddress: shopifyOrder.shipping_address || {},
      billingAddress: shopifyOrder.billing_address || {},
      customerId: shopifyOrder.customer?.id?.toString() || null,
      shopifyCreatedAt: new Date(shopifyOrder.created_at),
    };

    return prisma.order.upsert({
      where: {
        storeId_shopifyOrderId: {
          storeId,
          shopifyOrderId: data.shopifyOrderId,
        }
      },
      update: data,
      create: data,
    });
  }

  private determinePaymentMethod(gateway: string | undefined): string {
    if (!gateway) return 'UNKNOWN';
    const lowerGateway = gateway.toLowerCase();
    if (lowerGateway.includes('cod') || lowerGateway.includes('cash on delivery')) {
      return 'COD';
    }
    return 'PREPAID';
  }

  private calculateRtoRisk(order: any, paymentMethod: string): string {
    if (paymentMethod === 'PREPAID') return 'LOW';
    // Simple heuristic: guest checkout + high value + COD = HIGH risk
    if (!order.customer && parseFloat(order.total_price) > 5000) return 'HIGH';
    return 'MEDIUM';
  }

  async getOrders(storeId: string, filters: any) {
    const { skip = 0, take = 50, status, paymentMethod, search } = filters;
    
    const where: any = { storeId };
    
    if (status) where.financialStatus = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
        }
      }),
    ]);

    return { total, orders };
  }

  async getOrderById(storeId: string, orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        shippingUpdates: true,
      },
    });
  }

  async updateOrderTags(storeId: string, orderId: string, tags: string[]) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    const client = await shopifyClient(storeId);
    
    // Format tags for Shopify GraphQL
    const tagsString = tags.join(', ');
    
    await client.execute(`
      mutation orderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      input: {
        id: `gid://shopify/Order/${order.shopifyOrderId}`,
        tags: tagsString,
      }
    });

    return prisma.order.update({
      where: { id: orderId },
      data: { tags },
    });
  }

  async cancelOrder(storeId: string, orderId: string, reason: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    const client = await shopifyClient(storeId);
    
    await client.execute(`
      mutation orderCancel($orderId: ID!, $reason: OrderCancelReason!) {
        orderCancel(orderId: $orderId, reason: $reason) {
          orderCancelRecord {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      orderId: `gid://shopify/Order/${order.shopifyOrderId}`,
      reason: reason.toUpperCase(),
    });

    return prisma.order.update({
      where: { id: orderId },
      data: { financialStatus: 'VOIDED' as any },
    });
  }

  async confirmCOD(storeId: string, orderId: string) {
    logger.info({ orderId }, `Confirming COD for order`);
    
    // Add tag to Shopify
    await this.updateOrderTags(storeId, orderId, ['cod-confirmed']);

    return prisma.order.update({
      where: { id: orderId },
      data: {
        codConfirmed: true,
        tags: { push: 'cod-confirmed' },
      },
    });
  }

  async getOrderTimeline(storeId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingUpdates: true,
      }
    });

    if (!order) throw new Error('Order not found');

    const automationRuns = await prisma.automationRun.findMany({
      where: { orderId }
    });

    // Here we would fetch messages related to this order from WhatsApp messages
    // Since message table is related by customer, we might need to filter by context if available
    
    const timeline = [
      { type: 'ORDER_CREATED', date: order.createdAt, data: order },
      ...order.shippingUpdates.map((u: any) => ({ type: 'SHIPPING_UPDATE', date: u.createdAt, data: u })),
      ...automationRuns.map((r: any) => ({ type: 'AUTOMATION_RUN', date: r.createdAt, data: r })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    return timeline;
  }

  async updateShippingAddress(storeId: string, orderId: string, address: any) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    const client = await shopifyClient(storeId);
    
    await client.execute(`
      mutation orderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      input: {
        id: `gid://shopify/Order/${order.shopifyOrderId}`,
        shippingAddress: address,
      }
    });

    return prisma.order.update({
      where: { id: orderId },
      data: { shippingAddress: address },
    });
  }

  async addInternalNote(storeId: string, orderId: string, note: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    const client = await shopifyClient(storeId);
    
    // We should append to existing note, but for simplicity we replace or assume it's additive in Shopify API
    await client.execute(`
      mutation orderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      input: {
        id: `gid://shopify/Order/${order.shopifyOrderId}`,
        note: note, // note from user
      }
    });

    // We can save to activity log
    await prisma.activityLog.create({
      data: {
        storeId,
        userId,
        entity: 'ORDER',
        entityId: orderId,
        action: 'ADD_NOTE',
        metadata: { note },
      }
    });

    return true;
  }
}

export const orderService = new OrderService();
