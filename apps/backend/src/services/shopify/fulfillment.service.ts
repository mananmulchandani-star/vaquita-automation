import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { AutomationTrigger } from '@vaquita/shared';

export class FulfillmentService {
  async syncFulfillment(storeId: string, payload: any) {
    logger.info(`Syncing fulfillment ${payload.id} for store ${storeId}`);
    
    // We assume payload from shopify webhook
    const orderId = payload.order_id?.toString();
    if (!orderId) {
      logger.warn('Fulfillment payload missing order_id');
      return;
    }

    const order = await prisma.order.findFirst({
      where: { storeId, shopifyOrderId: orderId }
    });

    if (!order) {
      logger.warn(`Order ${orderId} not found for fulfillment update`);
      return;
    }

    const trackingCompany = payload.tracking_company || '';
    const trackingNumber = payload.tracking_number || '';
    const trackingUrl = payload.tracking_url || '';
    const status = payload.status || 'in_transit'; // Simplified status mapping

    const update = await prisma.shippingUpdate.create({
      data: {
        storeId,
        orderId: order.id,
        status: status.toUpperCase() as any,
        trackingNumber,
        carrier: trackingCompany,
        trackingUrl,
      }
    });

    // Trigger automations based on status
    const { engine } = await import('../automation/engine.js');
    await engine.triggerAutomation(AutomationTrigger.FULFILLMENT_UPDATED, storeId, {
      orderId: order.id,
      customerId: order.customerId || undefined,
      payload: {
        status: status.toUpperCase(),
        trackingNumber,
        trackingCompany,
        trackingUrl,
      }
    });

    return update;
  }

  async getFulfillmentStatus(storeId: string, orderId: string) {
    const updates = await prisma.shippingUpdate.findMany({
      where: { storeId, orderId },
      orderBy: { createdAt: 'desc' },
    });
    return updates;
  }
}

export const fulfillmentService = new FulfillmentService();
