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
  var CARD_W = 240;
  var CARD_H = 168;

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

  function setPosition(clientX, clientY) {
    if (!lensEl) return;
    var x = clientX + OFFSET_X;
    var y = clientY + OFFSET_Y;
    var maxX = window.innerWidth - CARD_W - 8;
    var maxY = window.innerHeight - CARD_H - 8;
    if (x > maxX) x = clientX - CARD_W - OFFSET_X;
    if (y > maxY) y = clientY - CARD_H - OFFSET_Y;
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
    baseImg.src = src;
    lensEl.hidden = false;
    setPosition(e.clientX, e.clientY);
  }

  function hide() {
    active = false;
    if (lensEl) lensEl.hidden = true;
    if (baseImg) baseImg.removeAttribute('src');
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
    if (!marqueeRoot && !listRoot) return;

    function bindAll() {
      bindStacks(marqueeRoot);
      bindStacks(listRoot);
    }
    bindAll();

    var obs = new MutationObserver(function () {
      bindAll();
    });
    if (marqueeRoot) obs.observe(marqueeRoot, { childList: true, subtree: true });
    if (listRoot) obs.observe(listRoot, { childList: true, subtree: true });
    document.addEventListener('scroll', hide, { passive: true, capture: true });
    window.addEventListener('blur', hide);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
