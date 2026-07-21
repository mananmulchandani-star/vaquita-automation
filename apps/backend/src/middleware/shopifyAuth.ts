import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { env } from '../config/env';
import { UnauthorizedError } from '../lib/errors';

export const verifyShopifyWebhook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string;
    
    if (!hmacHeader) {
      throw new UnauthorizedError('Missing Shopify HMAC header');
    }

    // req.body must be raw string or buffer (ensure express.raw or similar is used for webhook routes)
    const rawBody = (req as any).rawBody;
    
    if (!rawBody) {
       throw new UnauthorizedError('Raw body is required for webhook verification');
    }

    const hash = crypto
      .createHmac('sha256', env.SHOPIFY_API_SECRET)
      .update(rawBody, 'utf8')
      .digest('base64');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(hmacHeader)
    );

    if (!isValid) {
      throw new UnauthorizedError('Invalid Shopify Webhook Signature');
    }

    next();
  } catch (error) {
    next(error);
  }
};
