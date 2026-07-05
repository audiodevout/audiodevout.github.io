/**
 * gallery.js — interactive cluster canvas for VISUAL RESEARCH
 * Dual-layer physics, expandable clusters, drag images, lightbox on second click.
 */
(function () {
  'use strict';

  var DRAG_THRESHOLD = 5;
  var EXPAND_MS = 350;
  var COLLAPSED_RADIUS = 52;
  var COLLAPSED_IMG = 38;
  var EXPANDED_IMG = 68;
  var DPR_CAP = 2;

  var wrap, canvas, ctx;
  var tooltipEl, hintEl, loadingEl;
  var cssW = 0;
  var cssH = 0;
  var dpr = 1;

  var clusters = [];
  var edges = [];
  var cam = { x: 0, y: 0, z: 1 };
  var expandedId = null;
  var hoveredCluster = null;
  var hoveredNode = null;

  var imageMap = Object.create(null);
  var thumbCache = Object.create(null);
  var coversLoaded = 0;
  var totalCovers = 0;

  var pointer = {
    down: false,
    dragging: false,
    panning: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    moved: false,
    targetCluster: null,
    targetNode: null,
    lastCamX: 0,
    lastCamY: 0,
    dragLastWorldX: 0,
    dragLastWorldY: 0
  };

  var reduceMotion = false;
  var rafId = 0;
  var lastTime = 0;
  var frameCount = 0;
  var hintHidden = false;
  var running = true;

  var colors = {
    bg: '#17171d',
    edge: 'rgba(236, 236, 236, 0.12)',
    edgeHi: 'rgba(236, 236, 236, 0.45)',
    muted: '#5c5c64'
  };

  var COLOR_MAP = {
    glacier: 'glacier', crimson: 'crimson', violet: 'violet', amber: 'amber',
    cerulean: 'cerulean', 'electric-lime': 'lime', saffron: 'saffron',
    'neon-magenta': 'magenta', graphite: 'graphite'
  };

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function dist(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function resolveAccent(color) {
    if (!color) return colors.muted;
    var key = COLOR_MAP[color] || color;
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-' + key).trim();
      if (v) return v;
    } catch (e) { /* noop */ }
    return '#ececec';
  }

  function screenToWorld(sx, sy) {
    return {
      x: (sx - cssW * 0.5 - cam.x) / cam.z,
      y: (sy - cssH * 0.5 - cam.y) / cam.z
    };
  }

  function getExpandedRadius(cluster) {
    var n = cluster.imageNodes.length;
    return Math.max(100, 60 + Math.sqrt(n) * 28);
  }

  function clusterRadius(cluster) {
    var target = cluster.id === expandedId
      ? getExpandedRadius(cluster)
      : COLLAPSED_RADIUS;
    return lerp(COLLAPSED_RADIUS, target, easeOutCubic(cluster.expandT));
  }

  function clusterImageSize(cluster) {
    var target = cluster.id === expandedId ? EXPANDED_IMG : COLLAPSED_IMG;
    return lerp(COLLAPSED_IMG, target, easeOutCubic(cluster.expandT));
  }

  function nodeWorld(cluster, node) {
    return {
      x: cluster.x + node.localX,
      y: cluster.y + node.localY
    };
  }

  function buildClusters(items) {
    var list = [];
    var n = items.length;
    items.forEach(function (item, i) {
      var angle = (i / n) * Math.PI * 2;
      var spread = Math.min(cssW || window.innerWidth, cssH || window.innerHeight) * 0.28;
      var imgs = item.images || [];
      var imageNodes = imgs.map(function (src, idx) {
        var a = (idx / Math.max(imgs.length, 1)) * Math.PI * 2;
        var r = Math.random() * 18 + 4;
        return {
          src: src,
          index: idx,
          localX: Math.cos(a) * r,
          localY: Math.sin(a) * r,
          vx: 0,
          vy: 0,
          pinned: false
        };
      });
      list.push({
        id: item.id,
        title: item.title || 'Untitled',
        color: item.color || 'graphite',
        accent: resolveAccent(item.color),
        item: item,
        x: Math.cos(angle) * spread * (0.6 + Math.random() * 0.4),
        y: Math.sin(angle) * spread * (0.6 + Math.random() * 0.4),
        vx: 0,
        vy: 0,
        expanded: false,
        expandT: 0,
        expandTarget: 0,
        imageNodes: imageNodes
      });
    });
    return list;
  }

  function buildEdges(clusterList) {
    var result = [];
    var seen = Object.create(null);
    function add(a, b) {
      var key = a < b ? a + '-' + b : b + '-' + a;
      if (seen[key]) return;
      seen[key] = true;
      result.push({ a: a, b: b });
    }
    var byColor = Object.create(null);
    clusterList.forEach(function (c, i) {
      var col = c.color || 'graphite';
      if (!byColor[col]) byColor[col] = [];
      byColor[col].push(i);
    });
    Object.keys(byColor).forEach(function (col) {
      var idxs = byColor[col];
      for (var j = 0; j < idxs.length - 1; j++) add(idxs[j], idxs[j + 1]);
    });
    for (var k = 0; k < clusterList.length; k++) {
      add(k, (k + 1) % clusterList.length);
    }
    return result;
  }

  function getLoadSrc(src) {
    var utils = window.portfolioUtils || {};
    if (typeof utils.getThumbSrc === 'function') return utils.getThumbSrc(src);
    return src;
  }

  function preloadImage(src, onLoad) {
    var loadSrc = getLoadSrc(src);
    if (imageMap[loadSrc]) {
      if (imageMap[loadSrc].complete && onLoad) onLoad();
      return imageMap[loadSrc];
    }
    var img = new Image();
    img.onload = function () { if (onLoad) onLoad(); };
    img.onerror = function () {
      if (loadSrc !== src) {
        var fallback = new Image();
        fallback.onload = function () { if (onLoad) onLoad(); };
        fallback.onerror = function () { if (onLoad) onLoad(); };
        fallback.src = src;
        imageMap[loadSrc] = fallback;
        return;
      }
      if (onLoad) onLoad();
    };
    img.src = loadSrc;
    imageMap[loadSrc] = img;
    return img;
  }

  function roundedRectPath(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }

  function getThumbnail(src, tier, accent) {
    var key = src + '|' + tier + '|' + accent;
    if (thumbCache[key]) return thumbCache[key];
    var loadSrc = getLoadSrc(src);
    var img = imageMap[loadSrc];
    if (!img || !img.complete || !img.naturalWidth) return null;

    var size = tier === 'expanded' ? EXPANDED_IMG : COLLAPSED_IMG;
    var pad = 2;
    var total = size + pad * 2;
    var oc = document.createElement('canvas');
    oc.width = total;
    oc.height = total;
    var octx = oc.getContext('2d');
    var r = 6;

    octx.save();
    roundedRectPath(octx, pad, pad, size, size, r);
    octx.clip();
    var aspect = img.naturalWidth / img.naturalHeight;
    var dw = size;
    var dh = size;
    var ox = pad;
    var oy = pad;
    if (aspect > 1) {
      dh = size / aspect;
      oy = pad + (size - dh) * 0.5;
    } else {
      dw = size * aspect;
      ox = pad + (size - dw) * 0.5;
    }
    octx.drawImage(img, ox, oy, dw, dh);
    octx.restore();

    octx.strokeStyle = accent;
    octx.lineWidth = 1.5;
    roundedRectPath(octx, pad + 0.5, pad + 0.5, size - 1, size - 1, r);
    octx.stroke();

    thumbCache[key] = oc;
    return oc;
  }

  function staggerPreload(onCoversDone) {
    var allSrc = [];
    clusters.forEach(function (c) {
      c.imageNodes.forEach(function (n) {
        if (allSrc.indexOf(n.src) === -1) allSrc.push(n.src);
      });
    });
    totalCovers = clusters.length;
    coversLoaded = 0;

    clusters.forEach(function (c) {
      var cover = c.imageNodes[0];
      if (!cover) {
        coversLoaded++;
        return;
      }
      preloadImage(cover.src, function () {
        coversLoaded++;
        getThumbnail(cover.src, 'collapsed', c.accent);
        if (coversLoaded >= totalCovers && onCoversDone) onCoversDone();
      });
    });

    var rest = allSrc.filter(function (src) {
      return !clusters.some(function (c) { return c.imageNodes[0] && c.imageNodes[0].src === src; });
    });
    var i = 0;
    function loadNext() {
      if (i >= rest.length) return;
      var src = rest[i++];
      preloadImage(src, function () {
        clusters.forEach(function (c) {
          c.imageNodes.forEach(function (n) {
            if (n.src === src) {
              getThumbnail(src, 'collapsed', c.accent);
              getThumbnail(src, 'expanded', c.accent);
            }
          });
        });
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(loadNext);
        } else {
          setTimeout(loadNext, 16);
        }
      });
    }
    loadNext();
  }

  function stepGlobalPhysics(dt) {
    var repulsion = 12000;
    var damping = 0.88;
    var gravity = 0.002;
    var springK = 0.004;
    var springLen = 180;

    for (var i = 0; i < clusters.length; i++) {
      var ci = clusters[i];
      if (pointer.dragging && pointer.targetCluster === ci) continue;
      var fx = 0;
      var fy = 0;

      for (var j = 0; j < clusters.length; j++) {
        if (i === j) continue;
        var cj = clusters[j];
        var dx = ci.x - cj.x;
        var dy = ci.y - cj.y;
        var d = Math.max(dist(0, 0, dx, dy), 40);
        var f = repulsion / (d * d);
        fx += (dx / d) * f;
        fy += (dy / d) * f;
      }

      edges.forEach(function (e) {
        var other = e.a === i ? clusters[e.b] : (e.b === i ? clusters[e.a] : null);
        if (!other) return;
        var dx = other.x - ci.x;
        var dy = other.y - ci.y;
        var d = Math.max(dist(0, 0, dx, dy), 1);
        var diff = d - springLen;
        fx += (dx / d) * diff * springK;
        fy += (dy / d) * diff * springK;
      });

      fx -= ci.x * gravity;
      fy -= ci.y * gravity;

      ci.vx = (ci.vx + fx * dt) * damping;
      ci.vy = (ci.vy + fy * dt) * damping;
      ci.x += ci.vx * dt;
      ci.y += ci.vy * dt;
    }
  }

  function stepLocalPhysics(cluster, dt, fullRate) {
    if (!fullRate && reduceMotion) return;
    var radius = clusterRadius(cluster);
    var centerK = cluster.id === expandedId ? 0.008 : 0.022;
    var repK = cluster.id === expandedId ? 800 : 500;
    var half = clusterImageSize(cluster) * 0.5;
    var nodes = cluster.imageNodes;
    var damping = 0.82;

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.pinned) continue;
      var fx = -n.localX * centerK;
      var fy = -n.localY * centerK;

      for (var j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        var m = nodes[j];
        var dx = n.localX - m.localX;
        var dy = n.localY - m.localY;
        var d = Math.max(dist(0, 0, dx, dy), half);
        var f = repK / (d * d);
        fx += (dx / d) * f;
        fy += (dy / d) * f;
      }

      var cd = dist(0, 0, n.localX, n.localY);
      var maxR = radius - half;
      if (cd > maxR && cd > 0) {
        var push = (cd - maxR) * 0.15;
        fx -= (n.localX / cd) * push;
        fy -= (n.localY / cd) * push;
      }

      n.vx = (n.vx + fx * dt) * damping;
      n.vy = (n.vy + fy * dt) * damping;
      n.localX += n.vx * dt;
      n.localY += n.vy * dt;
    }
  }

  function updateExpandAnimations(dt) {
    clusters.forEach(function (c) {
      var target = c.id === expandedId ? 1 : 0;
      if (Math.abs(c.expandT - target) < 0.001) {
        c.expandT = target;
        return;
      }
      var speed = dt / EXPAND_MS;
      if (c.expandT < target) c.expandT = Math.min(target, c.expandT + speed);
      else c.expandT = Math.max(target, c.expandT - speed);
    });
  }

  function isInViewport(wx, wy, margin) {
    var tl = screenToWorld(-margin, -margin);
    var br = screenToWorld(cssW + margin, cssH + margin);
    var minX = Math.min(tl.x, br.x);
    var maxX = Math.max(tl.x, br.x);
    var minY = Math.min(tl.y, br.y);
    var maxY = Math.max(tl.y, br.y);
    return wx >= minX && wx <= maxX && wy >= minY && wy <= maxY;
  }

  function drawFrame() {
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, cssW, cssH);

    var cx = cssW * 0.5 + cam.x;
    var cy = cssH * 0.5 + cam.y;
    var vig = ctx.createRadialGradient(cx, cy, cssH * 0.1, cx, cy, cssH * 0.75);
    vig.addColorStop(0, 'rgba(23, 23, 29, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, cssW, cssH);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(cam.z, cam.z);

    ctx.lineWidth = 1 / cam.z;

    ctx.beginPath();
    edges.forEach(function (e) {
      var ca = clusters[e.a];
      var cb = clusters[e.b];
      if (!ca || !cb) return;
      var hi = hoveredCluster && (ca === hoveredCluster || cb === hoveredCluster);
      if (hi) return;
      if (!isInViewport((ca.x + cb.x) * 0.5, (ca.y + cb.y) * 0.5, 120)) return;
      ctx.moveTo(ca.x, ca.y);
      ctx.lineTo(cb.x, cb.y);
    });
    ctx.strokeStyle = colors.edge;
    ctx.stroke();

    ctx.beginPath();
    edges.forEach(function (e) {
      var ca = clusters[e.a];
      var cb = clusters[e.b];
      if (!ca || !cb) return;
      var hi = hoveredCluster && (ca === hoveredCluster || cb === hoveredCluster);
      if (!hi) return;
      ctx.moveTo(ca.x, ca.y);
      ctx.lineTo(cb.x, cb.y);
    });
    ctx.strokeStyle = colors.edgeHi;
    ctx.stroke();

    var hasExpanded = expandedId !== null;

    clusters.forEach(function (cluster) {
      var dim = hasExpanded && cluster.id !== expandedId;
      var alpha = dim ? 0.35 : 1;
      var tier = cluster.id === expandedId ? 'expanded' : 'collapsed';
      var imgSize = clusterImageSize(cluster);

      cluster.imageNodes.forEach(function (node) {
        var w = nodeWorld(cluster, node);
        if (!isInViewport(w.x, w.y, imgSize + 40)) return;

        var thumb = getThumbnail(node.src, tier, cluster.accent);
        ctx.save();
        ctx.globalAlpha = alpha;

        if (thumb) {
          var tx = Math.floor(w.x - thumb.width * 0.5);
          var ty = Math.floor(w.y - thumb.height * 0.5);
          ctx.drawImage(thumb, tx, ty);
        } else {
          ctx.fillStyle = 'rgba(62, 62, 68, 0.8)';
          roundedRectPath(ctx, w.x - imgSize * 0.5, w.y - imgSize * 0.5, imgSize, imgSize, 6);
          ctx.fill();
        }

        if (hoveredNode === node && hoveredCluster === cluster) {
          ctx.globalAlpha = alpha * 0.35;
          ctx.strokeStyle = cluster.accent;
          ctx.lineWidth = 2 / cam.z;
          ctx.beginPath();
          ctx.arc(w.x, w.y, imgSize * 0.55, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      if (cluster.id === expandedId && cluster.expandT > 0.5) {
        var r = clusterRadius(cluster);
        ctx.save();
        ctx.globalAlpha = 0.12 * cluster.expandT;
        ctx.strokeStyle = cluster.accent;
        ctx.lineWidth = 1 / cam.z;
        for (var g = 1; g <= 2; g++) {
          ctx.beginPath();
          ctx.arc(cluster.x, cluster.y, r + g * 10, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
    });

    ctx.restore();
  }

  function hitTestNode(wx, wy) {
    var expanded = expandedId
      ? clusters.filter(function (c) { return c.id === expandedId; })
      : [];
    var pool = expanded.length ? expanded.concat(clusters.filter(function (c) { return c.id !== expandedId; })) : clusters.slice();

    for (var ci = 0; ci < pool.length; ci++) {
      var cluster = pool[ci];
      var half = clusterImageSize(cluster) * 0.5 + 4;
      for (var ni = cluster.imageNodes.length - 1; ni >= 0; ni--) {
        var node = cluster.imageNodes[ni];
        var w = nodeWorld(cluster, node);
        if (dist(wx, wy, w.x, w.y) <= half) {
          return { cluster: cluster, node: node };
        }
      }
    }
    return null;
  }

  function setExpanded(clusterId) {
    expandedId = clusterId;
    clusters.forEach(function (c) {
      if (c.id === clusterId) {
        c.imageNodes.forEach(function (n) {
          getThumbnail(n.src, 'expanded', c.accent);
        });
      }
    });
  }

  function collapseAll() {
    if (expandedId === null) return;
    expandedId = null;
  }

  function hideHintOnce() {
    if (hintHidden || !hintEl) return;
    hintHidden = true;
    hintEl.classList.add('gallery-hint--hidden');
  }

  function updateTooltip() {
    if (!tooltipEl) return;
    if (pointer.dragging || pointer.panning || !hoveredCluster) {
      tooltipEl.hidden = true;
      return;
    }
    tooltipEl.textContent = hoveredCluster.title;
    tooltipEl.hidden = false;
    tooltipEl.style.left = (pointer.x + 14) + 'px';
    tooltipEl.style.top = (pointer.y + 14) + 'px';

    if (expandedId === hoveredCluster.id && hoveredCluster.id) {
      var href = './work/' + encodeURIComponent(hoveredCluster.id) + '/';
      if (window.portfolioWorkLookup && typeof window.portfolioWorkLookup.workPageUrl === 'function') {
        href = window.portfolioWorkLookup.workPageUrl(hoveredCluster.id);
      }
      tooltipEl.innerHTML = '';
      var titleLink = document.createElement('a');
      titleLink.href = href;
      titleLink.textContent = hoveredCluster.title;
      titleLink.className = 'gallery-tooltip__link';
      tooltipEl.appendChild(titleLink);
    }
  }

  function onPointerDown(e) {
    if (e.button !== 0) return;
    hideHintOnce();
    var rect = canvas.getBoundingClientRect();
    pointer.down = true;
    pointer.dragging = false;
    pointer.panning = false;
    pointer.moved = false;
    pointer.startX = pointer.x = e.clientX - rect.left;
    pointer.startY = pointer.y = e.clientY - rect.top;
    pointer.lastCamX = cam.x;
    pointer.lastCamY = cam.y;

    var world = screenToWorld(pointer.x, pointer.y);
    var hit = hitTestNode(world.x, world.y);
    pointer.targetCluster = hit ? hit.cluster : null;
    pointer.targetNode = hit ? hit.node : null;

    if (hit) {
      pointer.dragLastWorldX = world.x;
      pointer.dragLastWorldY = world.y;
      canvas.setPointerCapture(e.pointerId);
    } else {
      pointer.panning = true;
      canvas.setPointerCapture(e.pointerId);
    }
  }

  function onPointerMove(e) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;

    if (!pointer.down) {
      var world = screenToWorld(pointer.x, pointer.y);
      var hit = hitTestNode(world.x, world.y);
      hoveredCluster = hit ? hit.cluster : null;
      hoveredNode = hit ? hit.node : null;
      updateTooltip();
      canvas.style.cursor = hit ? 'pointer' : 'grab';
      return;
    }

    var dx = pointer.x - pointer.startX;
    var dy = pointer.y - pointer.startY;
    if (!pointer.moved && dist(0, 0, dx, dy) > DRAG_THRESHOLD) {
      pointer.moved = true;
      if (pointer.targetNode) pointer.dragging = true;
      else pointer.panning = true;
    }

    if (pointer.dragging && pointer.targetCluster) {
      var world = screenToWorld(pointer.x, pointer.y);
      var cluster = pointer.targetCluster;
      cluster.x += world.x - pointer.dragLastWorldX;
      cluster.y += world.y - pointer.dragLastWorldY;
      pointer.dragLastWorldX = world.x;
      pointer.dragLastWorldY = world.y;
      cluster.vx = 0;
      cluster.vy = 0;
      return;
    }

    if (pointer.panning) {
      cam.x = pointer.lastCamX + dx;
      cam.y = pointer.lastCamY + dy;
      canvas.style.cursor = 'grabbing';
    }
  }

  function onPointerUp(e) {
    if (!pointer.down) return;

    if (!pointer.moved && pointer.targetCluster && pointer.targetNode) {
      if (expandedId !== pointer.targetCluster.id) {
        setExpanded(pointer.targetCluster.id);
      } else {
        var workId = pointer.targetCluster.id;
        if (workId) {
          var href = './work/' + encodeURIComponent(workId) + '/';
          if (window.portfolioWorkLookup && typeof window.portfolioWorkLookup.workPageUrl === 'function') {
            href = window.portfolioWorkLookup.workPageUrl(workId);
          }
          window.location.href = href;
        }
      }
    } else if (!pointer.moved && pointer.panning && expandedId !== null) {
      collapseAll();
    }

    pointer.down = false;
    pointer.dragging = false;
    pointer.panning = false;
    pointer.targetCluster = null;
    pointer.targetNode = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    updateTooltip();
  }

  function onWheel(e) {
    e.preventDefault();
    hideHintOnce();
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var factor = e.deltaY > 0 ? 0.92 : 1.08;
    var wx = (mx - cssW * 0.5 - cam.x) / cam.z;
    var wy = (my - cssH * 0.5 - cam.y) / cam.z;
    cam.z = clamp(cam.z * factor, 0.35, 2.5);
    cam.x = mx - cssW * 0.5 - wx * cam.z;
    cam.y = my - cssH * 0.5 - wy * cam.z;
  }

  function resize() {
    if (!wrap) return;
    var rect = wrap.getBoundingClientRect();
    cssW = rect.width;
    cssH = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx = canvas.getContext('2d', { alpha: false });
  }

  function tick(now) {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    if (!lastTime) lastTime = now;
    var dt = Math.min(now - lastTime, 32);
    lastTime = now;
    frameCount++;

    updateExpandAnimations(dt);

    if (!reduceMotion) {
      stepGlobalPhysics(dt * 0.06);
      clusters.forEach(function (c) {
        var full = c.id === expandedId || c === hoveredCluster || pointer.targetCluster === c;
        var everyFrame = full || frameCount % 2 === 0;
        if (everyFrame) stepLocalPhysics(c, dt * 0.06, full);
      });
    }

    drawFrame();
  }

  function bindEvents() {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) {
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    });
  }

  function initFromData(data) {
    var drawings = (data.projects && data.projects.drawings) || [];
    var items = drawings.filter(function (item) {
      return item.category === 'VISUAL RESEARCH' && item.images && item.images.length > 0;
    });
    if (!items.length) {
      if (loadingEl) loadingEl.textContent = 'No visual research items found.';
      return;
    }

    resize();
    clusters = buildClusters(items);
    edges = buildEdges(clusters);

    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { /* noop */ }

    colors.bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || colors.bg;

    bindEvents();
    staggerPreload(function () {
      if (loadingEl) loadingEl.hidden = true;
    });

    rafId = requestAnimationFrame(tick);
  }

  function init() {
    wrap = document.getElementById('gallery-canvas-wrap');
    canvas = document.getElementById('gallery-canvas');
    tooltipEl = document.getElementById('gallery-tooltip');
    hintEl = document.getElementById('gallery-hint');
    loadingEl = document.getElementById('gallery-loading');
    if (!wrap || !canvas) return;

    if (window.portfolioData) {
      initFromData(window.portfolioData);
    } else {
      document.addEventListener('portfolio:ready', function () {
        initFromData(window.portfolioData);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
