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

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where: { storeId } })
    ]);

    res.json({ 
      success: true, 
      data: customers,
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
    const customer = await prisma.customer.findFirst({
      where: { id: orderId, storeId },
      include: {
        orders: { orderBy: { createdAt: 'desc' } },
        messages: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!customer) {
      res.status(404).json({ success: false, error: { message: 'Customer not found' } });
      return;
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
});

export default router;
