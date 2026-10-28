// Live validation of the replacement for paid chat/TTS services.
process.env.E2E_BASE_URL = process.env.PRODUCTION_BASE_URL || "https://langlume.vercel.app";
await import("./keyless-conversation.e2e.mjs");
