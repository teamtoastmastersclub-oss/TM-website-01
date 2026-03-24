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
      
      if (content.includes('fetch("/api/')) {
        content = content.replace(/fetch\("\/api\//g, 'fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/');
        modified = true;
      }
      if (content.includes("fetch('/api/")) {
        content = content.replace(/fetch\('\/api\//g, 'fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/');
        modified = true;
      }
      if (content.includes("fetch(`/api/")) {
        content = content.replace(/fetch\(`\/api\//g, 'fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/');
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src'));
console.log('Frontend APIs Rewritten!');
