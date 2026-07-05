/**
 * lightbox.js — full-screen modal for images/video
 * Carousel, YouTube/local video, close Escape/backdrop/button, body scroll lock.
 */
(function () {
  'use strict';

  var detail = window.portfolioWorkDetail || {};
  var getMediaItems = detail.getMediaItems || function () { return []; };
  var buildMediaSlide = detail.buildMediaSlide || function () { return document.createElement('div'); };
  var pauseVideosInElement = detail.pauseVideosInElement || function () {};
  var renderWorkMeta = detail.renderWorkMeta || function () {};
  var renderWorkBody = detail.renderWorkBody || function () {};
  var clearCarouselNav = detail.clearCarouselNav || function () {};

  var panel, mediaEl, titleEl, categoryEl, metaEl, bodyEl, currentItem, currentIndex, mediaItems;
  var currentSlide = null;
  var isSliding = false;

  function buildLightboxDOM() {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Work detail');

    var backdrop = document.createElement('div');
    backdrop.className = 'lightbox__backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';

    panel = document.createElement('div');
    panel.className = 'lightbox__panel';

    var header = document.createElement('div');
    header.className = 'lightbox__header';
    titleEl = document.createElement('h2');
    titleEl.className = 'lightbox__title';
    categoryEl = document.createElement('p');
    categoryEl.className = 'lightbox__category';
    metaEl = document.createElement('p');
    metaEl.className = 'lightbox__meta';
    header.appendChild(titleEl);
    header.appendChild(categoryEl);
    header.appendChild(metaEl);
    panel.appendChild(header);
    panel.appendChild(closeBtn);

    var carouselWrap = document.createElement('div');
    carouselWrap.className = 'lightbox__carousel';
    mediaEl = document.createElement('div');
    mediaEl.className = 'lightbox__media';
    carouselWrap.appendChild(mediaEl);
    panel.appendChild(carouselWrap);

    bodyEl = document.createElement('div');
    bodyEl.className = 'lightbox__body';
    panel.appendChild(bodyEl);

    lb.appendChild(backdrop);
    lb.appendChild(panel);

    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKeydown);

    return lb;
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    if (!lightboxEl || !lightboxEl.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') prevMedia();
    if (e.key === 'ArrowRight') nextMedia();
  }

  function showCarouselNav() {
    var wrap = panel.querySelector('.lightbox__carousel');
    clearCarouselNav(wrap);
    if (!wrap || mediaItems.length <= 1) return;

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'lightbox__carousel-nav lightbox__carousel-nav--prev';
    prev.setAttribute('aria-label', 'Previous');
    prev.textContent = '‹';
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'lightbox__carousel-nav lightbox__carousel-nav--next';
    next.setAttribute('aria-label', 'Next');
    next.textContent = '›';
    prev.addEventListener('click', function (e) { e.stopPropagation(); prevMedia(); });
    next.addEventListener('click', function (e) { e.stopPropagation(); nextMedia(); });
    wrap.appendChild(prev);
    wrap.appendChild(next);
  }

  function prevMedia() {
    if (!mediaItems || mediaItems.length <= 1) return;
    transitionToIndex((currentIndex - 1 + mediaItems.length) % mediaItems.length, 'prev');
  }

  function nextMedia() {
    if (!mediaItems || mediaItems.length <= 1) return;
    transitionToIndex((currentIndex + 1) % mediaItems.length, 'next');
  }

  function transitionToIndex(targetIndex, direction) {
    if (!mediaItems || mediaItems.length === 0) return;
    if (isSliding) return;

    if (!mediaEl) {
      currentIndex = targetIndex;
      currentSlide = buildMediaSlide(mediaItems[currentIndex], currentItem ? currentItem.title : '');
      currentSlide.classList.add('lightbox__slide--center');
      mediaEl.appendChild(currentSlide);
      return;
    }

    isSliding = true;
    var dir = direction === 'prev' ? 'prev' : 'next';
    var incoming = buildMediaSlide(mediaItems[targetIndex], currentItem ? currentItem.title : '');

    incoming.classList.add(
      dir === 'next' ? 'lightbox__slide--enter-right' : 'lightbox__slide--enter-left'
    );
    mediaEl.appendChild(incoming);
    void incoming.offsetWidth;

    if (currentSlide) {
      currentSlide.classList.remove('lightbox__slide--center');
      currentSlide.classList.add(
        dir === 'next' ? 'lightbox__slide--exit-left' : 'lightbox__slide--exit-right'
      );
    }
    incoming.classList.remove(
      dir === 'next' ? 'lightbox__slide--enter-right' : 'lightbox__slide--enter-left'
    );
    incoming.classList.add('lightbox__slide--center');

    incoming.addEventListener('transitionend', function onDone(e) {
      if (e.target !== incoming) return;
      incoming.removeEventListener('transitionend', onDone);
      if (currentSlide && currentSlide !== incoming && currentSlide.parentNode === mediaEl) {
        pauseVideosInElement(currentSlide);
        mediaEl.removeChild(currentSlide);
      }
      currentSlide = incoming;
      currentIndex = targetIndex;
      isSliding = false;
    });
  }

  function pauseAndClearMedia() {
    if (!mediaEl) return;
    pauseVideosInElement(mediaEl);
    mediaEl.innerHTML = '';
    clearCarouselNav(panel ? panel.querySelector('.lightbox__carousel') : null);
    currentSlide = null;
    isSliding = false;
    currentIndex = 0;
  }

  function open(item, options) {
    if (!item) return;
    options = options || {};
    var minimal = !!options.minimal || !!item.minimal;
    var startIndex = typeof options.startIndex === 'number' ? options.startIndex : 0;
    lastFocused = document.activeElement;
    currentItem = item;
    mediaItems = getMediaItems(item);
    currentIndex = Math.max(0, Math.min(startIndex, Math.max(mediaItems.length - 1, 0)));

    if (!lightboxEl) {
      lightboxEl = buildLightboxDOM();
      document.body.appendChild(lightboxEl);
    } else if (!metaEl && panel) {
      var header = panel.querySelector('.lightbox__header');
      if (header && !header.querySelector('.lightbox__meta')) {
        metaEl = document.createElement('p');
        metaEl.className = 'lightbox__meta';
        header.appendChild(metaEl);
      }
    }

    lightboxEl.classList.toggle('lightbox--minimal', minimal);

    renderWorkMeta(
      { title: titleEl, category: categoryEl, meta: metaEl },
      item,
      { minimal: minimal }
    );

    if (mediaItems.length > 0) {
      mediaEl.innerHTML = '';
      currentSlide = buildMediaSlide(mediaItems[currentIndex], item.title);
      currentSlide.classList.add('lightbox__slide--center');
      mediaEl.appendChild(currentSlide);
      showCarouselNav();
    } else {
      mediaEl.innerHTML = '';
    }

    renderWorkBody(bodyEl, item, { minimal: minimal });

    document.body.style.overflow = 'hidden';
    lightboxEl.classList.add('is-open');
    document.addEventListener('keydown', trapFocus);
    var closeBtn = lightboxEl.querySelector('.lightbox__close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!lightboxEl) return;
    pauseAndClearMedia();
    lightboxEl.classList.remove('is-open');
    lightboxEl.classList.remove('lightbox--minimal');
    document.body.style.overflow = '';
    if (lastFocused) {
      try { lastFocused.focus(); } catch (e) { /* noop */ }
      lastFocused = null;
    }
    document.removeEventListener('keydown', trapFocus);
  }

  var lightboxEl = null;
  var lastFocused = null;

  function trapFocus(e) {
    if (e.key !== 'Tab' || !lightboxEl || !lightboxEl.classList.contains('is-open')) return;
    var focusable = lightboxEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable = Array.prototype.filter.call(focusable, function (el) {
      return el.offsetParent !== null && !el.disabled;
    });
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openSingleImage(opts) {
    if (!opts || !opts.src) return;
    open({
      title: opts.title || '',
      category: opts.category || '',
      images: [opts.src],
      videos: [],
      fullDescription: opts.fullDescription || ''
    }, { minimal: !!opts.minimal });
  }

  window.openLightbox = open;
  window.openLightboxSingle = openSingleImage;
})();
