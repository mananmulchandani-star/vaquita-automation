import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { prisma } from '../../config/database';
import { encrypt } from '../../lib/encryption';
import { logger } from '../../config/logger';
import { AppError, UnauthorizedError, ValidationError } from '../../lib/errors';
import { webhookService } from './webhook.service';

export interface ShopifyOAuthResult {
  storeId: string;
  shopifyDomain: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const generateAuthUrl = (shop: string): string => {
  if (!shop) {
    throw new ValidationError('Shop domain is required');
  }

  // Normalize shop domain
  const normalizedShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const shopDomain = normalizedShop.includes('.myshopify.com') 
    ? normalizedShop 
    : `${normalizedShop}.myshopify.com`;

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${env.APP_URL || `http://localhost:${env.PORT}`}/api/v1/shopify/auth/callback`;

  const authUrl = `https://${shopDomain}/admin/oauth/authorize?` +
    `client_id=${env.SHOPIFY_API_KEY}&` +
    `scope=${encodeURIComponent(env.SHOPIFY_SCOPES)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;

  return authUrl;
};

export const verifyHmac = (query: Record<string, any>): boolean => {
  const { hmac, ...params } = query;
  if (!hmac) return false;

  const message = Object.keys(params)
    .sort()
    .map(key => `${key}=${Array.isArray(params[key]) ? params[key].join(',') : params[key]}`)
    .join('&');

  const generatedHmac = crypto
    .createHmac('sha256', env.SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(generatedHmac));
};

export const handleOAuthCallback = async (
  shop: string,
  code: string,
  query: Record<string, any>
): Promise<ShopifyOAuthResult> => {
  // 1. Verify HMAC if provided
  if (query.hmac && !verifyHmac(query)) {
    throw new UnauthorizedError('Shopify OAuth HMAC verification failed');
  }

  const normalizedShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // 2. Exchange code for access token with Shopify
  let accessToken: string;

  try {
    const response = await axios.post(`https://${normalizedShop}/admin/oauth/access_token`, {
      client_id: env.SHOPIFY_API_KEY,
      client_secret: env.SHOPIFY_API_SECRET,
      code,
    });

    accessToken = response.data.access_token;
  } catch (error: any) {
    logger.error({ err: error.response?.data || error.message }, 'Shopify access token exchange failed');
    throw new AppError('Failed to complete Shopify OAuth access token exchange', 500);
  }

  // 3. Encrypt access token before storing
  const encryptedAccessToken = encrypt(accessToken);
  const encryptedApiKey = encrypt(env.SHOPIFY_API_KEY);
  const encryptedApiSecret = encrypt(env.SHOPIFY_API_SECRET);

  // 4. Upsert Store in database
  const store = await prisma.store.upsert({
    where: { shopifyDomain: normalizedShop },
    update: {
      shopifyAccessToken: encryptedAccessToken,
      shopifyApiKey: encryptedApiKey,
      shopifyApiSecret: encryptedApiSecret,
      isActive: true,
      uninstalledAt: null,
      updatedAt: new Date(),
    },
    create: {
      shopifyDomain: normalizedShop,
      name: normalizedShop.split('.')[0] || normalizedShop,
      email: `admin@${normalizedShop}`,
      shopifyAccessToken: encryptedAccessToken,
      shopifyApiKey: encryptedApiKey,
      shopifyApiSecret: encryptedApiSecret,
      isActive: true,
    },
  });

  // 5. Create or find default Admin user for store
  let user = await prisma.user.findFirst({
    where: { storeId: store.id, role: 'ADMIN' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        storeId: store.id,
        email: store.email,
        name: `Admin (${store.name})`,
        role: 'ADMIN',
        passwordHash: '',
        isActive: true,
      },
    });
  }

  // 6. Generate JWT Session Token
  const jwtToken = jwt.sign(
    { userId: user.id, storeId: store.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: (env.JWT_EXPIRY || '15m') as any }
  );

  // 7. Register Webhooks asynchronously (non-blocking)
  webhookService.registerWebhooks(store.shopifyDomain, accessToken).catch((err: any) => {
    logger.error({ err, storeId: store.id }, 'Background webhook registration error');
  });

  return {
    storeId: store.id,
    shopifyDomain: store.shopifyDomain,
    token: jwtToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};
