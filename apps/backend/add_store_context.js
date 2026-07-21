const fs = require('fs');
const path = require('path');

const routes = [
  'activity.routes.ts', 'analytics.routes.ts', 'broadcasts.routes.ts', 
  'coupons.routes.ts', 'exchanges.routes.ts', 'media.routes.ts', 
  'messages.routes.ts', 'queue.routes.ts', 'returns.routes.ts', 'settings.routes.ts'
];

for (const file of routes) {
  const p = path.join('/Users/manan/Downloads/theme_export__vaquita-world-vaquita-world-enhanced-v2__01JUL2026-1053pm/vaquita-automation/apps/backend/src/routes', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Check if it already has requireStoreContext
    if (!content.includes('requireStoreContext')) {
      content = content.replace(
        "import { Router } from 'express';", 
        "import { Router } from 'express';\nimport { requireStoreContext } from '../middleware/storeContext';"
      );
      content = content.replace(
        "router.use(authenticate);", 
        "router.use(authenticate);\nrouter.use(requireStoreContext);"
      );
    }
    
    // For inline req.storeContext reading
    content = content.replace(/try {\n      res\.json\(/g, "try {\n      const store = req.storeContext;\n      res.json(");
    fs.writeFileSync(p, content);
  }
}
