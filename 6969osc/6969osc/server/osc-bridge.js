"use strict";

const dgram = require("dgram");
const osc = require("osc");

let config = {};
let socket = null;
const rateLimitMap = new Map();
let rateLimitIntervals = new Map();

const ADDRESS_REGEX = /^\/[a-zA-Z0-9\/_-]{1,64}$/;
const MAX_ADDRESS_LEN = 64;

function validateAddress(addr) {
  if (typeof addr !== "string" || !addr.startsWith("/")) return false;
  if (addr.length > MAX_ADDRESS_LEN) return false;
  return ADDRESS_REGEX.test(addr);
}

function doSend(encoded) {
  if (!socket) return;
  try {
    const buf = Buffer.from(encoded);
    socket.send(
      buf,
      0,
      buf.length,
      config.oscPort ?? 6969,
      config.oscHost || "127.0.0.1",
      (err) => {
        if (err) console.error("[OSC ERROR]", err.message);
      }
    );
  } catch (err) {
    console.error("[OSC ERROR]", err.message);
  }
}

function flushRateLimit(address) {
  const entry = rateLimitMap.get(address);
  if (!entry || entry.queue === undefined) return;
  const val = entry.queue;
  entry.queue = undefined;
  entry.lastSent = Date.now();
  try {
    const msg = {
      address,
      args: [{ type: "f", value: val }],
    };
    const encoded = osc.writePacket(msg);
    doSend(encoded);
  } catch (err) {
    console.error("[OSC ERROR]", err.message);
  }
}

function sendOsc(address, value) {
  if (!validateAddress(address)) {
    console.warn("[OSC] Invalid address:", address);
    return;
  }
  const num = Number(value);
  if (!Number.isFinite(num)) return;

  const now = Date.now();
  const interval = 1000 / (config.oscRateLimit || 60);
  let entry = rateLimitMap.get(address);

  if (!entry) {
    entry = { lastSent: 0, queue: undefined };
    rateLimitMap.set(address, entry);
  }

  const elapsed = now - entry.lastSent;
  if (elapsed >= interval) {
    const pendingTimer = rateLimitIntervals.get(address);
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      rateLimitIntervals.delete(address);
    }
    entry.lastSent = now;
    entry.queue = undefined;
    try {
      const msg = {
        address,
        args: [{ type: "f", value: num }],
      };
      const encoded = osc.writePacket(msg);
      doSend(encoded);
    } catch (err) {
      console.error("[OSC ERROR]", err.message);
    }
  } else {
    entry.queue = num;
    if (!rateLimitIntervals.has(address)) {
      const t = setTimeout(() => {
        rateLimitIntervals.delete(address);
        flushRateLimit(address);
      }, interval - elapsed);
      rateLimitIntervals.set(address, t);
    }
  }
}

function sendOscBundle(packets) {
  if (!Array.isArray(packets) || packets.length === 0) return;
  const valid = packets.filter((p) => p && validateAddress(p.address));
  if (valid.length === 0) return;

  try {
    const bundle = {
      timeTag: osc.timeTag(0),
      packets: valid.map((p) => ({
        address: p.address,
        args: [{ type: "f", value: Number(p.value) }],
      })),
    };
    const encoded = osc.writePacket(bundle);
    doSend(encoded);
  } catch (err) {
    console.error("[OSC ERROR]", err.message);
  }
}

const xyPending = new Map();
const xyTimers = new Map();

function flushXY(pad) {
  const key = `xy/${pad}`;
  const data = xyPending.get(key);
  xyPending.delete(key);
  xyTimers.delete(key);
  if (data) {
    sendOscBundle([
      { address: `/x${pad}`, value: data.x },
      { address: `/y${pad}`, value: data.y },
    ]);
  }
}

function sendOscXY(pad, x, y) {
  const key = `xy/${pad}`;
  const windowMs = config.oscBundleWindow || 16;

  xyPending.set(key, { x: Number(x), y: Number(y) });

  if (xyTimers.has(key)) {
    clearTimeout(xyTimers.get(key));
  }
  const timer = setTimeout(() => flushXY(pad), windowMs);
  xyTimers.set(key, timer);
}

function init(cfg) {
  const c = cfg && typeof cfg === "object" ? cfg : {};
  config = {
    oscPort: c.oscPort ?? 6969,
    oscHost: c.oscHost || "127.0.0.1",
    oscRateLimit: c.oscRateLimit,
    oscBundleWindow: c.oscBundleWindow,
    ...c,
  };
  if (socket) {
    try {
      socket.close();
    } catch (_) {}
  }
  socket = dgram.createSocket("udp4");
  socket.on("error", (err) => console.error("[OSC ERROR]", err.message));
  socket.bind(0, "127.0.0.1");
}

function close() {
  for (const t of rateLimitIntervals.values()) clearTimeout(t);
  for (const t of xyTimers.values()) clearTimeout(t);
  rateLimitIntervals.clear();
  xyTimers.clear();
  rateLimitMap.clear();
  xyPending.clear();
  if (socket) {
    try {
      socket.close();
    } catch (_) {}
    socket = null;
  }
}

module.exports = {
  sendOsc,
  sendOscBundle,
  sendOscXY,
  init,
  close,
};
