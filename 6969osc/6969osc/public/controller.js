"use strict";

/* ========== 1. STATE ========== */
const SCENE_COUNT = 16;

const state = {
  scenes: Array.from({ length: SCENE_COUNT }, () => false),
  activeScene: null,
  xy1: { x: 0.5, y: 0.5 },
  xy2: { x: 0.5, y: 0.5 },
  xy3: { x: 0.5, y: 0.5 },
  xy4: { x: 0.5, y: 0.5 },
  master: 1.0,
};

function xyStateKey(pad) {
  return `xy${pad}`;
}

/* ========== 2. WEBSOCKET MANAGER ========== */
const BACKOFF_MS = [500, 1000, 2000, 4000, 8000, 15000];
const FAST_CONNECT_ATTEMPTS = 10;
const FAST_CONNECT_MS = 200;
const MAX_QUEUE = 20;
const MOMENTARY_LAST_INDEX = 7;

let ws = null;
let reconnectAttempt = 0;
let reconnectTimer = null;
let messageQueue = [];
let lastPongTs = 0;
let clientPingTimer = null;
let reconnectPaused = false;

function isMomentarySceneMsg(msg) {
  return (
    msg &&
    msg.type === "scene" &&
    typeof msg.index === "number" &&
    msg.index >= 0 &&
    msg.index <= MOMENTARY_LAST_INDEX
  );
}

function purgeMomentaryFromQueue() {
  messageQueue = messageQueue.filter((m) => !isMomentarySceneMsg(m));
}

function getWsAddr() {
  try {
    const u = new URL(window.VJC_SERVER || "ws://0.0.0.0:3000");
    return u.host;
  } catch (_) {
    return "---.---.---.---:----";
  }
}

function getHttpOrigin() {
  try {
    const u = new URL(window.VJC_SERVER || "ws://127.0.0.1:3000");
    return `http://${u.hostname}:${u.port || 3000}`;
  } catch (_) {
    return "http://127.0.0.1:3000";
  }
}

function updateStatusDot(klass) {
  const dot = document.getElementById("ws-dot");
  if (dot) {
    dot.classList.remove("connected", "connecting", "disconnected");
    if (klass) dot.classList.add(klass);
  }
}

function updateStatusAddr(addr) {
  const el = document.getElementById("ws-addr");
  if (el) el.textContent = addr || getWsAddr();
}

function updateStatusLabel(txt) {
  const el = document.querySelector(".vjc-status__label");
  if (el) el.textContent = txt || "WS";
}

function hapticShort() {
  if (navigator.vibrate) navigator.vibrate(12);
}

let toastTimer = null;
function showToast(message, durationMs = 4000) {
  const el = document.getElementById("vjc-toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("vjc-toast--visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("vjc-toast--visible");
    toastTimer = null;
  }, durationMs);
}

function send(msg) {
  if (isMomentarySceneMsg(msg)) {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(msg));
      return true;
    }
    return false;
  }

  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(msg));
    return true;
  }
  if (messageQueue.length < MAX_QUEUE) {
    messageQueue.push(msg);
  } else {
    messageQueue.shift();
    messageQueue.push(msg);
  }
  return false;
}

function flushQueue() {
  purgeMomentaryFromQueue();
  while (messageQueue.length > 0 && ws && ws.readyState === 1) {
    const msg = messageQueue.shift();
    ws.send(JSON.stringify(msg));
  }
}

function closeExistingWs() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws) {
    ws.onopen = null;
    ws.onmessage = null;
    ws.onclose = null;
    ws.onerror = null;
    if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
      try {
        ws.close();
      } catch (_) {}
    }
    ws = null;
  }
}

async function probeServer() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch(`${getHttpOrigin()}/api/ip`, {
      cache: "no-store",
      signal: ctrl.signal,
    });
    clearTimeout(t);
    return res.ok;
  } catch (_) {
    return false;
  }
}

