"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");
const { detectIp } = require("./ip-detect");
const oscBridge = require("./osc-bridge");
const heartbeat = require("./heartbeat");
const presetsStore = require("./presets");

const CONFIG_PATH = path.resolve(__dirname, "..", "config.json");
const PUBLIC_PATH = path.resolve(__dirname, "..", "public");
let config = {};
const clients = new Set();

const SCENE_COUNT = 16;

/** OSC address for grid index 0–15: /button1–8, /toggle1–8 */
function sceneOscAddress(index) {
  if (index >= 0 && index <= 7) return `/button${index + 1}`;
  if (index >= 8 && index <= 15) return `/toggle${index - 7}`;
  return null;
}

const KNOWN_TYPES = new Set(["scene", "xy", "master", "ping", "pong"]);

const currentState = {
  scenes: Array.from({ length: SCENE_COUNT }, () => false),
  activeScene: null,
  xy1: { x: 0.5, y: 0.5 },
  xy2: { x: 0.5, y: 0.5 },
  xy3: { x: 0.5, y: 0.5 },
  xy4: { x: 0.5, y: 0.5 },
  master: 1.0,
};

function loadConfig() {
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (_) {
    config = {};
  }
  const ip = detectIp();
  if (ip) config.detectedIp = ip;
  return config;
}

function getDetectedIp() {
  const ip = detectIp();
  if (ip) config.detectedIp = ip;
  return config.detectedIp || "0.0.0.0";
}

function broadcast(msg, exclude) {
  const data = JSON.stringify(msg);
  for (const ws of clients) {
    if (ws !== exclude && ws.readyState === 1) {
      try {
        ws.send(data);
      } catch (_) {}
    }
  }
}

function broadcastAll(msg) {
  broadcast(msg);
}

function sendError(ws, message) {
  if (ws && ws.readyState === 1) {
    try {
      ws.send(JSON.stringify({ type: "error", message }));
    } catch (_) {}
  }
}

function normalizeFullState(next) {
  const scenes = Array.isArray(next.scenes)
    ? next.scenes.slice(0, SCENE_COUNT).map(Boolean)
    : currentState.scenes.slice();
  while (scenes.length < SCENE_COUNT) scenes.push(false);

  let activeScene = null;
  for (let i = 0; i < scenes.length; i++) {
    if (scenes[i]) activeScene = i;
  }

  function xy(key) {
    const v = next[key];
    if (v && typeof v.x === "number" && typeof v.y === "number") {
      return {
        x: Math.max(0, Math.min(1, v.x)),
        y: Math.max(0, Math.min(1, v.y)),
      };
    }
    return { ...currentState[key] };
  }

  const master =
    typeof next.master === "number" && Number.isFinite(next.master)
      ? Math.max(0, Math.min(1, next.master))
      : currentState.master;

  return {
    scenes,
    activeScene,
    xy1: xy("xy1"),
    xy2: xy("xy2"),
    xy3: xy("xy3"),
    xy4: xy("xy4"),
    master,
  };
}

function applyFullState(next, options) {
  const opts = options || {};
  const normalized = normalizeFullState(next);

  currentState.scenes = normalized.scenes;
  currentState.activeScene = normalized.activeScene;
  currentState.xy1 = normalized.xy1;
  currentState.xy2 = normalized.xy2;
  currentState.xy3 = normalized.xy3;
  currentState.xy4 = normalized.xy4;
  currentState.master = normalized.master;

  for (let i = 0; i < SCENE_COUNT; i++) {
    const addr = sceneOscAddress(i);
    if (addr) oscBridge.sendOsc(addr, currentState.scenes[i] ? 1.0 : 0.0);
  }

  for (let pad = 1; pad <= 4; pad++) {
    const key = `xy${pad}`;
    const pt = currentState[key];
    oscBridge.sendOscXY(pad, pt.x, pt.y);
  }

  oscBridge.sendOsc("/master", currentState.master);

  if (opts.broadcast !== false) {
    broadcastAll({ type: "state-update", state: presetsStore.cloneState(currentState) });
  }

  return presetsStore.cloneState(currentState);
}

