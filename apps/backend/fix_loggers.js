const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('find src -name "*.ts"').toString().trim().split('\n');
let replacedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Find logger.info('...', { ... }) or logger.error('...', { ... })
  // Regex explanation:
  // logger\.(info|error)\(
  //   \s*(['"`].*?['"`])\s*    (message - group 2)
  //   ,
  //   \s*({.*?})\s*            (object - group 3)
  // \)
  const regex = /logger\.(info|error)\(\s*(['"`][^,]+['"`])\s*,\s*(\{.*?\})\s*\)/g;
  
  const newContent = content.replace(regex, (match, level, msg, obj) => {
    changed = true;
    return `logger.${level}(${obj}, ${msg})`;
  });
  
  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed', file);
    replacedCount++;
  }
}
console.log('Total files fixed:', replacedCount);
