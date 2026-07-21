import { Router } from 'express';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
