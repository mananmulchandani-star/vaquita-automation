import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';
import { prisma } from '../config/database';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.user!.storeId;

    // 1. Total Revenue
    const revenueResult = await prisma.order.aggregate({
      where: { storeId },
      _sum: { totalPrice: true },
    });
    const totalRevenue = revenueResult._sum.totalPrice ? Number(revenueResult._sum.totalPrice) : 0;

    // 2. Orders Count
    const ordersCount = await prisma.order.count({
      where: { storeId },
    });

    // 3. Messages Sent Count
    const messagesCount = await prisma.whatsAppMessage.count({
      where: { storeId, direction: 'OUTBOUND' },
    });

    // 4. Active Automations
    const activeAutomationsCount = await prisma.automation.count({
      where: { storeId, isActive: true },
    });

    // 5. Recent Orders (limit 5)
    const recentOrders = await prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        shopifyOrderId: true,
        orderNumber: true,
        customer: { select: { firstName: true, lastName: true, email: true } },
        totalPrice: true,
        financialStatus: true,
        fulfillmentStatus: true,
        createdAt: true,
      }
    });

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.orderNumber,
      dbId: order.id,
      customer: order.customer 
        ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || order.customer.email
        : 'Guest User',
      amount: Number(order.totalPrice),
      status: order.fulfillmentStatus === 'FULFILLED' ? 'delivered' : 
              order.financialStatus === 'PAID' ? 'processing' : 'pending',
      date: order.createdAt.toISOString()
    }));

    res.json({ 
      success: true, 
      data: { 
        stats: {
          totalRevenue,
          ordersCount,
          messagesCount,
          activeAutomationsCount,
        },
        recentOrders: formattedRecentOrders
      } 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
