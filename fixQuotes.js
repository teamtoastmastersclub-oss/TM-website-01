import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      const regex = /"\/api\/([^"]*?)'/g;
      if (regex.test(content)) {
        content = content.replace(regex, "'/api/$1'");
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src'));
console.log('Quotes fixed!');
