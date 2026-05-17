import fs from 'node:fs';
import path from 'node:path';

// Helper to recursively find a file in a directory
function findFile(dir, fileName) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        // Skip node_modules to avoid infinite/long recursion
        if (file !== 'node_modules') {
          const found = findFile(fullPath, fileName);
          if (found) return found;
        }
      } else if (file === fileName) {
        return fullPath;
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
  }
  return null;
}

export default async function handler(req, res) {
  try {
    // 1. Dynamically locate server.js at runtime!
    const taskRoot = process.cwd();
    console.log(`Task Root: ${taskRoot}`);
    
    // Find server.js recursively under taskRoot
    const serverPath = findFile(taskRoot, 'server.js');
    console.log(`Located server.js at: ${serverPath}`);

    if (!serverPath) {
      throw new Error(`Could not find server.js anywhere under ${taskRoot}`);
    }

    // Import the located server
    const { default: server } = await import(serverPath);

    // Construct the absolute URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;

    // Read the request body if it exists
    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      body = Buffer.concat(buffers);
    }

    // Convert Node.js request to Web Request
    const webRequest = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: body,
    });

    // Call the TanStack Start server handler
    const webResponse = await server.fetch(webRequest);

    // Copy response status and headers back to Node.js response
    res.statusCode = webResponse.status;
    webResponse.headers.forEach((value, key) => {
      // Avoid duplicate or invalid headers
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });

    // Write the body to Node.js response
    const responseBody = await webResponse.arrayBuffer();
    res.end(Buffer.from(responseBody));
  } catch (error) {
    console.error('SSR Bridge Error:', error);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end(`Internal Server Error inside SSR Bridge: ${error.message}\nStack: ${error.stack}`);
  }
}
