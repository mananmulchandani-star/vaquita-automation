import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = Router();

const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().positive(),
    validUntil: z.string().datetime().optional()
  })
});

router.use(authenticate);
router.use(requireStoreContext);

router.post(
  '/',
  requireRole('ADMIN'),
  validate(createCouponSchema),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: {
          couponId: 'coup_123',
          ...req.body
        },
        message: 'Coupon created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/',
  requireRole('ADMIN', 'AGENT'),
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: [],
        message: 'Coupons retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
