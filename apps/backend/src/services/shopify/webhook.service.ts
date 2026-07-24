import crypto from 'crypto';
import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { shopifyClient } from '../../lib/shopify';
import { orderService } from './order.service';
import { customerService } from './customer.service';

export class WebhookService {
  async registerWebhooks(shop: string, accessToken: string) {
    logger.info(`Registering webhooks for shop ${shop}`);
    const client = await shopifyClient(shop); // Uses access token internally

    const topics = [
      'ORDERS_CREATE',
      'ORDERS_UPDATED',
      'ORDERS_CANCELLED',
      'FULFILLMENTS_CREATE',
      'FULFILLMENTS_UPDATE',
      'CUSTOMERS_CREATE',
      'CUSTOMERS_UPDATE',
      'APP_UNINSTALLED',
      'PRODUCTS_UPDATE',
      'INVENTORY_LEVELS_UPDATE'
    ];

    const appUrl = process.env.FRONTEND_URL || 'https://example.com';

    for (const topic of topics) {
      const callbackUrl = `${appUrl}/api/webhooks/shopify`;
      
      const query = `
        mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
          webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
            webhookSubscription {
              id
              topic
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      try {
        await client.execute(query, {
          topic,
          webhookSubscription: {
            callbackUrl,
            format: 'JSON',
          }
        });
      } catch (error) {
        logger.error({ error }, `Failed to register webhook ${topic} for shop ${shop}`);
      }
    }
  }

  verifyWebhook(rawBody: Buffer, hmac: string, secret: string): boolean {
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');
    
    return crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmac));
  }

  async logWebhook(storeId: string, topic: string, payload: any) {
    return prisma.webhookLog.create({
      data: {
        storeId,
        topic,
        shopifyWebhookId: payload.id?.toString() || 'unknown',
        payload,
        headers: {},
      }
    });
  }

  async processWebhook(topic: string, shop: string, payload: any) {
    const store = await prisma.store.findUnique({ where: { shopifyDomain: shop } });
    if (!store) {
      logger.warn(`Received webhook for unknown shop ${shop}`);
      return;
    }

    await this.logWebhook(store.id, topic, payload);

    try {
      switch (topic) {
        case 'orders/create':
        case 'orders/updated':
          await orderService.syncOrder(store.id, payload);
          break;
        case 'customers/create':
        case 'customers/update':
          await customerService.syncCustomer(store.id, payload);
          break;
        case 'app/uninstalled':
          // Soft delete store
          await prisma.store.update({
            where: { id: store.id },
            data: { isActive: false, shopifyAccessToken: null },
          });
          break;
        // Other cases can be handled here...
        default:
          logger.info(`Unhandled webhook topic: ${topic}`);
      }
    } catch (error: any) {
      logger.error({ error: error.message }, `Error processing webhook ${topic}`);
      throw error;
    }
  }
}

export const webhookService = new WebhookService();