function scheduleReconnect() {
  if (reconnectPaused) return;
  const delay =
    reconnectAttempt < FAST_CONNECT_ATTEMPTS
      ? FAST_CONNECT_MS
      : BACKOFF_MS[Math.min(reconnectAttempt - FAST_CONNECT_ATTEMPTS, BACKOFF_MS.length - 1)];
  reconnectAttempt++;
  updateStatusLabel(
    reconnectAttempt <= FAST_CONNECT_ATTEMPTS ? "CONNECTING…" : `RECONNECT ${reconnectAttempt}`
  );
  reconnectTimer = setTimeout(connect, delay);
}

function connect() {
  if (reconnectPaused) return;

  closeExistingWs();

  const url = window.VJC_SERVER || "ws://127.0.0.1:3000";
  updateStatusDot("connecting");
  updateStatusAddr(url.replace(/^ws:\/\//, "").replace(/\/$/, ""));
  updateStatusLabel("CONNECTING…");

  probeServer().then((ok) => {
    if (reconnectPaused) return;

    ws = new WebSocket(url);

    ws.onopen = () => {
      reconnectAttempt = 0;
      lastPongTs = Date.now();
      updateStatusDot("connected");
      updateStatusAddr(getWsAddr());
      updateStatusLabel("WS");
      flushQueue();
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const t = msg.type;
        if (t === "init" || t === "state-update") {
          Object.assign(state, msg.state || {});
          applyState();
        } else if (t === "scene-update") {
          if (msg.index >= 0 && msg.index < SCENE_COUNT) {
            state.scenes[msg.index] = msg.active;
            applySceneLEDs();
          }
        } else if (t === "ip-changed") {
          window.VJC_SERVER = `ws://${msg.newIp}:${msg.port}`;
          showToast("Network updated — reconnecting…");
          reconnectAttempt = 0;
          closeExistingWs();
          setTimeout(connect, 100);
        } else if (t === "ping") {
          send({ type: "pong", ts: typeof msg.ts === "number" ? msg.ts : Date.now() });
        } else if (t === "pong") {
          lastPongTs = Date.now();
        } else if (t === "error") {
          showToast(msg.message || "Server error");
        }
      } catch (_) {}
    };

    ws.onclose = () => {
      updateStatusDot("disconnected");
      purgeMomentaryFromQueue();
      scheduleReconnect();
    };

    ws.onerror = () => {};

    if (!ok && reconnectAttempt === 0) {
      updateStatusLabel("WAITING FOR SERVER…");
    }
  });
}

/* ========== 3. CLIENT HEARTBEAT ========== */
function startClientHeartbeat() {
  if (clientPingTimer) clearInterval(clientPingTimer);
  clientPingTimer = setInterval(() => {
    if (ws && ws.readyState === 1) {
      send({ type: "ping", ts: Date.now() });
      if (Date.now() - lastPongTs > 10000) {
        ws.close();
      }
    }
  }, 8000);
}

/* ========== 4. SCENE BUTTONS ========== */
function sceneOscTicker(index) {
  if (index >= 0 && index <= 7) return `/button${index + 1}`;
  if (index >= 8 && index <= 15) return `/toggle${index - 7}`;
  return "";
}

function applySceneLEDs() {
  document.querySelectorAll(".vjc-scene").forEach((btn, i) => {
    const on = state.scenes[i];
    btn.classList.toggle("vjc-scene--lit", on);
    btn.classList.remove("vjc-scene--active");
    if (i > MOMENTARY_LAST_INDEX) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
  });
}

function applyState() {
  applySceneLEDs();
  const cf = document.getElementById("crossfader");
  if (cf) {
    const v = state.master;
    cf.style.setProperty("--fill", v);
    cf.style.setProperty("--thumb-x", v);
    cf.dataset.value = v;
    const valEl = cf.querySelector(".vjc-crossfader__value");
    if (valEl) valEl.textContent = v.toFixed(2);
    cf.classList.toggle("vjc-crossfader--danger", v < 0.1 || v > 0.9);
  }
  document.querySelectorAll(".vjc-xy").forEach((pad) => {
    const n = parseInt(pad.dataset.pad, 10);
    const key = xyStateKey(n);
    const xy = state[key] || { x: 0.5, y: 0.5 };
    pad.style.setProperty("--cx", xy.x);
    pad.style.setProperty("--cy", xy.y);
  });
}

function releaseMomentary(btn, index, pointerId) {
  if (pointerId != null) {
    try {
      btn.releasePointerCapture(pointerId);
    } catch (_) {}
  }
  send({ type: "scene", index, active: false });
  btn.classList.remove("vjc-scene--active");
}

function initScenes() {
  const grid = document.querySelector(".vjc-scenes__grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (let i = 0; i < SCENE_COUNT; i++) {
    const btn = document.createElement("button");
    btn.className = "vjc-scene";
    btn.dataset.index = i;
    const num = i + 1;
    const numLabel = num < 10 ? `0${num}` : String(num);
    btn.innerHTML = `<span class="vjc-scene__num">${numLabel}</span><span class="vjc-scene__led"></span>`;

    if (i <= MOMENTARY_LAST_INDEX) {
      let activePointerId = null;

      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        hapticShort();
        activePointerId = e.pointerId;
        try {
          btn.setPointerCapture(e.pointerId);
        } catch (_) {}
        send({ type: "scene", index: i, active: true });
        btn.classList.add("vjc-scene--active");
        updateOscTicker(sceneOscTicker(i));
      });

      btn.addEventListener("pointerup", (e) => {
        e.preventDefault();
        if (activePointerId == null || e.pointerId === activePointerId) {
          releaseMomentary(btn, i, activePointerId);
          activePointerId = null;
        }
      });

      btn.addEventListener("pointercancel", (e) => {
        e.preventDefault();
        if (activePointerId != null && e.pointerId === activePointerId) {
          releaseMomentary(btn, i, activePointerId);
          activePointerId = null;
        }
      });

      btn.addEventListener("lostpointercapture", (e) => {
        if (activePointerId != null && e.pointerId === activePointerId) {
          releaseMomentary(btn, i, null);
          activePointerId = null;
        }
      });
    } else {
      btn.classList.add("vjc-scene--toggle");
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        hapticShort();
        const next = !state.scenes[i];
        state.scenes[i] = next;
        applySceneLEDs();
        send({ type: "scene", index: i, active: next });
        updateOscTicker(sceneOscTicker(i));
      });
    }

    grid.appendChild(btn);
  }
  applySceneLEDs();
}

