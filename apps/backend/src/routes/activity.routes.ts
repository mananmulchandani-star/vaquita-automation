import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = Router();

const activityQuerySchema = z.object({
  query: z.object({
    limit: z.string().transform(val => parseInt(val, 10)).optional().default('50'),
    offset: z.string().transform(val => parseInt(val, 10)).optional().default('0'),
    type: z.string().optional()
  })
});

router.use(authenticate);
router.use(requireStoreContext);

router.get(
  '/',
  requireRole('ADMIN', 'AGENT'),
  validate(activityQuerySchema),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: [],
        message: 'Activity logs retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
