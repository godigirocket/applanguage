import fs from 'node:fs';
import path from 'node:path';

const clientSrc = path.join(process.cwd(), 'dist', 'client');
const clientDest = path.join(process.cwd(), 'dist');
const serverSrc = path.join(process.cwd(), 'dist', 'server');
const serverDest = path.join(process.cwd(), 'server-build');

// 1. Copy client assets to dist root for CDN static hosting
if (fs.existsSync(clientSrc)) {
  const files = fs.readdirSync(clientSrc);
  for (const file of files) {
    fs.cpSync(path.join(clientSrc, file), path.join(clientDest, file), { recursive: true });
  }
  console.log('Copied dist/client to dist root for static CDN');
}

// 2. Copy server build to a separate server-build directory to bypass Vercel dist exclusion
if (fs.existsSync(serverSrc)) {
  if (fs.existsSync(serverDest)) {
    fs.rmSync(serverDest, { recursive: true, force: true });
  }
  fs.cpSync(serverSrc, serverDest, { recursive: true });
  console.log('Copied dist/server to server-build/ for Serverless Lambda bundling');
}
