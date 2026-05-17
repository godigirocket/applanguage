import path from 'node:path';

export default async function handler(req, res) {
  try {
    // Resolve server.js path dynamically at runtime using process.cwd()
    const serverPath = path.join(process.cwd(), 'dist', 'server', 'server.js');
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
    res.end(`Internal Server Error inside SSR Bridge: ${error.message}`);
  }
}
