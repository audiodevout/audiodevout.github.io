/**
 * gallery.js — single masonry wall for VISUAL RESEARCH
 * Full-resolution sources; title on hover; click to enlarge.
 */
(function () {
  'use strict';

  var COLOR_MAP = {
    glacier: 'glacier', crimson: 'crimson', violet: 'violet', amber: 'amber',
    cerulean: 'cerulean', 'electric-lime': 'lime', saffron: 'saffron',
    'neon-magenta': 'magenta', graphite: 'graphite'
  };

  var root;
  var loadingEl;
  var expandEl;
  var expandImg;
  var expandCaption;
  var expandClose;
  var expandPrev;
  var expandNext;
  var expandState = null;
  var flatImages = [];
  var lastFocused = null;

  function esc(text) {
    var utils = window.portfolioUtils || {};
    if (typeof utils.esc === 'function') return utils.esc(text);
    var div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function resolveSrc(src) {
    var utils = window.portfolioUtils || {};
    if (typeof utils.resolveAssetSrc === 'function') return utils.resolveAssetSrc(src);
    return src;
  }

  function workHref(id) {
    if (window.portfolioWorkLookup && typeof window.portfolioWorkLookup.workPageUrl === 'function') {
      return window.portfolioWorkLookup.workPageUrl(id);
    }
    return './work/' + encodeURIComponent(id) + '/';
  }

  function resolveAccent(color) {
    if (!color) return 'var(--color-border)';
    var key = COLOR_MAP[color] || color;
    try {
      var value = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent-' + key)
        .trim();
      if (value) return value;
    } catch (e) { /* noop */ }
    return 'var(--color-accent)';
  }

  function buildExpandOverlay() {
    expandEl = document.createElement('div');
    expandEl.className = 'gallery-expand';
    expandEl.id = 'gallery-expand';
    expandEl.setAttribute('role', 'dialog');
    expandEl.setAttribute('aria-modal', 'true');
    expandEl.setAttribute('aria-label', 'Image preview');
    expandEl.hidden = true;

    var backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'gallery-expand__backdrop';
    backdrop.setAttribute('aria-label', 'Close preview');

    expandClose = document.createElement('button');
    expandClose.type = 'button';
    expandClose.className = 'gallery-expand__close';
    expandClose.setAttribute('aria-label', 'Close preview');
    expandClose.textContent = '×';

    expandPrev = document.createElement('button');
    expandPrev.type = 'button';
    expandPrev.className = 'gallery-expand__nav gallery-expand__nav--prev';
    expandPrev.setAttribute('aria-label', 'Previous image');
    expandPrev.textContent = '‹';

    expandNext = document.createElement('button');
    expandNext.type = 'button';
    expandNext.className = 'gallery-expand__nav gallery-expand__nav--next';
    expandNext.setAttribute('aria-label', 'Next image');
    expandNext.textContent = '›';

    var frame = document.createElement('div');
    frame.className = 'gallery-expand__frame';

    expandImg = document.createElement('img');
    expandImg.className = 'gallery-expand__img';
    expandImg.alt = '';

    expandCaption = document.createElement('p');
    expandCaption.className = 'gallery-expand__caption';

    frame.appendChild(expandImg);
    expandEl.appendChild(backdrop);
    expandEl.appendChild(expandClose);
    expandEl.appendChild(expandPrev);
    expandEl.appendChild(expandNext);
    expandEl.appendChild(frame);
    expandEl.appendChild(expandCaption);
    document.body.appendChild(expandEl);

    backdrop.addEventListener('click', closeExpand);
    expandClose.addEventListener('click', closeExpand);
    expandPrev.addEventListener('click', function () { stepExpand(-1); });
    expandNext.addEventListener('click', function () { stepExpand(1); });
    document.addEventListener('keydown', onExpandKeydown);
  }

  function updateExpandView() {
    if (!expandState || !flatImages.length) return;
    var entry = flatImages[expandState.flatIndex];
    if (!entry) return;
    var item = entry.item;

    expandImg.src = resolveSrc(entry.src);
    expandImg.alt = (item.title || 'Untitled') + ' — image ' + (entry.imageIndex + 1);
    expandCaption.innerHTML =
      '<a href="' + esc(workHref(item.id)) + '">' + esc(item.title || 'Untitled') + '</a>' +
      ' · ' + (expandState.flatIndex + 1) + ' / ' + flatImages.length;

    var multi = flatImages.length > 1;
    expandPrev.hidden = !multi;
    expandNext.hidden = !multi;
    expandPrev.disabled = !multi;
    expandNext.disabled = !multi;
  }

  function openExpand(flatIndex) {
    if (!expandEl) buildExpandOverlay();
    if (!flatImages.length) return;

    lastFocused = document.activeElement;
    expandState = {
      flatIndex: Math.max(0, Math.min(flatIndex, flatImages.length - 1))
    };

    updateExpandView();
    expandEl.hidden = false;
    document.body.classList.add('gallery-expand-open');
    expandClose.focus();
  }

  function closeExpand() {
    if (!expandEl || expandEl.hidden) return;
    expandEl.hidden = true;
    expandImg.removeAttribute('src');
    document.body.classList.remove('gallery-expand-open');
    expandState = null;
    if (lastFocused) {
      try { lastFocused.focus(); } catch (e) { /* noop */ }
      lastFocused = null;
    }
  }

  function stepExpand(delta) {
    if (!expandState || !flatImages.length) return;
    expandState.flatIndex = (expandState.flatIndex + delta + flatImages.length) % flatImages.length;
    updateExpandView();
  }

  function onExpandKeydown(e) {
    if (!expandEl || expandEl.hidden) return;
    if (e.key === 'Escape') closeExpand();
    if (e.key === 'ArrowLeft') stepExpand(-1);
    if (e.key === 'ArrowRight') stepExpand(1);
  }

  function buildFlatImages(items) {
    var list = [];
    items.forEach(function (item) {
      (item.images || []).forEach(function (src, imageIndex) {
        list.push({ item: item, src: src, imageIndex: imageIndex });
      });
    });
    return list;
  }

  function createImageFigure(entry, flatIndex) {
    var item = entry.item;
    var figure = document.createElement('figure');
    figure.className = 'gallery-masonry__item';
    figure.style.setProperty('--gallery-accent', resolveAccent(item.color));

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-masonry__trigger';
    button.setAttribute('aria-label', item.title || 'Untitled');

    var img = document.createElement('img');
    img.src = resolveSrc(entry.src);
    img.alt = item.title || 'Untitled';
    img.loading = flatIndex < 8 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', function onLoad() {
      if (img.naturalWidth) img.width = img.naturalWidth;
      if (img.naturalHeight) img.height = img.naturalHeight;
      img.removeEventListener('load', onLoad);
    });

    var caption = document.createElement('span');
    caption.className = 'gallery-masonry__caption';
    caption.textContent = item.title || 'Untitled';

    button.appendChild(img);
    button.appendChild(caption);
    button.addEventListener('click', function () {
      openExpand(flatIndex);
    });

    figure.appendChild(button);
    return figure;
  }

  function render(data) {
    if (!root) return;

    var drawings = (data.projects && data.projects.drawings) || [];
    var items = drawings.filter(function (item) {
      return item.category === 'VISUAL RESEARCH' && item.images && item.images.length > 0;
    });

    root.innerHTML = '';
    root.className = 'gallery-masonry gallery-masonry__grid';

    if (!items.length) {
      flatImages = [];
      if (loadingEl) {
        loadingEl.textContent = 'No visual research items found.';
        loadingEl.hidden = false;
      }
      return;
    }

    flatImages = buildFlatImages(items);
    flatImages.forEach(function (entry, flatIndex) {
      root.appendChild(createImageFigure(entry, flatIndex));
    });

    if (loadingEl) loadingEl.hidden = true;
  }

  function initFromData(data) {
    render(data);
  }

  function init() {
    root = document.getElementById('gallery-root');
    loadingEl = document.getElementById('gallery-loading');
    if (!root) return;

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
