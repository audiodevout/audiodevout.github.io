/**
 * canvas-parallax.js — scroll-driven parallax for the "difference" collage canvas.
 * Layers come from js/canvasLayers.parts.js (build via analyze-canvas-images).
 *
 * The canvas is position:fixed (one viewport) so it never affects document scroll height.
 * Each layer is placed once in document space (f = 0..1 down the page) and mapped into
 * the fixed viewport by its speed s. Reduced motion uses s = 1 (layers scroll with the page).
 */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var config = window.__CANVAS_LAYERS__;
  var canvas = null;
  var layerEls = [];
  var ticking = false;
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

  /** Content height only — header, main and footer bottom edges. */
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

  /* Body class page-XXX → XXX (e.g. "about"), or null. */
  function pageKey() {
    var m = /(?:^|\s)page-([\w-]+)/.exec(document.body.className);
    return m ? m[1] : null;
  }

  function layerSrc(layer) {
    if (layer.byPage) {
      var key = pageKey();
      if (key && layer.byPage[key]) return layer.byPage[key];
    }
    return layer.src;
  }

  function buildLayer(layer) {
    var el = document.createElement('div');
    el.className = 'canvas-layer canvas-layer--' + layer.id;
    el.style.zIndex = String(layer.z || 1);
    if (layer.o != null) el.style.opacity = String(layer.o);
    if (layer.b) el.style.mixBlendMode = layer.b;

    var img = document.createElement('img');
    img.src = assetUrl(layerSrc(layer));
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('load', requestUpdate);

    el.appendChild(img);
    return el;
  }

  function buildLayers() {
    config.layers.forEach(function (layer) {
      var el = buildLayer(layer);
      canvas.appendChild(el);
      layerEls.push({ el: el, layer: layer });
    });
  }

  function update() {
    ticking = false;
    if (!layerEls.length) return;

    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var mob = vw <= 620;
    var max = Math.max(getContentHeight() - vh, 1);
    var sy = window.scrollY || window.pageYOffset || 0;

    layerEls.forEach(function (entry) {
      var l = entry.layer;
      var s = reducedMotion ? 1 : (l.s != null ? l.s : 0.3);
      var f = l.f || 0;
      var width = (mob && l.mw != null ? l.mw : l.w) * vw / 100;

      entry.el.style.width = width.toFixed(1) + 'px';

      var h = entry.el.offsetHeight || width;
      var y = (f === 0 && l.top != null)
        ? l.top * vh / 100 - sy * s
        : vh / 2 + (f * max - sy) * s - h / 2;
      var x = vw * l.x / 100 - width / 2;

      entry.el.style.transform =
        'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + (l.r || 0) + 'deg)';
    });
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function init() {
    canvas = document.querySelector('.site-canvas');
    if (!canvas || !config || !Array.isArray(config.layers)) return;

    siteRoot = resolveSiteRoot();
    buildLayers();
    canvas.classList.add('site-canvas--layers');
    update();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('load', requestUpdate);
    document.addEventListener('portfolio:ready', requestUpdate);

    if (typeof ResizeObserver !== 'undefined') {
      var main = document.querySelector('main');
      if (main) new ResizeObserver(requestUpdate).observe(main);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
