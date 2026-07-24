import { Router } from 'express';
import { prisma } from '../config/database';
import { getRedisConnection } from '../lib/redis';
import { logger } from '../config/logger';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/ready', async (req, res) => {
  const checks: Record<string, string> = {};
  let allOk = true;

  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    checks.database = 'ok';
  } catch (err: any) {
    checks.database = 'error';
    allOk = false;
    logger.error({ err }, 'Database readiness check failed');
  }

  try {
    const redis = getRedisConnection();
    await redis.ping();
    checks.redis = 'ok';
  } catch (err: any) {
    checks.redis = 'error';
    allOk = false;
    logger.error({ err }, 'Redis readiness check failed');
  }

  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  });
});

export default router;