/* ========== 5. MASTER (opacity) ========== */
function setupMasterCrossfader(el) {
  const track = el.querySelector(".vjc-crossfader__track");
  if (!track) return;
  const valueEl = el.querySelector(".vjc-crossfader__value");
  let rafId = null;
  let activePointerId = null;

  function setValue(v) {
    v = Math.max(0, Math.min(1, v));
    el.style.setProperty("--fill", v);
    el.style.setProperty("--thumb-x", v);
    el.dataset.value = v;
    if (valueEl) valueEl.textContent = v.toFixed(2);
    el.classList.toggle("vjc-crossfader--danger", v < 0.1 || v > 0.9);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = null;
      state.master = v;
      send({ type: "master", value: v });
      updateOscTicker("/master");
    });
  }

  function onMove(e) {
    const rect = track.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setValue(x);
  }

  function onUp(e) {
    track.removeEventListener("pointermove", onMoveIfCaptured);
    if (activePointerId != null && (!e || e.pointerId === activePointerId)) {
      try {
        track.releasePointerCapture(activePointerId);
      } catch (_) {}
      activePointerId = null;
    }
  }

  function onMoveIfCaptured(e) {
    if (track.hasPointerCapture(e.pointerId)) onMove(e);
  }

  track.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    activePointerId = e.pointerId;
    track.setPointerCapture(e.pointerId);
    onMove(e);
    track.addEventListener("pointermove", onMoveIfCaptured);
  });

  track.addEventListener("pointerup", onUp);
  track.addEventListener("pointercancel", onUp);
  track.addEventListener("lostpointercapture", onUp);
}

