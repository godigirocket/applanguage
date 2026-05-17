export default async function handler(req, res) {
  try {
    // Static literal import guarantees Vercel's esbuild compiler traces and bundles all server dependencies (like h3-v2, vinxi, react, etc.)!
    const { default: server } = await import('../server-build/server.js');

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
    res.setHeader('content-type', 'text/html; charset=utf-8');
    
    // Detailed error trace directly in browser for easy diagnostics
    const errorDetails = error 
      ? `<pre style="text-align: left; background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 0.5rem; overflow: auto; font-family: monospace; font-size: 0.85rem; margin-top: 1.5rem; max-height: 25rem; border: 1px solid #fca5a5;">${error.stack || error.message}</pre>` 
      : '';

    res.end(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 32rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
      ${errorDetails}
    </div>
  </body>
</html>`);
  }
}
