"use strict";

const http = require("http");

const port = parseInt(process.argv[2], 10) || 3000;
const timeoutMs = parseInt(process.argv[3], 10) || 30000;
const intervalMs = 500;
const start = Date.now();

function probe() {
  return new Promise((resolve) => {
    const req = http.get(
      { hostname: "127.0.0.1", port, path: "/api/ip", timeout: 2000 },
      (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      }
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

(async function main() {
  while (Date.now() - start < timeoutMs) {
    if (await probe()) {
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  console.error(`[FAIL] Server did not respond on port ${port} within ${timeoutMs / 1000}s`);
  process.exit(1);
})();
