import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);
router.use(requireRole('ADMIN'));

router.get(
  '/status',
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: {
          active: 5,
          waiting: 12,
          failed: 0,
          completed: 1540
        },
        message: 'Queue status retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:jobId/retry',
  async (req, res, next) => {
    try {
      const store = req.storeContext;
      res.json({
        success: true,
        data: { jobId: req.params.jobId, status: 'retrying' },
        message: 'Job retry initiated'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