function validateMessage(msg) {
  if (!msg || typeof msg !== "object") return false;
  const t = msg.type;
  if (typeof t !== "string" || !KNOWN_TYPES.has(t)) return false;

  if (t === "scene") {
    const i = msg.index;
    if (typeof i !== "number" || !Number.isInteger(i) || i < 0 || i >= SCENE_COUNT)
      return false;
    if (typeof msg.active !== "boolean") return false;
    return true;
  }

  if (t === "xy") {
    const p = msg.pad;
    if (p !== 1 && p !== 2 && p !== 3 && p !== 4) return false;
    const x = msg.x,
      y = msg.y;
    if (
      typeof x !== "number" ||
      !Number.isFinite(x) ||
      x < 0 ||
      x > 1 ||
      typeof y !== "number" ||
      !Number.isFinite(y) ||
      y < 0 ||
      y > 1
    )
      return false;
    return true;
  }

  if (t === "master") {
    const v = msg.value;
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1) return false;
    return true;
  }

  if (t === "ping" || t === "pong") return true;

  return false;
}

function handleMessage(ws, msg) {
  if (!validateMessage(msg)) {
    sendError(ws, "Invalid message");
    return;
  }

  const t = msg.type;

  if (t === "scene") {
    const i = msg.index;
    currentState.scenes[i] = msg.active;
    if (msg.active) currentState.activeScene = i;
    else if (currentState.activeScene === i) currentState.activeScene = null;
    const addr = sceneOscAddress(i);
    if (addr) oscBridge.sendOsc(addr, msg.active ? 1.0 : 0.0);
    broadcast({ type: "scene-update", index: i, active: msg.active });
    return;
  }

  if (t === "xy") {
    const pad = msg.pad;
    const pt = { x: msg.x, y: msg.y };
    if (pad === 1) currentState.xy1 = pt;
    else if (pad === 2) currentState.xy2 = pt;
    else if (pad === 3) currentState.xy3 = pt;
    else currentState.xy4 = pt;
    oscBridge.sendOscXY(pad, msg.x, msg.y);
    return;
  }

  if (t === "master") {
    currentState.master = msg.value;
    oscBridge.sendOsc("/master", msg.value);
    return;
  }

  if (t === "pong") {
    heartbeat.onPong(ws);
    return;
  }

  if (t === "ping") {
    try {
      ws.send(
        JSON.stringify({
          type: "pong",
          ts: msg.ts,
          serverTs: Date.now(),
        })
      );
    } catch (_) {}
    heartbeat.onPong(ws);
    return;
  }
}

function sendJson(res, status, obj, noCache) {
  res.writeHead(status, { "Content-Type": "application/json", ...noCache });
  res.end(JSON.stringify(obj));
}

async function handleApi(req, res, urlPath, noCache) {
  if (req.method === "GET" && urlPath === "/api/ip") {
    sendJson(
      res,
      200,
      { ip: getDetectedIp(), port: config.wsPort || 3000 },
      noCache
    );
    return true;
  }

  if (req.method === "GET" && urlPath === "/api/presets") {
    sendJson(res, 200, { presets: presetsStore.listPresets() }, noCache);
    return true;
  }

  if (req.method === "POST" && urlPath === "/api/presets") {
    try {
      const preset = presetsStore.addPreset(currentState);
      sendJson(res, 201, { preset: { id: preset.id, name: preset.name, createdAt: preset.createdAt } }, noCache);
    } catch (err) {
      const status = err.code === "PRESET_LIMIT" ? 409 : 500;
      sendJson(res, status, { error: err.message || "Failed to save preset" }, noCache);
    }
    return true;
  }

  if (req.method === "POST" && urlPath === "/api/randomize") {
    const randomState = presetsStore.randomFullState(SCENE_COUNT);
    const applied = applyFullState(randomState);
    sendJson(res, 200, { state: applied }, noCache);
    return true;
  }

  const applyMatch = urlPath.match(/^\/api\/presets\/([^/]+)\/apply$/);
  if (req.method === "POST" && applyMatch) {
    const preset = presetsStore.getPreset(applyMatch[1]);
    if (!preset) {
      sendJson(res, 404, { error: "Preset not found" }, noCache);
      return true;
    }
    const applied = applyFullState(preset.state);
    sendJson(res, 200, { state: applied, preset: { id: preset.id, name: preset.name } }, noCache);
    return true;
  }

  const deleteMatch = urlPath.match(/^\/api\/presets\/([^/]+)$/);
  if (req.method === "DELETE" && deleteMatch) {
    const ok = presetsStore.deletePreset(deleteMatch[1]);
    sendJson(res, ok ? 200 : 404, ok ? { ok: true } : { error: "Preset not found" }, noCache);
    return true;
  }

  return false;
}

