/**
 * 6969osc — animated canvas preview of the phone controller UI.
 */
(function () {
  "use strict";

  var COLORS = {
    bg: "#0a0a0a",
    surface: "#111111",
    surfaceHi: "#161616",
    accent: "#e8710a",
    accentDeep: "#c44a00",
    signal: "#39ff14",
    text: "#c8c0b0",
    textMuted: "#6a6258",
    border: "#2a2520",
    borderHi: "#3a322c",
    danger: "#cc2200",
    finger: "rgba(255, 200, 140, 0.35)",
    fingerRing: "rgba(232, 113, 10, 0.85)",
  };

  var W = 360;
  var H = 640;
  var PAD = 8;
  var STATUS_H = 40;

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function createInitialState() {
    return {
      connected: false,
      ticker: "",
      tickerFlash: 0,
      signalFlash: 0,
      scenes: Array.from({ length: 16 }, function () {
        return { lit: false, active: false, toggle: false };
      }),
      master: 1,
      xy: [
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 0.5 },
      ],
      finger: { x: W * 0.5, y: H * 0.55, down: false, opacity: 0 },
      caption: "Scan QR · same Wi‑Fi · controller loads in the browser",
    };
  }

  /** Timeline segments — loop duration ~22s */
  function buildTimeline() {
    var steps = [];

    function at(t, fn, caption) {
      steps.push({ t: t, fn: fn, caption: caption || null });
    }

    at(0, function (st) {
      st.connected = true;
      st.caption = "WebSocket connected — status dot turns green";
    });

    at(1.2, function (st) {
      st.finger = { x: 92, y: 118, down: true, opacity: 1 };
      st.scenes[2].active = true;
      st.ticker = "/button3";
      st.tickerFlash = 1;
      st.signalFlash = 1;
      st.caption = "Pads 01–08 — momentary (press and release)";
    }, "Pads 01–08 — momentary triggers");

    at(1.85, function (st) {
      st.scenes[2].active = false;
      st.finger.down = false;
    });

    at(2.6, function (st) {
      st.finger = { x: 268, y: 118, down: true, opacity: 1 };
      st.scenes[6].active = true;
      st.ticker = "/button7";
      st.tickerFlash = 1;
      st.signalFlash = 1;
    });

    at(3.2, function (st) {
      st.scenes[6].active = false;
      st.finger = { x: W * 0.5, y: H * 0.55, down: false, opacity: 0 };
    });

    at(4, function (st) {
      st.finger = { x: 92, y: 198, down: true, opacity: 1 };
      st.scenes[10].lit = true;
      st.scenes[10].toggle = true;
      st.ticker = "/toggle3";
      st.tickerFlash = 1;
      st.signalFlash = 1;
      st.caption = "Pads 09–16 — toggle on/off";
    }, "Pads 09–16 — latch toggles");

    at(4.7, function (st) {
      st.finger = { x: 268, y: 198, down: true, opacity: 1 };
      st.scenes[13].lit = true;
      st.scenes[13].toggle = true;
      st.ticker = "/toggle6";
      st.tickerFlash = 1;
      st.signalFlash = 1;
    });

    at(5.4, function (st) {
      st.finger = { x: W * 0.5, y: H * 0.55, down: false, opacity: 0 };
    });

    at(6.2, function (st) {
      st.finger = { x: 180, y: 318, down: true, opacity: 1 };
      st.ticker = "/master";
      st.tickerFlash = 1;
      st.signalFlash = 1;
      st.caption = "Master fader — opacity /master";
    }, "Master opacity fader");

    at(8.6, function (st) {
      st.finger = { x: W * 0.5, y: H * 0.55, down: false, opacity: 0 };
    });

    at(9.4, function (st) {
      st.finger = { x: 100, y: 420, down: true, opacity: 1 };
      st.ticker = "/x1";
      st.tickerFlash = 1;
      st.signalFlash = 1;
      st.caption = "Four XY pads — bundled /x /y OSC";
    }, "XY pads — position cursors");

    at(12.2, function (st) {
      st.finger = { x: 260, y: 520, down: true, opacity: 1 };
      st.ticker = "/x3";
      st.tickerFlash = 1;
      st.signalFlash = 1;
    });

    at(13.8, function (st) {
      st.finger = { x: W * 0.5, y: H * 0.55, down: false, opacity: 0 };
    });

    at(14.8, function (st) {
      st.caption = "Every touch → WebSocket → OSC (UDP) → TouchDesigner";
    }, "WebSocket in · OSC out");

    at(16, function (st) {
      st.caption = "Save presets with + · recall on the preset page";
      st.ticker = "PRESET 2";
      st.tickerFlash = 1;
    }, "Presets — save and recall full looks");

    at(17.5, function (st) {
      st.scenes[10].lit = true;
      st.scenes[13].lit = true;
      st.ticker = "/master";
      st.tickerFlash = 1;
      st.signalFlash = 1;
    });

    at(19, function (st) {
      st.caption = "RND randomizes all levels in one tap";
      st.ticker = "RANDOM";
      st.tickerFlash = 1;
      st.signalFlash = 1;
    }, "Randomize — one-tap chaos");

    return { steps: steps, duration: 22 };
  }

  function masterAt(t) {
    if (t < 6.2) return 1;
    if (t < 7.4) return lerp(1, 0.62, easeInOut(clamp((t - 6.2) / 1.1, 0, 1)));
    if (t < 8.6) return lerp(0.62, 0.38, easeInOut(clamp((t - 7.4) / 1.1, 0, 1)));
    if (t < 17.5) return 0.38;
    if (t < 19) return lerp(0.38, 0.85, easeInOut(clamp((t - 17.5) / 1.2, 0, 1)));
    if (t < 20.5) return 0.71;
    return 1;
  }

  function xyAt(t, pad) {
    var pts = [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
    ];
    if (t >= 9.4 && t < 11) {
      var p0 = easeInOut(clamp((t - 9.4) / 1.4, 0, 1));
      pts[0] = { x: lerp(0.5, 0.72, p0), y: lerp(0.5, 0.28, p0) };
    } else if (t >= 11 && t < 12.2) {
      var p1 = easeInOut(clamp((t - 11) / 1.1, 0, 1));
      pts[0] = { x: lerp(0.72, 0.22, p1), y: lerp(0.28, 0.78, p1) };
    } else if (t >= 12.2 && t < 13.8) {
      var p2 = easeInOut(clamp((t - 12.2) / 1.4, 0, 1));
      pts[0] = { x: 0.22, y: 0.78 };
      pts[2] = { x: lerp(0.5, 0.65, p2), y: lerp(0.5, 0.55, p2) };
    } else if (t >= 13.8 && t < 17.5) {
      pts[0] = { x: 0.22, y: 0.78 };
      pts[2] = { x: 0.65, y: 0.55 };
    } else if (t >= 17.5 && t < 19) {
      pts[0] = { x: 0.4, y: 0.6 };
      pts[2] = { x: 0.3, y: 0.35 };
    } else if (t >= 19 && t < 20.5) {
      pts[0] = { x: 0.82, y: 0.15 };
      pts[1] = { x: 0.18, y: 0.62 };
      pts[2] = { x: 0.55, y: 0.88 };
      pts[3] = { x: 0.92, y: 0.42 };
    }
    return pts[pad];
  }

  function randomScenesAt(t) {
    if (t < 19 || t >= 20.5) return null;
    var on = [false, false, true, false, false, false, true, false, true, false, true, false, false, true, false, false];
    return on;
  }

  function applyTimeline(state, elapsed, timeline) {
    var t = elapsed % timeline.duration;
    var base = createInitialState();
    Object.assign(state, base);

    for (var i = 0; i < timeline.steps.length; i++) {
      if (timeline.steps[i].t <= t) {
        timeline.steps[i].fn(state);
        if (timeline.steps[i].caption) {
          state.caption = timeline.steps[i].caption;
        }
      }
    }

    state.master = masterAt(t);
    for (var p = 0; p < 4; p++) {
      state.xy[p] = xyAt(t, p);
    }

    if (t >= 6.2 && t < 8.6 && state.finger.opacity > 0) {
      var trackW = W - PAD * 2;
      var thumbW = 48;
      state.finger.x = PAD + state.master * (trackW - thumbW) + thumbW * 0.5;
    }

    var rnd = randomScenesAt(t);
    if (rnd) {
      for (var s = 0; s < 16; s++) {
        state.scenes[s].lit = rnd[s];
        state.scenes[s].toggle = s > 7;
        state.scenes[s].active = false;
      }
    }

    if (state.finger.opacity > 0 && t >= 9.4 && t < 13.8) {
      var pad = t < 12.2 ? 0 : 2;
      var rect = getXYRect(pad);
      state.finger.x = rect.x + state.xy[pad].x * rect.w;
      state.finger.y = rect.y + state.xy[pad].y * rect.h;
    }

    state.tickerFlash = Math.max(0, state.tickerFlash - 0.04);
    state.signalFlash = Math.max(0, state.signalFlash - 0.06);
  }

  function layout() {
    var innerH = H - PAD * 2 - STATUS_H;
    var sceneH = Math.floor(innerH * 0.34);
    var masterH = Math.floor(innerH * 0.14);
    var xyH = innerH - sceneH - masterH;
    return {
      status: { x: PAD, y: PAD, w: W - PAD * 2, h: STATUS_H },
      scenes: { x: PAD, y: PAD + STATUS_H + 4, w: W - PAD * 2, h: sceneH },
      master: { x: PAD, y: PAD + STATUS_H + 4 + sceneH + 4, w: W - PAD * 2, h: masterH },
      xy: { x: PAD, y: PAD + STATUS_H + 4 + sceneH + 4 + masterH + 4, w: W - PAD * 2, h: xyH },
    };
  }

  function getXYRect(padIndex) {
    var L = layout();
    var col = padIndex % 2;
    var row = Math.floor(padIndex / 2);
    var gap = 8;
    var cw = (L.xy.w - gap) / 2;
    var ch = (L.xy.h - gap) / 2;
    return {
      x: L.xy.x + col * (cw + gap),
      y: L.xy.y + row * (ch + gap) + 20,
      w: cw,
      h: ch - 20,
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawStatus(ctx, state, L) {
    var s = L.status;
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(s.x, s.y, s.w, s.h);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y + s.h);
    ctx.lineTo(s.x + s.w, s.y + s.h);
    ctx.stroke();

    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.fillStyle = COLORS.accent;
    ctx.fillText("6969osc", s.x + 6, s.y + 24);

    ctx.beginPath();
    ctx.arc(s.x + 72, s.y + 20, 4, 0, Math.PI * 2);
    ctx.fillStyle = state.connected ? COLORS.signal : COLORS.danger;
    ctx.fill();

    ctx.font = '9px "IBM Plex Mono", monospace';
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("WS", s.x + 82, s.y + 24);

    ctx.fillStyle = COLORS.text;
    ctx.font = '9px "IBM Plex Mono", monospace';
    ctx.fillText("192.168.1.42:3000", s.x + 98, s.y + 24);

    if (state.ticker && state.tickerFlash > 0) {
      ctx.fillStyle = COLORS.accent;
      ctx.globalAlpha = 0.6 + state.tickerFlash * 0.4;
      ctx.fillText(state.ticker, s.x + s.w * 0.42, s.y + 24);
      ctx.globalAlpha = 1;
    }

    if (state.signalFlash > 0) {
      ctx.beginPath();
      ctx.arc(s.x + s.w - 14, s.y + 20, 3, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.signal;
      ctx.globalAlpha = state.signalFlash;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawScene(ctx, x, y, w, h, index, scene) {
    var num = index + 1;
    var label = num < 10 ? "0" + num : String(num);
    var isToggle = index > 7;
    var lit = scene.lit || scene.active;

    ctx.fillStyle = lit ? COLORS.accent : COLORS.surface;
    if (isToggle && !lit) {
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = 1;
      roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 6);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      if (!lit) {
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 1;
        roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 6);
        ctx.stroke();
      } else if (isToggle) {
        ctx.strokeStyle = COLORS.accentDeep;
        ctx.lineWidth = 1;
        roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 6);
        ctx.stroke();
      }
    }

    if (scene.active) {
      ctx.shadowColor = COLORS.accent;
      ctx.shadowBlur = 12;
      roundRect(ctx, x, y, w, h, 6);
      ctx.fillStyle = COLORS.accent;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillStyle = lit || scene.active ? "#0a0a0a" : COLORS.textMuted;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2);

    ctx.beginPath();
    ctx.arc(x + w - 10, y + 10, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = lit && !isToggle ? COLORS.accent : lit && isToggle ? "#1a1208" : COLORS.border;
    if (lit && !isToggle) {
      ctx.shadowColor = COLORS.accent;
      ctx.shadowBlur = 6;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawScenes(ctx, state, L) {
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("BUTTONS", L.scenes.x, L.scenes.y + 10);

    var gridY = L.scenes.y + 18;
    var gridH = L.scenes.h - 18;
    var gap = 8;
    var cols = 4;
    var cellW = (L.scenes.w - gap * (cols - 1)) / cols;
    var cellH = (gridH - gap * 3) / 4;

    for (var i = 0; i < 16; i++) {
      var col = i % 4;
      var row = Math.floor(i / 4);
      drawScene(
        ctx,
        L.scenes.x + col * (cellW + gap),
        gridY + row * (cellH + gap),
        cellW,
        cellH,
        i,
        state.scenes[i]
      );
    }
  }

  function drawMaster(ctx, state, L) {
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("MASTER", L.master.x, L.master.y + 10);

    var trackY = L.master.y + 22;
    var trackH = 52;
    var trackW = L.master.w;

    ctx.fillStyle = COLORS.surface;
    roundRect(ctx, L.master.x, trackY, trackW, trackH, 4);
    ctx.fill();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    roundRect(ctx, L.master.x + 0.5, trackY + 0.5, trackW - 1, trackH - 1, 4);
    ctx.stroke();

    var fillW = trackW * state.master;
    var fillY = trackY + trackH / 2 - 3;
    ctx.fillStyle = COLORS.accent;
    ctx.globalAlpha = 0.7;
    roundRect(ctx, L.master.x, fillY, fillW, 6, 3);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = COLORS.borderHi;
    ctx.beginPath();
    ctx.moveTo(L.master.x + trackW * 0.5, trackY + trackH * 0.2);
    ctx.lineTo(L.master.x + trackW * 0.5, trackY + trackH * 0.8);
    ctx.stroke();

    var thumbW = 48;
    var thumbH = 24;
    var thumbX = L.master.x + state.master * (trackW - thumbW);
    var thumbY = trackY + trackH / 2 - thumbH / 2;
    ctx.shadowColor = COLORS.accent;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.accent;
    roundRect(ctx, thumbX, thumbY, thumbW, thumbH, 12);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("OPACITY", L.master.x, trackY - 4);

    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = COLORS.accent;
    ctx.textAlign = "right";
    ctx.fillText(state.master.toFixed(2), L.master.x + trackW, trackY + trackH + 14);
    ctx.textAlign = "left";
  }

  function drawXY(ctx, state, L) {
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("XY", L.xy.x, L.xy.y + 10);

    var gap = 8;
    var cw = (L.xy.w - gap) / 2;
    var ch = (L.xy.h - gap) / 2;
    var baseY = L.xy.y + 18;

    for (var i = 0; i < 4; i++) {
      var col = i % 2;
      var row = Math.floor(i / 2);
      var px = L.xy.x + col * (cw + gap);
      var py = baseY + row * (ch + gap);

      ctx.fillStyle = COLORS.surface;
      roundRect(ctx, px, py, cw, ch, 6);
      ctx.fill();
      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = 1;
      roundRect(ctx, px + 0.5, py + 0.5, cw - 1, ch - 1, 6);
      ctx.stroke();

      ctx.strokeStyle = COLORS.borderHi;
      ctx.beginPath();
      ctx.moveTo(px, py + ch / 2);
      ctx.lineTo(px + cw, py + ch / 2);
      ctx.moveTo(px + cw / 2, py);
      ctx.lineTo(px + cw / 2, py + ch);
      ctx.stroke();

      var pt = state.xy[i];
      var cx = px + pt.x * (cw - 10) + 5;
      var cy = py + pt.y * (ch - 10) + 5;
      ctx.shadowColor = COLORS.accent;
      ctx.shadowBlur = 10;
      ctx.fillStyle = COLORS.accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.fillStyle = COLORS.textMuted;
      ctx.fillText(String(i + 1), px + 6, py + 14);
    }
  }

  function drawFinger(ctx, state) {
    var f = state.finger;
    if (f.opacity <= 0.01) return;

    ctx.globalAlpha = f.opacity * 0.45;
    ctx.fillStyle = COLORS.finger;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = f.opacity;
    ctx.strokeStyle = COLORS.fingerRing;
    ctx.lineWidth = f.down ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.down ? 14 : 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawFrame(ctx, state) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    var L = layout();
    drawStatus(ctx, state, L);
    drawScenes(ctx, state, L);
    drawMaster(ctx, state, L);
    drawXY(ctx, state, L);
    drawFinger(ctx, state);
  }

  function init() {
    var canvas = document.getElementById("osc-demo-canvas");
    if (!canvas) return;

    var captionEl = document.getElementById("osc-demo-caption");
    var wrap = canvas.closest(".osc-demo-phone");
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var timeline = buildTimeline();
    var state = createInitialState();
    var start = performance.now();
    var reduced = prefersReducedMotion();

    if (reduced) {
      state.connected = true;
      state.scenes[2].active = false;
      state.scenes[10].lit = true;
      state.scenes[10].toggle = true;
      state.scenes[13].lit = true;
      state.scenes[13].toggle = true;
      state.master = 0.48;
      state.xy[0] = { x: 0.65, y: 0.35 };
      state.xy[2] = { x: 0.4, y: 0.7 };
      state.ticker = "/master";
      drawFrame(ctx, state);
      if (captionEl) captionEl.textContent = "Controller layout — pads, master fader, and XY pads";
      return;
    }

    function frame(now) {
      var elapsed = (now - start) / 1000;
      applyTimeline(state, elapsed, timeline);
      drawFrame(ctx, state);
      if (captionEl && state.caption) {
        captionEl.textContent = state.caption;
      }
      requestAnimationFrame(frame);
    }

    if (wrap && "IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            start = performance.now();
            requestAnimationFrame(frame);
            obs.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      obs.observe(wrap);
    } else {
      requestAnimationFrame(frame);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
