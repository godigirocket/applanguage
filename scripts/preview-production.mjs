// Local validation of the same built Node bridge used by Vercel.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import handler from "../api/index.js";
const root = path.resolve("dist");
const types = { ".js":"text/javascript", ".css":"text/css", ".webp":"image/webp", ".png":"image/png", ".svg":"image/svg+xml", ".mp3":"audio/mpeg", ".webmanifest":"application/manifest+json", ".json":"application/json", ".html":"text/html", ".woff2":"font/woff2" };
const server = http.createServer(async (req,res) => {
  const url = new URL(req.url,"http://127.0.0.1");
  let file;
  try { file = path.resolve(root,`.${decodeURIComponent(url.pathname)}`); } catch { res.writeHead(400); res.end(); return; }
  if (file.startsWith(root + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.setHeader("Content-Type",types[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(res); return;
  }
  await handler(req,res);
});
server.listen(Number(process.env.PREVIEW_PORT || 5174),"127.0.0.1",() => console.log("Production preview http://127.0.0.1:5174"));
