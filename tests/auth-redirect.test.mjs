import test from "node:test";
import assert from "node:assert/strict";
import { safeAuthRedirect } from "../src/lib/auth-redirect.ts";

test("login preserves local destinations, search and anchors", () => {
  for (const path of ["/lessons", "/checkout?plan=premium_annual", "/dictionary?q=hello#saved"]) assert.equal(safeAuthRedirect(path), path);
});
test("login rejects external redirects, malformed URLs and authentication loops", () => {
  for (const path of [undefined, "https://evil.example", "//evil.example", "/%2Fevil.example", "/\\evil.example", "/%5Cevil.example", "/%00", "/login?redirect=/login", "/%6Cogin", "/signup/", "/reset-password", "/%zz"]) assert.equal(safeAuthRedirect(path), "/home");
});
