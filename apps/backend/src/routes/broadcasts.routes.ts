import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = Router();

const createBroadcastSchema = z.object({
  body: z.object({
    name: z.string(),
    templateId: z.string(),
    audienceSegment: z.string(),
    scheduledAt: z.string().datetime().optional()
  })
});

router.use(authenticate);
router.use(requireStoreContext);

router.post(
  '/',
  requireRole('ADMIN'),
  validate(createBroadcastSchema),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: {
          broadcastId: 'bc_123',
          ...req.body,
          status: req.body.scheduledAt ? 'scheduled' : 'processing'
        },
        message: 'Broadcast created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/',
  requireRole('ADMIN'),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: [],
        message: 'Broadcasts retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
