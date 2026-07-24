import { Router, Request, Response, NextFunction } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import { authenticate, requireRole } from '../middleware/auth';
import { prisma } from '../config/database';
import { encrypt } from '../lib/encryption';
import { WhatsAppClient } from '../lib/whatsapp';
import { logger } from '../config/logger';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

/**
 * GET /api/v1/settings
 * Retrieves store configuration and integration status.
 */
router.get('/', requireRole('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.user!.storeId },
      select: {
        id: true,
        shopifyDomain: true,
        name: true,
        email: true,
        currency: true,
        timezone: true,
        waAppId: true,
        waPhoneNumberId: true,
        waWabaId: true,
        brandName: true,
        supportNumber: true,
        isIntegrationComplete: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/settings/integrations
 * Updates Meta WhatsApp & Store Branding credentials (encrypts sensitive tokens).
 */
router.post('/integrations', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user!.storeId;
    const {
      metaAppId,
      metaAppSecret,
      metaAccessToken,
      metaPhoneId,
      metaWabaId,
      metaVerifyToken,
      brandName,
      brandColor,
    } = req.body;

    const updateData: Record<string, any> = {};

    if (metaAppId) updateData.waAppId = metaAppId;
    if (metaAppSecret) updateData.waAppSecret = encrypt(metaAppSecret);
    if (metaAccessToken) updateData.waAccessToken = encrypt(metaAccessToken);
    if (metaPhoneId) updateData.waPhoneNumberId = metaPhoneId;
    if (metaWabaId) updateData.waWabaId = metaWabaId;
    if (metaVerifyToken) updateData.waVerifyToken = encrypt(metaVerifyToken);
    if (brandName) updateData.brandName = brandName;

    updateData.isIntegrationComplete = true;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: updateData,
      select: {
        id: true,
        shopifyDomain: true,
        waAppId: true,
        waPhoneNumberId: true,
        waWabaId: true,
        brandName: true,
        isIntegrationComplete: true,
      },
    });

    logger.info({ storeId }, 'Integration settings updated and encrypted successfully');

    res.json({
      success: true,
      data: updatedStore,
      message: 'Integration settings saved successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/settings/test-whatsapp
 * Validates saved WhatsApp credentials against Meta Cloud API.
 */
router.post('/test-whatsapp', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user!.storeId;
    const { testPhone } = req.body;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store || !store.waAccessToken || !store.waPhoneNumberId) {
      res.status(400).json({
        success: false,
        error: { message: 'WhatsApp credentials are not configured for this store' },
      });
      return;
    }

    // Try creating client & fetching business profile as a test
    const { getWhatsAppClient } = await import('../lib/whatsapp.js');
    const waClient = await getWhatsAppClient(storeId as string);
    
    let result: any = null;
    if (testPhone) {
      result = await waClient.sendText(testPhone, 'Hello! This is a test message from your VAQUITA Automation store setup.');
    } else {
      result = await waClient.getBusinessProfile();
    }

    res.json({
      success: true,
      data: result,
      message: 'WhatsApp connection test successful!',
    });
  } catch (error: any) {
    logger.error({ err: error.message }, 'WhatsApp connection test failed');
    res.status(400).json({
      success: false,
      error: { message: error.message || 'WhatsApp connection test failed. Please check your credentials.' },
    });
  }
});

export default router;
