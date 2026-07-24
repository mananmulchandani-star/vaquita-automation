import { Router, Request, Response, NextFunction } from 'express';
import { verifyShopifyWebhook } from '../../middleware/shopifyAuth';
import { webhookService } from '../../services/shopify/webhook.service';
import { logger } from '../../config/logger';

const router = Router();

router.post('/', verifyShopifyWebhook, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = req.headers['x-shopify-topic'] as string;
    const shop = req.headers['x-shopify-shop-domain'] as string;
    
    // Parse JSON payload from raw body or req.body
    let payload = req.body;
    if (Buffer.isBuffer(req.body)) {
      payload = JSON.parse(req.body.toString('utf-8'));
    }

    logger.info({ topic, shop, webhookId: payload?.id }, 'Received Shopify Webhook');

    // Process webhook asynchronously or synchronously
    if (topic && shop && payload) {
      await webhookService.processWebhook(topic, shop, payload);
    }

    res.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to handle Shopify Webhook');
    next(error);
  }
});

export default router;
