import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = Router();

const dateRangeSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
});

router.use(authenticate);
router.use(requireStoreContext);

router.get(
  '/overview',
  requireRole('ADMIN'),
  validate(dateRangeSchema),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: {
          messagesSent: 1500,
          messagesDelivered: 1450,
          messagesRead: 1200,
          conversionRate: 5.2
        },
        message: 'Overview analytics retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
