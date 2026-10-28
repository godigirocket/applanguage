import fs from "node:fs";
import path from "node:path";
import { generateSW } from "workbox-build";

const clientSrc = path.join(process.cwd(), "dist", "client");
const clientDest = path.join(process.cwd(), "dist");
const serverSrc = path.join(process.cwd(), "dist", "server");
const serverDest = path.join(process.cwd(), "server-build");

// TanStack's multi-environment build skips vite-plugin-pwa's client
// closeBundle hook. Generate the worker explicitly after both builds.
if (fs.existsSync(clientSrc)) {
  const { count, size, warnings } = await generateSW({
    globDirectory: clientSrc,
    swDest: path.join(clientSrc, "sw.js"),
    importScripts: ["/push-worker.js"],
    globPatterns: ["assets/*.css", "brand/*.webp", "favicon.svg", "pwa-*.png"],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: false,
    navigateFallback: undefined,
    runtimeCaching: [
      {
        urlPattern: ({ url, sameOrigin }) =>
          sameOrigin &&
          url.pathname.startsWith("/audio/") &&
          (url.pathname.endsWith(".mp3") || url.pathname.endsWith("credits.html")),
        handler: "CacheFirst",
        options: {
          cacheName: "lume-recorded-audio-v1",
          expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 90 },
          cacheableResponse: { statuses: [200] },
        },
      },
      {
        // Lesson SSR contains public course data only. Never cache profile,
        // auth pages, checkout or API responses. Previously visited lessons
        // can reopen offline; completion stays in the per-account outbox.
        urlPattern: ({ url, request, sameOrigin }) =>
          sameOrigin &&
          request.mode === "navigate" &&
          !url.search &&
          /^\/lesson\/lesson-(en|es|pt)-\d+$/.test(url.pathname),
        handler: "NetworkFirst",
        options: {
          cacheName: "lume-offline-lessons-v1",
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 7 },
          cacheableResponse: { statuses: [200] },
        },
      },
      {
        urlPattern: ({ url, sameOrigin }) =>
          sameOrigin && url.pathname.startsWith("/assets/") && url.pathname.endsWith(".js"),
        handler: "CacheFirst",
        options: {
          cacheName: "lume-feature-assets-v1",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
            purgeOnQuotaError: true,
          },
          cacheableResponse: { statuses: [200] },
        },
      },
    ],
  });
  for (const warning of warnings) console.warn(warning);
  console.log(
    `PWA: ${count} essential files, ${(size / 1024).toFixed(1)} KiB; JavaScript cached on use`,
  );
}

// 1. Copy client assets to dist root for CDN static hosting
if (fs.existsSync(clientSrc)) {
  const files = fs.readdirSync(clientSrc);
  for (const file of files) {
    fs.cpSync(path.join(clientSrc, file), path.join(clientDest, file), { recursive: true });
  }
  console.log("Copied dist/client to dist root for static CDN");
}

// 2. Copy server build to a separate server-build directory to bypass Vercel dist exclusion
if (fs.existsSync(serverSrc)) {
  if (fs.existsSync(serverDest)) {
    fs.rmSync(serverDest, { recursive: true, force: true });
  }
  fs.cpSync(serverSrc, serverDest, { recursive: true });
  console.log("Copied dist/server to server-build/ for Serverless Lambda bundling");
}
