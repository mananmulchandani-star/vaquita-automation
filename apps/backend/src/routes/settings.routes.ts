import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../config/database';
import { encrypt } from '../lib/encryption';
import { logger } from '../config/logger';

const router = Router();

router.use(authenticate);

/**
 * GET /api/v1/settings
 * Returns current store information for the authenticated user.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user!.storeId;
    if (!storeId) {
      return res.status(400).json({ success: false, error: { message: 'No store associated with user' } });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        shopifyDomain: true,
        name: true,
        email: true,
        currency: true,
        timezone: true,
        brandName: true,
        isIntegrationComplete: true,
        isActive: true,
        // Return whether WhatsApp is configured (but not the actual secrets)
        waPhoneNumberId: true,
        waWabaId: true,
        installedAt: true,
      },
    });

    if (!store) {
      return res.status(404).json({ success: false, error: { message: 'Store not found' } });
    }

    res.json({
      success: true,
      data: {
        ...store,
        shopifyConnected: !!store.shopifyDomain,
        whatsappConnected: !!(store.waPhoneNumberId && store.waWabaId),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/settings/integrations
 * Saves WhatsApp credentials and brand settings.
 * Called from the SetupWizard after Shopify OAuth is complete.
 */
router.post('/integrations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user!.storeId;
    if (!storeId) {
      return res.status(400).json({ success: false, error: { message: 'No store associated with user' } });
    }

    const {
      // WhatsApp fields
      metaAppId,
      metaAppSecret,
      metaAccessToken,
      metaPhoneId,
      metaWabaId,
      metaVerifyToken,
      metaWebhookVerifyToken,
      // Brand fields
      brandName,
      brandColor,
    } = req.body;

    const updateData: any = {
      isIntegrationComplete: true,
    };

    // WhatsApp fields (encrypt secrets)
    if (metaAppId !== undefined) updateData.waAppId = metaAppId;
    if (metaAppSecret) updateData.waAppSecret = encrypt(metaAppSecret);
    if (metaAccessToken) updateData.waAccessToken = encrypt(metaAccessToken);
    if (metaPhoneId !== undefined) updateData.waPhoneNumberId = metaPhoneId;
    if (metaWabaId !== undefined) updateData.waWabaId = metaWabaId;
    if (metaVerifyToken) updateData.waVerifyToken = encrypt(metaVerifyToken);
    if (metaWebhookVerifyToken) updateData.waWebhookSecret = encrypt(metaWebhookVerifyToken);

    // Brand fields
    if (brandName !== undefined) updateData.brandName = brandName;

    const store = await prisma.store.update({
      where: { id: storeId },
      data: updateData,
      select: {
        id: true,
        shopifyDomain: true,
        name: true,
        isIntegrationComplete: true,
        brandName: true,
        waPhoneNumberId: true,
        waWabaId: true,
      },
    });

    logger.info({ storeId }, 'Store integration settings updated');

    res.json({
      success: true,
      data: {
        ...store,
        shopifyConnected: !!store.shopifyDomain,
        whatsappConnected: !!(store.waPhoneNumberId && store.waWabaId),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
