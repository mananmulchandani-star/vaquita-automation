import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';
import { prisma } from '../config/database';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user!.storeId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          customer: { select: { firstName: true, lastName: true, email: true } }
        }
      }),
      prisma.order.count({ where: { storeId } })
    ]);

    res.json({ 
      success: true, 
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user!.storeId;
    const orderId = req.params.id as string;
    const order = await prisma.order.findFirst({
      where: { id: orderId, storeId },
      include: {
        customer: true,
        messages: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!order) {
      res.status(404).json({ success: false, error: { message: 'Order not found' } });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

export default router;
