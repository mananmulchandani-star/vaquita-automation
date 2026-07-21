const fs = require('fs');
const path = require('path');

const filesToFix = [
  'dashboard.routes.ts',
  'orders.routes.ts',
  'customers.routes.ts',
  'campaigns.routes.ts',
  'automations.routes.ts',
  'templates.routes.ts'
];

for (const file of filesToFix) {
  const p = path.join('/Users/manan/Downloads/theme_export__vaquita-world-vaquita-world-enhanced-v2__01JUL2026-1053pm/vaquita-automation/apps/backend/src/routes', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/try {\n    res\.json\(/g, "try {\n    const store = req.storeContext;\n    res.json(");
    fs.writeFileSync(p, content);
  }
}