/* ========== 6. XY PADS ========== */
function setupXYPad(padEl) {
  const pad = parseInt(padEl.dataset.pad, 10);
  let rafId = null;

  padEl.style.touchAction = "none";

  function setXY(e) {
    const rect = padEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    padEl.style.setProperty("--cx", x);
    padEl.style.setProperty("--cy", y);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const key = xyStateKey(pad);
      state[key] = { x, y };
      send({ type: "xy", pad, x, y });
      updateOscTicker(`/x${pad}`);
    });
  }

  padEl.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    padEl.setPointerCapture(e.pointerId);
    setXY(e);
  });

  padEl.addEventListener("pointermove", (e) => {
    if (padEl.hasPointerCapture(e.pointerId)) {
      setXY(e);
    }
  });

  padEl.addEventListener("pointerup", (e) => {
    padEl.releasePointerCapture?.(e.pointerId);
  });

  padEl.addEventListener("pointercancel", (e) => {
    padEl.releasePointerCapture?.(e.pointerId);
  });
}

/* ========== 7. WAKE LOCK ========== */
let wakeLock = null;

async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      const icon = document.getElementById("wake-icon");
      if (icon) icon.textContent = "☀";
    }
  } catch (_) {
    const icon = document.getElementById("wake-icon");
    if (icon) icon.style.display = "none";
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && wakeLock === null) {
    requestWakeLock();
  }
});

/* ========== 8. NETWORK CHANGE ========== */
window.addEventListener("offline", () => {
  updateStatusDot("disconnected");
  updateStatusLabel("OFFLINE");
  reconnectPaused = true;
  purgeMomentaryFromQueue();
  closeExistingWs();
});

window.addEventListener("online", () => {
  updateStatusLabel("NETWORK RESTORED — RECONNECTING");
  reconnectPaused = false;
  reconnectAttempt = 0;
  connect();
});

/* ========== 9. OSC TICKER ========== */
let tickerClearTimer = null;

function updateOscTicker(addr) {
  const el = document.getElementById("osc-ticker");
  const led = document.getElementById("signal-led");
  if (el) {
    el.textContent = addr;
    el.classList.remove("ticker-in");
    void el.offsetWidth;
    el.classList.add("ticker-in");
  }
  if (led) {
    led.classList.remove("active");
    void led.offsetWidth;
    led.classList.add("active");
  }
  if (tickerClearTimer) clearTimeout(tickerClearTimer);
  tickerClearTimer = setTimeout(() => {
    if (el) el.textContent = "";
    tickerClearTimer = null;
  }, 1500);
}

/* ========== 10. PRESETS & RANDOMIZE ========== */
async function apiPost(path) {
  const res = await fetch(`${getHttpOrigin()}${path}`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

async function savePreset() {
  try {
    const data = await apiPost("/api/presets");
    showToast(`Saved ${data.preset?.name || "preset"}`);
    hapticShort();
  } catch (err) {
    showToast(err.message || "Could not save preset");
  }
}

async function randomizeLevels() {
  try {
    const data = await apiPost("/api/randomize");
    if (data.state) {
      Object.assign(state, data.state);
      applyState();
    }
    showToast("Randomized");
    hapticShort();
  } catch (err) {
    showToast(err.message || "Randomize failed");
  }
}

function setupToolbar() {
  const saveBtn = document.getElementById("btn-save-preset");
  const randomBtn = document.getElementById("btn-randomize");
  if (saveBtn) saveBtn.addEventListener("click", () => savePreset());
  if (randomBtn) randomBtn.addEventListener("click", () => randomizeLevels());
}

/* ========== INIT ========== */
function init() {
  initScenes();

  const crossfader = document.getElementById("crossfader");
  if (crossfader) setupMasterCrossfader(crossfader);

  document.querySelectorAll(".vjc-xy").forEach(setupXYPad);
  setupToolbar();

  requestWakeLock();
  connect();
  startClientHeartbeat();
  applyState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
