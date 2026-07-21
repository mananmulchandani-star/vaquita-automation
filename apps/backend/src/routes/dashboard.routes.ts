import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/stats', async (req, res, next) => {
  try {
    const store = req.storeContext;
    res.json({ success: true, data: { stats: {} } });
  } catch (error) {
    next(error);
  }
});

export default router;
