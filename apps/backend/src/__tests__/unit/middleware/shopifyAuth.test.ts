import { describe, it, expect, vi } from 'vitest';
import { shopifyAuthMiddleware } from '../../../../middleware/shopifyAuth';
import crypto from 'crypto';

describe('Shopify Auth Middleware', () => {
  const req: any = {
    headers: {},
    rawBody: Buffer.from('{"test":"data"}')
  };
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
  const next = vi.fn();

  it('Verifies valid HMAC', () => {
    process.env.SHOPIFY_WEBHOOK_SECRET = 'secret';
    const hmac = crypto.createHmac('sha256', 'secret').update(req.rawBody).digest('base64');
    req.headers['x-shopify-hmac-sha256'] = hmac;

    shopifyAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Rejects invalid HMAC', () => {
    process.env.SHOPIFY_WEBHOOK_SECRET = 'secret';
    req.headers['x-shopify-hmac-sha256'] = 'invalid_hmac';

    shopifyAuthMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid HMAC signature' });
  });

  it('Rejects missing HMAC header', () => {
    req.headers = {};
    shopifyAuthMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
