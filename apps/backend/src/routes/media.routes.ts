import { Router } from 'express';
import { requireStoreContext } from '../middleware/storeContext';
import {  authenticate, requireRole  } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = Router();

const uploadMediaSchema = z.object({
  body: z.object({
    mimeType: z.string(),
    fileSize: z.number().max(5000000), // 5MB max
  })
});

router.use(authenticate);
router.use(requireStoreContext);

router.post(
  '/upload',
  requireRole('ADMIN', 'AGENT'),
  validate(uploadMediaSchema),
  async (req, res, next) => {
    try {
      // In a real implementation, this would handle multer or similar
      res.json({
        success: true,
        data: {
          mediaId: 'media_123',
          url: 'https://media.vaquita.com/123.jpg'
        },
        message: 'Media uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