function injectServerVars(body) {
  return body
    .replace(/__SERVER_IP__/g, getDetectedIp())
    .replace(/__SERVER_PORT__/g, String(config.wsPort || 3000));
}

const server = http.createServer(async (req, res) => {
  const noCache = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
  };

  const urlPath = (req.url || "/").split("?")[0];

  if (urlPath.startsWith("/api/")) {
    try {
      if (await handleApi(req, res, urlPath, noCache)) return;
    } catch (err) {
      sendJson(res, 500, { error: err.message || "Server error" }, noCache);
      return;
    }
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const safePath =
    urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "").replace(/\.\./g, "");
  let filePath = path.join(PUBLIC_PATH, safePath || "index.html");
  const publicResolved = path.resolve(PUBLIC_PATH);
  filePath = path.resolve(filePath);
  if (!filePath.startsWith(publicResolved)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  const ext = path.extname(filePath);
  if (!ext) {
    filePath = path.join(PUBLIC_PATH, "index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      filePath = path.join(PUBLIC_PATH, "index.html");
      fs.readFile(filePath, (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        let body = injectServerVars(data2.toString());
        res.writeHead(200, { "Content-Type": "text/html", ...noCache });
        res.end(body);
      });
      return;
    }

    let body = data.toString();
    const contentType =
      ext === ".html"
        ? "text/html"
        : ext === ".css"
        ? "text/css"
        : ext === ".js"
        ? "application/javascript"
        : ext === ".json"
        ? "application/json"
        : "application/octet-stream";

    if (ext === ".html") {
      body = injectServerVars(body);
    }

    res.writeHead(200, { "Content-Type": contentType, ...noCache });
    res.end(body);
  });
});

const wss = new WebSocketServer({ server, maxPayload: 65536 });

wss.on("connection", (ws, req) => {
  const ip = req.socket?.remoteAddress || "unknown";
  console.log("[WS] Client connected from", ip);

  clients.add(ws);
  ws.missedPings = 0;

  try {
    ws.send(JSON.stringify({ type: "init", state: presetsStore.cloneState(currentState) }));
  } catch (_) {}

  ws.on("message", (data) => {
    try {
      const raw = data.toString();
      if (raw.length > 65536) return;
      const msg = JSON.parse(raw);
      handleMessage(ws, msg);
    } catch (err) {
      console.warn("[WS] Invalid message from", ip, "—", err.message);
    }
  });

  ws.on("close", () => {
    if (ws._pongTimer) {
      clearTimeout(ws._pongTimer);
      ws._pongTimer = null;
    }
    clients.delete(ws);
    console.log("[WS] Client disconnected");
  });

  ws.on("error", (err) => {
    if (ws._pongTimer) {
      clearTimeout(ws._pongTimer);
      ws._pongTimer = null;
    }
    console.error("[WS] Error:", err.message);
    clients.delete(ws);
  });
});

loadConfig();
oscBridge.init(config);
heartbeat.startHeartbeat(clients, config);

const ipRefreshInterval = config.ipRefreshInterval || 10000;
let lastIp = getDetectedIp();

setInterval(() => {
  const ip = detectIp();
  if (ip && ip !== lastIp) {
    lastIp = ip;
    config.detectedIp = ip;
    try {
      let fileConfig = {};
      try {
        fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
      } catch (_) {}
      fs.writeFileSync(
        CONFIG_PATH,
        JSON.stringify({ ...fileConfig, detectedIp: ip }, null, 2)
      );
    } catch (_) {}
    broadcast({
      type: "ip-changed",
      newIp: ip,
      port: config.wsPort || 3000,
    });
    console.log("[NET] IP changed to", ip);
  }
}, ipRefreshInterval);

const port = config.wsPort || 3000;
server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(
      `[FAIL] Port ${port} is already in use. Change wsPort in config.json or stop the other process.`
    );
  } else {
    console.error("[FAIL] HTTP server error:", err && err.message ? err.message : err);
  }
  process.exit(1);
});

server.listen(port, "0.0.0.0", () => {
  const oscPort = config.oscPort ?? 6969;
  const oscHost = config.oscHost || "127.0.0.1";
  console.log(
    `[OK] Listening HTTP/WebSocket :${port}  |  OSC UDP -> ${oscHost}:${oscPort}`
  );
});

function shutdown() {
  heartbeat.stopHeartbeat();
  oscBridge.close();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = { applyFullState, currentState };
