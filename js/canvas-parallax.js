/**
 * canvas-parallax.js — scroll-driven depth parallax for the Defiance collage canvas.
 * Layers + colour analysis come from js/canvasLayers.parts.js (build via analyze-canvas-images).
 *
 * The canvas is position:fixed (one viewport) so it never affects document scroll height.
 * Layer segments tile in document space; transforms map them into the fixed viewport.
 */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var config = window.__CANVAS_LAYERS__;
  var canvas = null;
  var layerEls = [];
  var builtSegments = 0;
  var ticking = false;
  var resizeTimer = null;
  var siteRoot = './';

  function resolveSiteRoot() {
    var scripts = document.getElementsByTagName('script');
    var i;
    for (i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src && src.indexOf('canvas-parallax.js') !== -1) {
        return new URL('../', src).href;
      }
    }
    return new URL('./', window.location.href).href;
  }

  function assetUrl(rel) {
    return new URL(rel.replace(/^\.\//, ''), siteRoot).href;
  }

  /** Content height only — never use body.scrollHeight (canvas layers inflate it). */
  function getContentHeight() {
    var bottom = 0;
    var nodes = document.querySelectorAll('.site-header, main, .site-footer');
    var i;

    for (i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      bottom = Math.max(bottom, el.offsetTop + el.offsetHeight);
    }

    var padBottom = 0;
    if (document.body) {
      padBottom = parseFloat(window.getComputedStyle(document.body).paddingBottom) || 0;
    }

    return Math.max(bottom + padBottom, window.innerHeight);
  }

  function syncCanvasShell() {
    document.documentElement.style.setProperty('--site-canvas-h', getContentHeight() + 'px');
  }

  function segmentCount() {
    return Math.max(1, Math.ceil(getContentHeight() / window.innerHeight));
  }

  function parseLengthToPx(value, vh) {
    value = String(value || '0').trim();
    if (/^[\d.]+vh$/i.test(value)) {
      return vh * parseFloat(value) / 100;
    }
    return 0;
  }

  function layerDocY(layer, segmentIndex) {
    var vh = window.innerHeight;
    return segmentIndex * vh + parseLengthToPx(layer.y || '0', vh);
  }

  function anchorStyles(layer) {
    var anchor = layer.anchor || 'center top';
    var styles = {
      top: '0',
      width: layer.width || 'auto',
      height: layer.height || 'auto',
    };

    if (layer.lcp) {
      styles.left = layer.x || '82%';
      styles.width = layer.width || '38vw';
      var lcpCenter = layer.x || '82%';
      return { styles: styles, centeredX: '-' + lcpCenter };
    }

    if (anchor.indexOf('right') !== -1) {
      styles.right = '0';
      styles.left = 'auto';
      return { styles: styles, centeredX: null };
    }

    if (anchor.indexOf('left') !== -1) {
      styles.left = layer.x || '0';
      return { styles: styles, centeredX: null };
    }

    styles.left = layer.x || '50%';
    var centeredX = null;
    if (!layer.x || layer.x === '50%') {
      centeredX = '-50%';
    }
    return { styles: styles, centeredX: centeredX };
  }

  function applyGlow(el, layer) {
    if (!layer.analysis || !layer.analysis.dominant) return;
    var d = layer.analysis.dominant;
    el.style.setProperty('--layer-glow', 'rgba(' + d.r + ',' + d.g + ',' + d.b + ',0.55)');
    el.style.setProperty('--layer-depth', String(layer.depth || 0.2));
  }

  function buildLayer(layer, segmentIndex) {
    segmentIndex = segmentIndex || 0;
    var wrap = document.createElement('div');
    var anchored = anchorStyles(layer);

    wrap.className = 'canvas-layer canvas-layer--' + layer.id;
    if (segmentIndex > 0) {
      wrap.className += ' canvas-layer--segment-' + segmentIndex;
    }
    wrap.dataset.depth = String(layer.depth);
    wrap.dataset.speed = String(layer.speed);
    wrap.dataset.segment = String(segmentIndex);
    wrap.style.zIndex = String(layer.z || 1);

    if (anchored.centeredX) {
      wrap.dataset.centeredX = anchored.centeredX;
    }

    Object.keys(anchored.styles).forEach(function (key) {
      wrap.style[key] = anchored.styles[key];
    });

    if (layer.blend && layer.blend !== 'normal') {
      wrap.style.mixBlendMode = layer.blend;
    }
    if (layer.opacity != null) {
      wrap.style.opacity = String(layer.opacity);
    }

    applyGlow(wrap, layer);

    var glow = document.createElement('span');
    glow.className = 'canvas-layer__glow';
    glow.setAttribute('aria-hidden', 'true');

    var img = document.createElement('img');
    img.className = 'canvas-layer__img';
    img.src = assetUrl(layer.src);
    img.alt = '';
    img.decoding = 'async';
    img.loading = segmentIndex === 0 ? 'eager' : 'lazy';
    if (layer.invert) {
      img.classList.add('canvas-layer__img--invert');
    }
    if (layer.fit === 'cover') {
      img.classList.add('canvas-layer__img--cover');
    }

    wrap.appendChild(glow);
    wrap.appendChild(img);
    return wrap;
  }

  function upgradeLcpStamp() {
    var lcp = canvas.querySelector('.site-canvas__lcp');
    if (!lcp || !config || !config.layers) return null;

    var stamp = null;
    config.layers.forEach(function (layer) {
      if (layer.lcp) stamp = layer;
    });
    if (!stamp) return null;

    var wrap = document.createElement('div');
    var anchored = anchorStyles(stamp);

    wrap.className = 'canvas-layer canvas-layer__lcp-wrap canvas-layer--' + stamp.id;
    wrap.dataset.depth = String(stamp.depth);
    wrap.dataset.speed = String(stamp.speed);
    wrap.dataset.centeredX = anchored.centeredX || '-70%';
    wrap.dataset.segment = '0';
    wrap.style.zIndex = String(stamp.z || 30);

    Object.keys(anchored.styles).forEach(function (key) {
      wrap.style[key] = anchored.styles[key];
    });

    applyGlow(wrap, stamp);

    lcp.classList.add('canvas-layer__img');
    lcp.removeAttribute('style');
    lcp.parentNode.insertBefore(wrap, lcp);
    wrap.appendChild(lcp);

    return wrap;
  }

  function sortedLayers() {
    return config.layers.slice().sort(function (a, b) {
      return (a.z || 0) - (b.z || 0);
    });
  }

  function buildLayers() {
    if (!canvas || !config || !Array.isArray(config.layers)) return;

    var lcpWrap = upgradeLcpStamp();

    sortedLayers().forEach(function (layer) {
      if (layer.lcp) {
        if (lcpWrap) {
          layerEls.push({ el: lcpWrap, layer: layer, segment: 0 });
        }
        return;
      }
      var el = buildLayer(layer, 0);
      canvas.appendChild(el);
      layerEls.push({ el: el, layer: layer, segment: 0 });
    });

    builtSegments = 1;
  }

  function ensureSegments(count) {
    if (!canvas || !config) return;

    count = Math.max(1, count);
    var s;

    for (s = builtSegments; s < count; s++) {
      sortedLayers().forEach(function (layer) {
        if (layer.lcp) return;
        var el = buildLayer(layer, s);
        canvas.appendChild(el);
        layerEls.push({ el: el, layer: layer, segment: s });
      });
    }

    builtSegments = Math.max(builtSegments, count);
  }

  function refreshCanvasExtent() {
    syncCanvasShell();
    if (!config || reducedMotion) return;
    ensureSegments(segmentCount());
    updateParallax();
  }

  function updateParallax() {
    ticking = false;
    if (reducedMotion || !layerEls.length) return;

    var scrollY = window.scrollY || window.pageYOffset || 0;
    var contentHeight = getContentHeight();
    var maxScroll = Math.max(contentHeight - window.innerHeight, 1);
    var scrollRatio = scrollY / maxScroll;

    layerEls.forEach(function (entry) {
      var layer = entry.layer;
      var segment = entry.segment || 0;
      var speed = layer.speed != null ? layer.speed : (layer.depth || 0.2) * 0.5;
      var depth = layer.depth || 0.2;
      var docY = layerDocY(layer, segment);
      var y = docY - scrollY * speed;
      var x = scrollY * speed * 0.14 * (depth - 0.3);
      var scale = 1 + scrollRatio * depth * 0.04;
      var centeredX = entry.el.dataset.centeredX;

      entry.el.style.setProperty('--parallax-x', x.toFixed(2) + 'px');
      entry.el.style.setProperty('--parallax-y', y.toFixed(2) + 'px');
      entry.el.style.setProperty('--parallax-scale', scale.toFixed(4));

      if (centeredX) {
        entry.el.style.setProperty('--centered-x', centeredX);
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshCanvasExtent, 120);
  }

  function enableParallaxMode() {
    canvas.classList.add('site-canvas--parallax');
    document.body.classList.add('site-canvas-parallax');
  }

  function observeContent() {
    if (typeof ResizeObserver === 'undefined') return;
    var main = document.querySelector('main');
    if (!main) return;
    var ro = new ResizeObserver(onResize);
    ro.observe(main);
  }

  function init() {
    canvas = document.querySelector('.site-canvas');
    if (!canvas) return;

    syncCanvasShell();
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('portfolio:ready', refreshCanvasExtent);
    observeContent();

    if (reducedMotion || !config) return;

    siteRoot = resolveSiteRoot();
    buildLayers();
    ensureSegments(segmentCount());
    enableParallaxMode();
    updateParallax();

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
