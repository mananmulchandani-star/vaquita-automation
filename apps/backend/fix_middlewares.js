const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      const replacements = [
        {
          from: /import\s+{(.*?)}\s+from\s+['"]\.\.\/middlewares\/auth\.middleware['"];?/g,
          to: "import { $1 } from '../middleware/auth';"
        },
        {
          from: /import\s+{(.*?)}\s+from\s+['"]\.\.\/\.\.\/middlewares\/auth\.middleware['"];?/g,
          to: "import { $1 } from '../../middleware/auth';"
        },
        {
          from: /import\s+{\s*validateRequest\s*}\s+from\s+['"]\.\.\/middlewares\/validate\.middleware['"];?/g,
          to: "import { validate } from '../middleware/validator';"
        },
        {
          from: /validateRequest\(/g,
          to: "validate("
        },
        {
          from: /import\s+{\s*verifyShopifyWebhook\s*}\s+from\s+['"]\.\.\/\.\.\/middlewares\/shopify\.middleware['"];?/g,
          to: "import { verifyShopifyWebhook } from '../../middleware/shopifyAuth';"
        }
      ];

      for (const r of replacements) {
        if (content.match(r.from)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('/Users/manan/Downloads/theme_export__vaquita-world-vaquita-world-enhanced-v2__01JUL2026-1053pm/vaquita-automation/apps/backend/src/routes');
