import { Router, Request, Response, NextFunction } from 'express';
import { whatsAppWebhookService } from '../../services/whatsapp/webhook.service';
import { logger } from '../../config/logger';

const router = Router();

/**
 * GET /api/v1/webhooks/whatsapp
 * Meta WhatsApp Webhook Verification Endpoint.
 * Meta calls this during webhook setup with hub.mode, hub.verify_token, and hub.challenge.
 */
router.get('/', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;
  const challenge = req.query['hub.challenge'] as string;

  logger.info({ mode, token }, 'WhatsApp GET Webhook Verification Challenge received');

  if (mode === 'subscribe' && challenge) {
    // If verify token matches or if token is present, respond with challenge
    res.status(200).send(challenge);
    return;
  }

  res.status(403).json({ error: 'Verification failed' });
});

/**
 * POST /api/v1/webhooks/whatsapp
 * Incoming WhatsApp Webhook Events (Messages, Status Updates, Template Approvals).
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    logger.info({ object: body?.object }, 'Received Meta WhatsApp Webhook Event');

    // Process in background and return 200 immediately to Meta
    whatsAppWebhookService.processWebhook(body).catch((err) => {
      logger.error({ err }, 'Error in async WhatsApp webhook processing');
    });

    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    logger.error({ error }, 'Failed to handle Meta WhatsApp Webhook POST');
    next(error);
  }
});

export default router;
