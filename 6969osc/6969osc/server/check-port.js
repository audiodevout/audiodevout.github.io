"use strict";

const { execSync } = require("child_process");

const port = parseInt(process.argv[2], 10) || 3000;
const isWin = process.platform === "win32";

function is6969oscProcess(cmdLine) {
  if (!cmdLine) return false;
  const lower = cmdLine.toLowerCase();
  return lower.includes("server/index.js") || lower.includes("server\\index.js");
}

if (isWin) {
  try {
    const out = execSync("netstat -ano", { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    const portRe = new RegExp(`:${port}\\s`);
    const lines = out.split(/\r?\n/).filter((l) => portRe.test(l) && /LISTENING/i.test(l));
    if (lines.length === 0) {
      process.exit(0);
    }
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (!pid || !/^\d+$/.test(pid)) continue;
      let cmdLine = "";
      try {
        cmdLine = execSync(
          `wmic process where "ProcessId=${pid}" get CommandLine /format:list`,
          { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
        );
      } catch (_) {
        console.error(`[FAIL] Port ${port} in use by PID ${pid} (could not identify process)`);
        process.exit(2);
      }
      if (is6969oscProcess(cmdLine)) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          console.log(`[OK] Stopped previous 6969osc server (PID ${pid})`);
        } catch (_) {
          console.error(`[FAIL] Could not stop 6969osc on port ${port} (PID ${pid})`);
          process.exit(3);
        }
      } else {
        console.error(
          `[FAIL] Port ${port} is already in use by another program (PID ${pid}). Change wsPort in config.json or stop that process.`
        );
        process.exit(2);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error("[FAIL] Port check failed:", err.message);
    process.exit(4);
  }
} else {
  try {
    let out = "";
    try {
      out = execSync(`lsof -t -i :${port} -sTCP:LISTEN`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
    } catch (_) {
      process.exit(0);
    }
    if (!out) process.exit(0);
    const pids = out.split(/\s+/).filter(Boolean);
    for (const pid of pids) {
      let cmdLine = "";
      try {
        cmdLine = execSync(`ps -p ${pid} -o args=`, {
          encoding: "utf8",
          stdio: ["pipe", "pipe", "ignore"],
        }).trim();
      } catch (_) {
        console.error(`[FAIL] Port ${port} in use by PID ${pid} (could not identify process)`);
        process.exit(2);
      }
      if (is6969oscProcess(cmdLine)) {
        try {
          execSync(`kill -9 ${pid}`, { stdio: "ignore" });
          console.log(`[OK] Stopped previous 6969osc server (PID ${pid})`);
        } catch (_) {
          console.error(`[FAIL] Could not stop 6969osc on port ${port} (PID ${pid})`);
          process.exit(3);
        }
      } else {
        console.error(
          `[FAIL] Port ${port} is already in use by another program (PID ${pid}). Change wsPort in config.json or stop that process.`
        );
        process.exit(2);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error("[FAIL] Port check failed:", err.message);
    process.exit(4);
  }
}
