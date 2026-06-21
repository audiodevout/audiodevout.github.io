/**
 * marquee-lens.js — cursor-following preview card (first project image).
 * Fine pointer + hover only; touch / coarse pointer: script exits (lightbox only).
 */
(function () {
  'use strict';

  var HOVER_MQ = '(hover: hover) and (pointer: fine)';

  function canUseLens() {
    try {
      return window.matchMedia(HOVER_MQ).matches;
    } catch (e) {
      return false;
    }
  }

  if (!canUseLens()) return;

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* noop */ }

  var OFFSET_X = 20;
  var OFFSET_Y = 20;
  var MAX_W = 240;
  var MAX_H = 168;
  var cardW = MAX_W;
  var cardH = MAX_H;

  var lensEl;
  var baseImg;
  var rafId = 0;
  var pendingX = 0;
  var pendingY = 0;
  var active = false;

  function ensureLensDOM() {
    if (lensEl) return;

    if (!reduceMotion) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', 'marqueeLensWarp');
      filter.setAttribute('x', '-20%');
      filter.setAttribute('y', '-20%');
      filter.setAttribute('width', '140%');
      filter.setAttribute('height', '140%');
      var turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      turb.setAttribute('type', 'fractalNoise');
      turb.setAttribute('baseFrequency', '0.038');
      turb.setAttribute('numOctaves', '2');
      turb.setAttribute('seed', '42');
      turb.setAttribute('result', 'noise');
      var disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'noise');
      disp.setAttribute('scale', '4');
      disp.setAttribute('xChannelSelector', 'R');
      disp.setAttribute('yChannelSelector', 'G');
      filter.appendChild(turb);
      filter.appendChild(disp);
      defs.appendChild(filter);
      svg.appendChild(defs);
      document.body.appendChild(svg);
    }

    lensEl = document.createElement('div');
    lensEl.className = 'marquee-lens';
    lensEl.setAttribute('aria-hidden', 'true');
    lensEl.hidden = true;

    var innerEl = document.createElement('div');
    innerEl.className = 'marquee-lens__card';

    baseImg = document.createElement('img');
    baseImg.className = 'marquee-lens__base';
    baseImg.alt = '';
    baseImg.decoding = 'async';
    if (!reduceMotion) {
      baseImg.style.filter = 'url(#marqueeLensWarp)';
    }

    innerEl.appendChild(baseImg);
    lensEl.appendChild(innerEl);
    document.body.appendChild(lensEl);
  }

  function fitDimensions(naturalW, naturalH) {
    if (!naturalW || !naturalH) return { w: MAX_W, h: MAX_H };
    var scale = Math.min(MAX_W / naturalW, MAX_H / naturalH);
    return {
      w: Math.round(naturalW * scale),
      h: Math.round(naturalH * scale)
    };
  }

  function applyCardSize(w, h) {
    cardW = w;
    cardH = h;
    lensEl.style.width = w + 'px';
    lensEl.style.height = h + 'px';
  }

  function syncCardToImage() {
    if (!baseImg || !lensEl) return;
    var dims = fitDimensions(baseImg.naturalWidth, baseImg.naturalHeight);
    applyCardSize(dims.w, dims.h);
  }

  function setPosition(clientX, clientY) {
    if (!lensEl) return;
    var x = clientX + OFFSET_X;
    var y = clientY + OFFSET_Y;
    var maxX = window.innerWidth - cardW - 8;
    var maxY = window.innerHeight - cardH - 8;
    if (x > maxX) x = clientX - cardW - OFFSET_X;
    if (y > maxY) y = clientY - cardH - OFFSET_Y;
    if (x < 8) x = 8;
    if (y < 8) y = 8;
    lensEl.style.left = x + 'px';
    lensEl.style.top = y + 'px';
  }

  function onMove(e) {
    if (!active || !lensEl || lensEl.hidden) return;
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = 0;
      setPosition(pendingX, pendingY);
    });
  }

  function show(src, e) {
    ensureLensDOM();
    if (!src || !lensEl) return;
    active = true;
    pendingX = e.clientX;
    pendingY = e.clientY;
    lensEl.hidden = false;
    baseImg.onload = null;
    baseImg.onerror = null;

    function afterImageReady() {
      syncCardToImage();
      setPosition(pendingX, pendingY);
    }

    if (baseImg.src === src && baseImg.complete && baseImg.naturalWidth) {
      afterImageReady();
      return;
    }

    baseImg.onload = afterImageReady;
    baseImg.onerror = function () {
      applyCardSize(MAX_W, MAX_H);
      setPosition(pendingX, pendingY);
    };
    baseImg.src = src;

    if (baseImg.complete && baseImg.naturalWidth) {
      afterImageReady();
    } else {
      setPosition(pendingX, pendingY);
    }
  }

  function hide() {
    active = false;
    if (lensEl) lensEl.hidden = true;
    if (baseImg) {
      baseImg.onload = null;
      baseImg.onerror = null;
      baseImg.removeAttribute('src');
    }
  }

  function bindPreviewEl(el) {
    if (!el || el.dataset.lensBound === '1') return;
    el.dataset.lensBound = '1';
    el.addEventListener('mouseenter', function (e) {
      show(el.dataset.previewSrc, e);
    });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', hide);
  }

  function bindStacks(root) {
    if (!root) return;
    root.querySelectorAll('.marquee-item[data-preview-src], .work-list__item[data-preview-src]').forEach(bindPreviewEl);
  }

  function init() {
    var marqueeRoot = document.getElementById('marquees-content');
    var listRoot = document.getElementById('list-content');
    var exhibitionsRoot = document.getElementById('exhibitions-content');
    if (!marqueeRoot && !listRoot && !exhibitionsRoot) return;

    function bindAll() {
      bindStacks(marqueeRoot);
      bindStacks(listRoot);
      bindStacks(exhibitionsRoot);
    }
    bindAll();

    var obs = new MutationObserver(function () {
      bindAll();
    });
    if (marqueeRoot) obs.observe(marqueeRoot, { childList: true, subtree: true });
    if (listRoot) obs.observe(listRoot, { childList: true, subtree: true });
    if (exhibitionsRoot) obs.observe(exhibitionsRoot, { childList: true, subtree: true });
    document.addEventListener('scroll', hide, { passive: true, capture: true });
    window.addEventListener('blur', hide);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
