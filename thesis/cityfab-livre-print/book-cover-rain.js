/**
 * Rain-stick geometry for book-cover-spread.html (Print&Bind A5 outside spread).
 * Reads --ifb-cover-spread-w/h and --ifb-cover-spine-w from :root.
 */
(function () {
  "use strict";

  var PERF_SEED = 0x1fb2026;

  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function perpNorm(dx, dy) {
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: -dy / len, y: dx / len };
  }

  function parseMm(value, fallback) {
    if (!value) {
      return fallback;
    }
    var n = parseFloat(String(value).trim());
    return isFinite(n) ? n : fallback;
  }

  function readSpreadMm() {
    var root = getComputedStyle(document.documentElement);
    return {
      w: parseMm(root.getPropertyValue("--ifb-cover-spread-w"), 306),
      h: parseMm(root.getPropertyValue("--ifb-cover-spread-h"), 210),
    };
  }

  function drawRainStick() {
    var svg = document.getElementById("ifs-rain-svg");
    var pathEl = document.getElementById("ifs-tube-path");
    var perfLayer = document.getElementById("ifs-perf-layer");
    if (!svg || !pathEl || !perfLayer) {
      return;
    }

    var dims = readSpreadMm();
    var W = dims.w;
    var H = dims.h;
    var scale = H / 297;

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);

    var x1 = W * 0.14;
    var y1 = H * 0.9;
    var x2 = W * 0.86;
    var y2 = H * 0.11;

    pathEl.setAttribute("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
    pathEl.setAttribute("stroke-width", String(5.5 * scale));

    while (perfLayer.firstChild) {
      perfLayer.removeChild(perfLayer.firstChild);
    }

    var rnd = mulberry32(PERF_SEED >>> 0);
    var dx = x2 - x1;
    var dy = y2 - y1;
    var pn = perpNorm(dx, dy);
    var svgNs = "http://www.w3.org/2000/svg";
    var i;
    var t;
    var px;
    var py;
    var off;
    var r;

    for (i = 0; i < 42; i++) {
      t = 0.06 + (0.88 * (i + rnd() * 0.4)) / 42;
      if (t > 0.94) {
        continue;
      }
      px = lerp(x1, x2, t);
      py = lerp(y1, y2, t);
      off = (rnd() - 0.5) * 2.2 * scale;
      r = (0.35 + rnd() * 0.45) * scale;
      var c = document.createElementNS(svgNs, "circle");
      c.setAttribute("cx", String(px + pn.x * off));
      c.setAttribute("cy", String(py + pn.y * off));
      c.setAttribute("r", String(r));
      c.setAttribute("fill", "currentColor");
      perfLayer.appendChild(c);
    }

    var tickCount = 18;
    for (i = 0; i < tickCount; i++) {
      t = 0.1 + (0.8 * i) / (tickCount - 1 || 1);
      px = lerp(x1, x2, t);
      py = lerp(y1, y2, t);
      off = (1.8 + rnd() * 1.2) * scale;
      var xA = px - pn.x * off;
      var yA = py - pn.y * off;
      var xB = px + pn.x * off;
      var yB = py + pn.y * off;
      var line = document.createElementNS(svgNs, "line");
      line.setAttribute("x1", String(xA));
      line.setAttribute("y1", String(yA));
      line.setAttribute("x2", String(xB));
      line.setAttribute("y2", String(yB));
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", String(0.35 * scale));
      perfLayer.appendChild(line);
    }
  }

  function init() {
    drawRainStick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
