import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = Router();

const updateExchangeStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected', 'shipped', 'completed']),
  }),
  params: z.object({
    id: z.string()
  })
});

router.use(authenticate);
router.use(requireStoreContext);

router.get(
  '/',
  requireRole('ADMIN', 'AGENT'),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: [],
        message: 'Exchanges retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id/status',
  requireRole('ADMIN', 'AGENT'),
  validate(updateExchangeStatusSchema),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: { id: req.params.id, status: req.body.status },
        message: 'Exchange status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
