import { Router } from 'express';
import { verifyShopifyWebhook } from '../../middleware/shopifyAuth';

const router = Router();

router.post('/', verifyShopifyWebhook, async (req, res, next) => {
  try {
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
