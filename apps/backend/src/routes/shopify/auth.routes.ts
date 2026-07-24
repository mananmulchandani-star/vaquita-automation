import { Router, Request, Response, NextFunction } from 'express';
import { generateAuthUrl, handleOAuthCallback } from '../../services/shopify/auth.service';
import { env } from '../../config/env';
import { prisma } from '../../config/database';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ValidationError } from '../../lib/errors';

const router = Router();

/**
 * GET /api/v1/shopify/auth
 * Initiates Shopify OAuth flow by redirecting merchant to Shopify's authorization URL.
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const shop = req.query.shop as string;
    if (!shop) {
      throw new ValidationError('Query parameter "shop" is required');
    }

    const authUrl = generateAuthUrl(shop);
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/shopify/auth/callback
 * OAuth callback handler called by Shopify after merchant approves app installation.
 */
router.get('/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shop, code } = req.query;

    if (!shop || !code) {
      throw new ValidationError('Missing "shop" or "code" parameter in OAuth callback');
    }

    const result = await handleOAuthCallback(
      shop as string,
      code as string,
      req.query as Record<string, any>
    );

    const frontendUrl = env.FRONTEND_URL || 'http://localhost:5173';
    // Redirect to frontend with token and store setup state
    const redirectTarget = `${frontendUrl}/setup?token=${encodeURIComponent(result.token)}&storeId=${result.storeId}`;
    res.redirect(redirectTarget);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/shopify/auth/login
 * Dashboard authentication endpoint for existing users.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, storeDomain } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
        ...(storeDomain ? { store: { shopifyDomain: storeDomain } } : {}),
      },
      include: { store: true },
    });

    if (!user) {
      throw new UnauthorizedError('User account not found or inactive');
    }

    const token = jwt.sign(
      { userId: user.id, storeId: user.storeId, role: user.role },
      env.JWT_SECRET,
      { expiresIn: (env.JWT_EXPIRY || '15m') as any }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        store: {
          id: user.store.id,
          shopifyDomain: user.store.shopifyDomain,
          name: user.store.name,
          isIntegrationComplete: user.store.isIntegrationComplete,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
