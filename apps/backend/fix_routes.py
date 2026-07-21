import os
import re

base_dir = '/Users/manan/Downloads/theme_export__vaquita-world-vaquita-world-enhanced-v2__01JUL2026-1053pm/vaquita-automation/apps/backend/src/routes'

files_to_fix = {
    'dashboard.routes.ts': '''import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/stats', async (req, res, next) => {
  try {
    res.json({ success: true, data: { stats: {} } });
  } catch (error) {
    next(error);
  }
});

export default router;
''',

    'orders.routes.ts': '''import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
''',

    'customers.routes.ts': '''import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
''',

    'templates.routes.ts': '''import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
''',

    'campaigns.routes.ts': '''import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
''',

    'automations.routes.ts': '''import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStoreContext } from '../middleware/storeContext';

const router = Router();

router.use(authenticate);
router.use(requireStoreContext);

router.get('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
''',

    'health.routes.ts': '''import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
''',

    'shopify/webhook.routes.ts': '''import { Router } from 'express';
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
''',

    'whatsapp/webhook.routes.ts': '''import { Router } from 'express';

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
''',
    
    'shopify/auth.routes.ts': '''import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ success: true });
});

export default router;
'''
}

for rel_path, content in files_to_fix.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
