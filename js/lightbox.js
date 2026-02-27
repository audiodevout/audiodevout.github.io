/**
 * lightbox.js — full-screen modal for images/video (Phase 2)
 * Carousel, YouTube/local video, close Escape/backdrop/button, body scroll lock.
 */
(function () {
  'use strict';

  var utils = window.portfolioUtils || {};
  var getYoutubeId = utils.getYoutubeId || function () { return ''; };
  var isYoutubeUrl = utils.isYoutubeUrl || function (url) { return url && (url.indexOf('youtube') !== -1 || url.indexOf('youtu.be') !== -1); };
  var esc = utils.esc || function (s) { return (s == null || s === '') ? '' : String(s); };

  var panel, mediaEl, titleEl, categoryEl, bodyEl, currentItem, currentIndex, mediaItems;
  var transitionPhase = 'idle';

  var BANDCAMP_EMBED = 'https://bandcamp.com/EmbeddedPlayer/track=';
  var BANDCAMP_OPTS = '/size=large/bgcol=111111/linkcol=b8f400/tracklist=false/artwork=large/transparent=false/';

  function getMediaItems(item) {
    var list = [];
    (item.images || []).forEach(function (src) { list.push({ type: 'image', src: src }); });
    (item.videos || []).forEach(function (url) {
      if (isYoutubeUrl(url)) {
        var id = getYoutubeId(url);
        list.push({ type: 'youtube', id: id, url: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1' });
      } else {
        list.push({ type: 'video', src: url });
      }
    });
    if (item.bandcampTracks && item.bandcampTracks.length > 0) {
      item.bandcampTracks.forEach(function (t) {
        list.push({ type: 'bandcamp', trackId: t.trackId, title: t.title || '' });
      });
    }
    return list;
  }

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
    header.appendChild(titleEl);
    header.appendChild(categoryEl);
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

  function setMediaContent(item) {
    mediaEl.innerHTML = '';
    if (item.type === 'image') {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = currentItem ? currentItem.title : '';
      mediaEl.appendChild(img);
    } else if (item.type === 'youtube') {
      var iframe = document.createElement('iframe');
      iframe.src = item.url;
      iframe.title = 'YouTube video';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.width = '800';
      iframe.height = '450';
      mediaEl.appendChild(iframe);
    } else if (item.type === 'bandcamp') {
      var iframe = document.createElement('iframe');
      iframe.src = BANDCAMP_EMBED + item.trackId + BANDCAMP_OPTS;
      iframe.title = item.title || 'Bandcamp track';
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.minWidth = '300px';
      iframe.style.height = '472px';
      iframe.width = '350';
      iframe.height = '472';
      mediaEl.appendChild(iframe);
    } else if (item.type === 'video') {
      var video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.loop = true;
      video.playsInline = true;
      mediaEl.appendChild(video);
    }
  }

  function showCarouselNav() {
    var wrap = panel.querySelector('.lightbox__carousel');
    if (!wrap) return;
    wrap.querySelectorAll('.lightbox__carousel-nav').forEach(function (n) { n.remove(); });
    if (mediaItems.length <= 1) return;
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
    var targetIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    transitionToIndex(targetIndex);
  }

  function nextMedia() {
    if (!mediaItems || mediaItems.length <= 1) return;
    var targetIndex = (currentIndex + 1) % mediaItems.length;
    transitionToIndex(targetIndex);
  }

  function transitionToIndex(targetIndex) {
    if (!mediaItems || mediaItems.length === 0) return;
    if (transitionPhase !== 'idle') return;

    if (!mediaEl) {
      currentIndex = targetIndex;
      setMediaContent(mediaItems[currentIndex]);
      return;
    }

    transitionPhase = 'fading-out';
    mediaEl.classList.add('is-faded');

    function handleTransition(e) {
      if (e.target !== mediaEl || e.propertyName !== 'opacity') return;
      if (transitionPhase === 'fading-out') {
        currentIndex = targetIndex;
        setMediaContent(mediaItems[currentIndex]);
        transitionPhase = 'fading-in';
        // force reflow so the browser applies new content at opacity 0
        void mediaEl.offsetWidth;
        mediaEl.classList.remove('is-faded');
      } else if (transitionPhase === 'fading-in') {
        mediaEl.removeEventListener('transitionend', handleTransition);
        transitionPhase = 'idle';
      }
    }

    mediaEl.addEventListener('transitionend', handleTransition);
  }

  function open(item) {
    if (!item) return;
    lastFocused = document.activeElement;
    currentItem = item;
    mediaItems = getMediaItems(item);
    currentIndex = 0;

    if (!lightboxEl) {
      lightboxEl = buildLightboxDOM();
      document.body.appendChild(lightboxEl);
    }

    titleEl.textContent = item.title || '';
    categoryEl.textContent = item.category || '';

    if (mediaItems.length > 0) {
      // Initial render: no fade animation
      setMediaContent(mediaItems[0]);
      showCarouselNav();
    } else {
      mediaEl.innerHTML = '';
    }

    bodyEl.innerHTML = '';
    if (item.fullDescription) {
      var desc = document.createElement('p');
      desc.className = 'lightbox__description';
      desc.textContent = item.fullDescription;
      bodyEl.appendChild(desc);
    }
    var pills = [];
    if (item.medium) pills.push(esc(item.medium));
    if (item.themes) pills.push(esc(item.themes));
    if (item.technical) pills.push(esc(item.technical));
    if (pills.length > 0) {
      var pillWrap = document.createElement('div');
      pillWrap.className = 'lightbox__pills';
      pills.forEach(function (text) {
        var span = document.createElement('span');
        span.className = 'lightbox__pill';
        span.textContent = text;
        pillWrap.appendChild(span);
      });
      bodyEl.appendChild(pillWrap);
    }
    if (item.urls && item.urls.pdf) {
      var a = document.createElement('a');
      a.href = item.urls.pdf;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'lightbox__paper-link';
      a.textContent = 'Read Paper ↗';
      bodyEl.appendChild(a);
    }

    document.body.style.overflow = 'hidden';
    lightboxEl.classList.add('is-open');
    document.addEventListener('keydown', trapFocus);
    var closeBtn = lightboxEl.querySelector('.lightbox__close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('is-open');
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

  window.openLightbox = open;
})();
