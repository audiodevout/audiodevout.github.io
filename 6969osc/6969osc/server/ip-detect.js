"use strict";

const os = require("os");

const VIRTUAL_ADAPTER_NAMES = [
  "vmware",
  "virtualbox",
  "vethernet",
  "loopback",
  "hyper-v",
  "tap",
  "hamachi",
  "zerotier",
  "openvpn",
  "tailscale",
  "mullvad",
  "nordvpn",
  "expressvpn",
  "protonvpn",
  "cisco",
  "utun",
  "awdl",
];

function isVirtualAdapter(name) {
  if (!name || typeof name !== "string") return false;
  const lower = name.toLowerCase();
  return VIRTUAL_ADAPTER_NAMES.some((v) => lower.includes(v));
}

function scoreInterface(name, address) {
  let score = 0;
  const nameLower = (name || "").toLowerCase();
  if (
    nameLower.includes("wi-fi") ||
    nameLower.includes("wlan") ||
    nameLower.includes("wireless")
  ) {
    score += 3;
  }
  // macOS: primary NICs are en0, en1, … (often Wi‑Fi or Ethernet; beats VPN/bridge ties)
  if (process.platform === "darwin" && /^en\d+$/i.test((name || "").trim())) {
    score += 2;
  }
  if (address.startsWith("192.168.")) {
    score += 2;
  }
  if (address.startsWith("10.")) {
    score += 1;
  }
  if (address.startsWith("172.")) {
    const second = Number(address.split(".")[1]);
    if (second >= 16 && second <= 31) {
      score += 1;
    }
  }
  if (nameLower.includes("ethernet") || nameLower.includes("lan")) {
    score -= 1;
  }
  return score;
}

function detectIp() {
  const interfaces = os.networkInterfaces();
  let best = { ip: null, score: -Infinity };

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs || !Array.isArray(addrs)) continue;
    if (isVirtualAdapter(name)) continue;

    for (const addr of addrs) {
      if (!addr || addr.family !== "IPv4") continue;
      const a = addr.address;
      if (!a) continue;
      if (a.startsWith("127.")) continue;
      if (a.startsWith("169.254.")) continue;
      if (addr.internal === true) continue;

      const score = scoreInterface(name, a);
      if (score > best.score) {
        best = { ip: a, score };
      }
    }
  }

  return best.ip;
}

if (require.main === module) {
  const ip = detectIp();
  console.log(ip || "ERROR");
} else {
  module.exports = { detectIp };
}
