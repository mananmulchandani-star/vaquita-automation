import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/', async (req, res, next) => {
  try {
    const store = req.storeContext;
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const store = req.storeContext;
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
