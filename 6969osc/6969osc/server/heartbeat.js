"use strict";

let intervalId = null;
let config = {};

function getClientIp(ws) {
  try {
    return ws._socket?.remoteAddress || "unknown";
  } catch (_) {
    return "unknown";
  }
}

function sendPing(ws) {
  if (ws.readyState !== 1) return;
  if (ws._pongTimer) {
    clearTimeout(ws._pongTimer);
    ws._pongTimer = null;
  }
  const ts = Date.now();
  try {
    ws.send(JSON.stringify({ type: "ping", ts }));
  } catch (_) {}
  ws._awaitingPong = true;
  ws._pingTs = ts;

  const interval = config.heartbeatInterval || 5000;
  const missed = config.heartbeatTimeout || 3;
  const timeoutMs =
    typeof config.pongTimeoutMs === "number" && config.pongTimeoutMs > 0
      ? config.pongTimeoutMs
      : missed * interval;
  ws._pongTimer = setTimeout(() => {
    ws._pongTimer = null;
    if (ws._awaitingPong) {
      ws.missedPings = (ws.missedPings || 0) + 1;
      if (ws.missedPings >= (config.heartbeatTimeout || 3)) {
        const ip = getClientIp(ws);
        console.log("[WS] Client", ip, "timed out — terminating connection");
        try {
          ws.terminate();
        } catch (_) {}
      }
    }
  }, timeoutMs);
}

function onPong(ws) {
  ws._awaitingPong = false;
  if (ws._pongTimer) {
    clearTimeout(ws._pongTimer);
    ws._pongTimer = null;
  }
  ws.missedPings = 0;
}

function startHeartbeat(clients, cfg) {
  config = { ...cfg };
  if (intervalId) clearInterval(intervalId);

  const intervalMs = config.heartbeatInterval || 5000;
  intervalId = setInterval(() => {
    for (const ws of clients) {
      if (ws.readyState === 1) {
        sendPing(ws);
      }
    }
  }, intervalMs);
}

function stopHeartbeat() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

module.exports = {
  startHeartbeat,
  stopHeartbeat,
  onPong,
};
