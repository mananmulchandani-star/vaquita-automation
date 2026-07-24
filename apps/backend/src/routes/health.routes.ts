import { Router } from 'express';
import { prisma } from '../config/database';
import { getRedisConnection } from '../lib/redis';
import { logger } from '../config/logger';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/debug', (req, res) => {
  const maskUrl = (url?: string) => {
    if (!url) return 'MISSING';
    const parts = url.split('@');
    if (parts.length === 2) {
      return `***@${parts[1]}`;
    }
    return 'INVALID_FORMAT';
  };

  res.json({
    databaseUrl: maskUrl(process.env.DATABASE_URL),
    directUrl: maskUrl(process.env.DIRECT_URL),
  });
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
