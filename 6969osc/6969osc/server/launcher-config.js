"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "config.json");
const EXAMPLE_PATH = path.join(ROOT, "config.example.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadConfigBase() {
  try {
    return readJson(CONFIG_PATH);
  } catch (_) {
    try {
      return readJson(EXAMPLE_PATH);
    } catch (_2) {
      return {};
    }
  }
}

const cmd = process.argv[2];

if (cmd === "merge-ip") {
  const ip = process.argv[3];
  if (!ip) {
    console.error("[FAIL] merge-ip requires IP argument");
    process.exit(1);
  }
  const merged = { ...loadConfigBase(), detectedIp: ip };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2));
  process.exit(0);
}

if (cmd === "read-port") {
  const c = loadConfigBase();
  console.log(c.wsPort || 3000);
  process.exit(0);
}

if (cmd === "read-osc") {
  const c = loadConfigBase();
  console.log(c.oscPort ?? 6969);
  console.log(c.oscHost || "127.0.0.1");
  process.exit(0);
}

if (cmd === "read-td") {
  const c = loadConfigBase();
  if (c.tdProjectPath) console.log(c.tdProjectPath);
  process.exit(0);
}

console.error("Usage: node launcher-config.js merge-ip|read-port|read-osc|read-td");
process.exit(1);
