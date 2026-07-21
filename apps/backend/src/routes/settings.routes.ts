import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = Router();

const updateSettingsSchema = z.object({
  body: z.object({
    whatsappBusinessId: z.string().optional(),
    shopifyDomain: z.string().optional(),
    enableAutoReplies: z.boolean().optional(),
  })
});

router.use(authenticate);
router.use(requireStoreContext);

router.get(
  '/',
  requireRole('ADMIN'),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: {
          whatsappBusinessId: 'wb_123',
          shopifyDomain: 'shop.vaquita.com',
          enableAutoReplies: true
        },
        message: 'Settings retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/',
  requireRole('ADMIN'),
  validate(updateSettingsSchema),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: req.body,
        message: 'Settings updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
