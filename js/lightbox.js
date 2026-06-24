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

  var panel, mediaEl, titleEl, categoryEl, metaEl, bodyEl, currentItem, currentIndex, mediaItems;
  var currentSlide = null;
  var isSliding = false;

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

  function buildSlideForMedia(item) {
    var slide = document.createElement('div');
    slide.className = 'lightbox__slide';

    if (item.type === 'image') {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = currentItem ? currentItem.title : '';
      slide.appendChild(img);
    } else if (item.type === 'youtube') {
      var iframe = document.createElement('iframe');
      iframe.src = item.url;
      iframe.title = 'YouTube video';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.width = '800';
      iframe.height = '450';
      slide.appendChild(iframe);
    } else if (item.type === 'bandcamp') {
      var iframe = document.createElement('iframe');
      iframe.src = BANDCAMP_EMBED + item.trackId + BANDCAMP_OPTS;
      iframe.title = item.title || 'Bandcamp track';
      iframe.className = 'lightbox__iframe--bandcamp';
      iframe.style.border = '0';
      iframe.width = '350';
      iframe.height = '472';
      slide.appendChild(iframe);
    } else if (item.type === 'video') {
      var video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.loop = true;
      video.playsInline = true;
      slide.appendChild(video);
    }

    return slide;
  }

  function pauseVideosInElement(el) {
    if (!el) return;
    el.querySelectorAll('video').forEach(function (v) {
      try {
        v.pause();
      } catch (e) { /* noop */ }
    });
  }

  function clearCarouselNav() {
    if (!panel) return;
    var wrap = panel.querySelector('.lightbox__carousel');
    if (!wrap) return;
    wrap.querySelectorAll('.lightbox__carousel-nav').forEach(function (n) { n.remove(); });
  }

  /** Stop iframe/video playback when the lightbox closes (hidden iframes keep playing otherwise). */
  function pauseAndClearMedia() {
    if (!mediaEl) return;
    pauseVideosInElement(mediaEl);
    mediaEl.innerHTML = '';
    clearCarouselNav();
    currentSlide = null;
    isSliding = false;
    currentIndex = 0;
  }

  function showCarouselNav() {
    clearCarouselNav();
    var wrap = panel.querySelector('.lightbox__carousel');
    if (!wrap) return;
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
    transitionToIndex(targetIndex, 'prev');
  }

  function nextMedia() {
    if (!mediaItems || mediaItems.length <= 1) return;
    var targetIndex = (currentIndex + 1) % mediaItems.length;
    transitionToIndex(targetIndex, 'next');
  }

  function transitionToIndex(targetIndex, direction) {
    if (!mediaItems || mediaItems.length === 0) return;
    if (isSliding) return;

    if (!mediaEl) {
      currentIndex = targetIndex;
      currentSlide = buildSlideForMedia(mediaItems[currentIndex]);
      currentSlide.classList.add('lightbox__slide--center');
      mediaEl.appendChild(currentSlide);
      return;
    }

    isSliding = true;
    var dir = direction === 'prev' ? 'prev' : 'next';
    var nextItem = mediaItems[targetIndex];
    var incoming = buildSlideForMedia(nextItem);

    incoming.classList.add(
      dir === 'next' ? 'lightbox__slide--enter-right' : 'lightbox__slide--enter-left'
    );
    mediaEl.appendChild(incoming);

    // Force layout so starting transform applies
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

    function onDone(e) {
      if (e.target !== incoming) return;
      incoming.removeEventListener('transitionend', onDone);
      if (currentSlide && currentSlide !== incoming && currentSlide.parentNode === mediaEl) {
        pauseVideosInElement(currentSlide);
        mediaEl.removeChild(currentSlide);
      }
      currentSlide = incoming;
      currentIndex = targetIndex;
      isSliding = false;
    }

    incoming.addEventListener('transitionend', onDone);
  }

  function open(item, options) {
    if (!item) return;
    options = options || {};
    var minimal = !!options.minimal || !!item.minimal;
    lastFocused = document.activeElement;
    currentItem = item;
    mediaItems = getMediaItems(item);
    currentIndex = 0;

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

    titleEl.textContent = item.title || '';
    categoryEl.textContent = item.category || '';
    categoryEl.hidden = minimal;
    var metaParts = [item.date, item.venue, item.location].filter(Boolean);
    if (metaEl) {
      metaEl.textContent = metaParts.join(' · ');
      metaEl.hidden = minimal || metaParts.length === 0;
    }

    if (mediaItems.length > 0) {
      mediaEl.innerHTML = '';
      currentSlide = buildSlideForMedia(mediaItems[0]);
      currentSlide.classList.add('lightbox__slide--center');
      mediaEl.appendChild(currentSlide);
      showCarouselNav();
    } else {
      mediaEl.innerHTML = '';
    }

    bodyEl.innerHTML = '';
    if (!minimal && item.fullDescription) {
      var desc = document.createElement('p');
      desc.className = 'lightbox__description';
      desc.textContent = item.fullDescription;
      bodyEl.appendChild(desc);
    }
    var pills = [];
    if (item.medium) pills.push(esc(item.medium));
    if (item.themes) pills.push(esc(item.themes));
    if (item.technical) pills.push(esc(item.technical));
    if (!minimal && pills.length > 0) {
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
    if (!minimal && item.urls) {
      var linksWrap = document.createElement('div');
      linksWrap.className = 'lightbox__links';
      var hasLinks = false;

      function appendLink(href, text) {
        if (!href) return;
        var link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'lightbox__paper-link';
        link.textContent = text;
        linksWrap.appendChild(link);
        hasLinks = true;
      }

      if (item.urls.link) {
        appendLink(item.urls.link, item.urls.kunstpunt ? 'NP3 ↗' : (item.urls.profile ? 'Show ↗' : 'Link ↗'));
      }
      appendLink(item.urls.akerk, 'Akerk ↗');
      appendLink(item.urls.profile, 'Profile ↗');
      appendLink(item.urls.kunstpunt, 'Kunstpunt ↗');
      appendLink(item.urls.instagram, 'Instagram ↗');
      appendLink(item.urls.patreon, 'Patreon ↗');
      if (item.urls.pdf) {
        appendLink(item.urls.pdf, 'Read Paper ↗');
      }

      if (hasLinks) bodyEl.appendChild(linksWrap);
    }

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
