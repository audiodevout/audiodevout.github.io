"use strict";

const { detectIp } = require("./ip-detect");

const attempts = parseInt(process.argv[2], 10) || 3;
const delayMs = parseInt(process.argv[3], 10) || 2000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async function main() {
  for (let i = 0; i < attempts; i++) {
    const ip = detectIp();
    if (ip) {
      console.log(ip);
      process.exit(0);
    }
    if (i < attempts - 1) await sleep(delayMs);
  }
  console.error("ERROR");
  process.exit(1);
})();
