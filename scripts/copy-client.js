import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.join(process.cwd(), 'dist', 'client');
const destDir = path.join(process.cwd(), 'dist');

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    fs.cpSync(path.join(srcDir, file), path.join(destDir, file), { recursive: true });
  }
  console.log('Copied dist/client to dist for Vercel deployment');
}
