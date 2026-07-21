const fs = require('fs');
const files = ['src/lib/shopify.ts', 'src/lib/whatsapp.ts', 'src/lib/supabase.ts'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/logger\.error\((['"`].*?['"`]), (.*?)\)/g, 'logger.error({ err: $2 }, $1)');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
}
