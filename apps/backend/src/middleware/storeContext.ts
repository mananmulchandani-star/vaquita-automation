import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { getStoreContext } from '../utils/context';
import { logger } from '../config/logger';

export const requireStoreContext = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let storeRecord = null;
    let shopifyDomain = req.headers['x-shopify-shop-domain'] as string;
    
    if ((req as any).user?.storeId) {
      storeRecord = { id: (req as any).user.storeId };
    } 
    else if (shopifyDomain) {
      storeRecord = await prisma.store.findUnique({
        where: { shopifyDomain },
        select: { id: true }
      });
    }

    if (!storeRecord) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unable to resolve store context' } });
    }

    const storeContext = await getStoreContext(storeRecord.id);
    req.storeContext = storeContext;
    next();
  } catch (error) {
    logger.error({ error }, 'Error resolving store context');
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to resolve store context' } });
  }
};
