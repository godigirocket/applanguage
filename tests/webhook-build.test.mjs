import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

test("emitted webhook starts in Node with its compiled module dependencies", async () => {
  const root = process.cwd();
  fs.mkdirSync(path.join(root, "scratchpad"), { recursive: true });
  const outDir = fs.mkdtempSync(path.join(root, "scratchpad", "webhook-build-"));
  const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
  assert.equal(config.error, undefined);
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const program = ts.createProgram([path.join(root, "api/webhooks/cakto.ts")], {
    ...options,
    noEmit: false,
    rootDir: root,
    outDir,
  });
  assert.equal(program.emit().emitSkipped, false);
  const { default: handler } = await import(
    pathToFileURL(path.join(outDir, "api/webhooks/cakto.js")).href
  );
  let status;
  let payload;
  await handler(
    { method: "GET", headers: {} },
    {
      status(code) { status = code; return this; },
      json(body) { payload = body; return this; },
    },
  );
  assert.equal(status, 405);
  assert.equal(payload.error, "Method not allowed");
});
