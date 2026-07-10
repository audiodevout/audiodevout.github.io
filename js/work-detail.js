/**
 * work-detail.js — shared work metadata, body, and media rendering
 * Work pages use a vertical media stack; lightbox uses carousel slides.
 */
(function () {
  'use strict';

  var utils = window.portfolioUtils || {};
  var getYoutubeId = utils.getYoutubeId || function () { return ''; };
  var isYoutubeUrl = utils.isYoutubeUrl || function (url) {
    return url && (url.indexOf('youtube') !== -1 || url.indexOf('youtu.be') !== -1);
  };
  var esc = utils.esc || function (s) { return (s == null || s === '') ? '' : String(s); };
  var resolveAssetSrc = utils.resolveAssetSrc || function (src) { return src; };

  var BANDCAMP_EMBED = 'https://bandcamp.com/EmbeddedPlayer/track=';
  var BANDCAMP_OPTS = '/size=large/bgcol=111111/linkcol=b8f400/tracklist=false/artwork=large/transparent=false/';

  function getMediaItems(item) {
    var list = [];
    (item.images || []).forEach(function (src) { list.push({ type: 'image', src: src }); });
    (item.videos || []).forEach(function (url) {
      if (isYoutubeUrl(url)) {
        var id = getYoutubeId(url);
        list.push({
          type: 'youtube',
          id: id,
          url: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1'
        });
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

  function buildMediaSlide(mediaItem, title) {
    var slide = document.createElement('div');
    slide.className = 'lightbox__slide';

    if (mediaItem.type === 'image') {
      var img = document.createElement('img');
      img.src = resolveAssetSrc(mediaItem.src);
      img.alt = title || '';
      slide.appendChild(img);
    } else if (mediaItem.type === 'youtube') {
      var yt = document.createElement('iframe');
      yt.src = mediaItem.url;
      yt.title = 'YouTube video';
      yt.frameBorder = '0';
      yt.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      yt.allowFullscreen = true;
      yt.width = '800';
      yt.height = '450';
      slide.appendChild(yt);
    } else if (mediaItem.type === 'bandcamp') {
      var bc = document.createElement('iframe');
      bc.src = BANDCAMP_EMBED + mediaItem.trackId + BANDCAMP_OPTS;
      bc.title = mediaItem.title || 'Bandcamp track';
      bc.className = 'lightbox__iframe--bandcamp';
      bc.style.border = '0';
      bc.width = '350';
      bc.height = '472';
      slide.appendChild(bc);
    } else if (mediaItem.type === 'video') {
      var video = document.createElement('video');
      video.src = resolveAssetSrc(mediaItem.src);
      video.controls = true;
      video.loop = true;
      video.playsInline = true;
      slide.appendChild(video);
    }

    return slide;
  }

  function buildMediaFigure(mediaItem, title, index, item) {
    var fig = document.createElement('figure');
    fig.className = 'work-page__figure work-page__figure--' + mediaItem.type;

    if (mediaItem.type === 'image') {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'work-page__figure-btn';
      btn.setAttribute('aria-label', 'View image ' + (index + 1) + ' fullscreen');
      var img = document.createElement('img');
      img.src = resolveAssetSrc(mediaItem.src);
      img.alt = title || '';
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      btn.appendChild(img);
      btn.addEventListener('click', function () {
        if (typeof window.openLightbox === 'function') {
          window.openLightbox(item, { startIndex: index });
        }
      });
      fig.appendChild(btn);
    } else if (mediaItem.type === 'youtube') {
      var ytWrap = document.createElement('div');
      ytWrap.className = 'work-page__embed work-page__embed--youtube';
      var yt = document.createElement('iframe');
      yt.src = mediaItem.url.replace('autoplay=1', 'autoplay=0');
      yt.title = 'YouTube video';
      yt.frameBorder = '0';
      yt.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      yt.allowFullscreen = true;
      yt.loading = 'lazy';
      ytWrap.appendChild(yt);
      fig.appendChild(ytWrap);
    } else if (mediaItem.type === 'bandcamp') {
      var bcWrap = document.createElement('div');
      bcWrap.className = 'work-page__embed work-page__embed--bandcamp';
      var bc = document.createElement('iframe');
      bc.src = BANDCAMP_EMBED + mediaItem.trackId + BANDCAMP_OPTS;
      bc.title = mediaItem.title || 'Bandcamp track';
      bc.className = 'lightbox__iframe--bandcamp';
      bc.style.border = '0';
      bc.loading = 'lazy';
      bcWrap.appendChild(bc);
      fig.appendChild(bcWrap);
    } else if (mediaItem.type === 'video') {
      var video = document.createElement('video');
      video.src = resolveAssetSrc(mediaItem.src);
      video.controls = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      fig.appendChild(video);
    }

    return fig;
  }

  function renderWorkMediaStack(container, item) {
    var mediaItems = getMediaItems(item);
    container.innerHTML = '';
    container.className = 'work-page__media-stack';
    container.hidden = mediaItems.length === 0;

    if (mediaItems.length === 0) {
      return { mediaItems: mediaItems };
    }

    mediaItems.forEach(function (mediaItem, index) {
      container.appendChild(buildMediaFigure(mediaItem, item.title, index, item));
    });

    return { mediaItems: mediaItems };
  }

  function pauseVideosInElement(el) {
    if (!el) return;
    el.querySelectorAll('video').forEach(function (v) {
      try { v.pause(); } catch (e) { /* noop */ }
    });
  }

  function renderWorkMeta(els, item, opts) {
    opts = opts || {};
    var minimal = !!opts.minimal;

    if (els.title) els.title.textContent = item.title || '';
    if (els.category) {
      els.category.textContent = item.category || '';
      els.category.hidden = minimal;
    }
    if (els.meta) {
      var metaParts = [item.date, item.venue, item.location].filter(Boolean);
      els.meta.textContent = metaParts.join(' · ');
      els.meta.hidden = minimal || metaParts.length === 0;
    }
  }

  function appendExternalLinks(container, item) {
    if (!item.urls) return;

    var linksWrap = document.createElement('div');
    linksWrap.className = 'lightbox__links';
    var hasLinks = false;

    function appendLink(href, text) {
      if (!href) return;
      var link = document.createElement('a');
      link.href = /^https?:\/\//i.test(href) ? href : resolveAssetSrc(href);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'lightbox__paper-link';
      link.textContent = text;
      linksWrap.appendChild(link);
      hasLinks = true;
    }

    if (item.urls.link) {
      appendLink(
        item.urls.link,
        item.urls.linkLabel || (item.urls.kunstpunt ? 'NP3 ↗' : (item.urls.profile ? 'Show ↗' : 'Link ↗'))
      );
    }
    appendLink(item.urls.akerk, 'Akerk ↗');
    appendLink(item.urls.profile, 'Profile ↗');
    appendLink(item.urls.kunstpunt, 'Kunstpunt ↗');
    appendLink(item.urls.instagram, 'Instagram ↗');
    appendLink(item.urls.patreon, 'Patreon ↗');
    appendLink(item.urls.pdf, 'Read Paper ↗');

    if (hasLinks) container.appendChild(linksWrap);
  }

  function renderWorkBody(container, item, opts) {
    opts = opts || {};
    var minimal = !!opts.minimal;
    container.innerHTML = '';

    if (!minimal && item.fullDescription) {
      var desc = document.createElement('p');
      desc.className = 'lightbox__description';
      desc.textContent = item.fullDescription;
      container.appendChild(desc);
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
      container.appendChild(pillWrap);
    }

    if (!minimal) appendExternalLinks(container, item);
  }

  function clearCarouselNav(wrap) {
    if (!wrap) return;
    wrap.querySelectorAll('.lightbox__carousel-nav').forEach(function (n) { n.remove(); });
  }

  function renderWorkMedia(container, item, opts) {
    opts = opts || {};
    if (opts.inline) {
      return renderWorkMediaStack(container, item);
    }

    /* Lightbox-style carousel (legacy fallback; lightbox.js uses buildMediaSlide directly) */
    var mediaItems = getMediaItems(item);
    var currentIndex = 0;
    var currentSlide = null;
    var isSliding = false;

    container.innerHTML = '';
    container.hidden = mediaItems.length === 0;

    if (mediaItems.length === 0) {
      return { mediaItems: mediaItems, getIndex: function () { return 0; } };
    }

    var carouselWrap = document.createElement('div');
    carouselWrap.className = 'lightbox__carousel';

    var mediaEl = document.createElement('div');
    mediaEl.className = 'lightbox__media';
    carouselWrap.appendChild(mediaEl);
    container.appendChild(carouselWrap);

    function showNav() {
      clearCarouselNav(carouselWrap);
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

      prev.addEventListener('click', function (e) { e.stopPropagation(); goTo(currentIndex - 1, 'prev'); });
      next.addEventListener('click', function (e) { e.stopPropagation(); goTo(currentIndex + 1, 'next'); });

      carouselWrap.appendChild(prev);
      carouselWrap.appendChild(next);
    }

    function goTo(targetIndex, direction) {
      if (mediaItems.length === 0 || isSliding) return;

      var idx = (targetIndex + mediaItems.length) % mediaItems.length;

      if (!currentSlide) {
        currentIndex = idx;
        currentSlide = buildMediaSlide(mediaItems[currentIndex], item.title);
        currentSlide.classList.add('lightbox__slide--center');
        mediaEl.appendChild(currentSlide);
        return;
      }

      isSliding = true;
      var dir = direction === 'prev' ? 'prev' : 'next';
      var incoming = buildMediaSlide(mediaItems[idx], item.title);
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
        currentIndex = idx;
        isSliding = false;
      });
    }

    currentSlide = buildMediaSlide(mediaItems[0], item.title);
    currentSlide.classList.add('lightbox__slide--center');
    mediaEl.appendChild(currentSlide);
    showNav();

    return {
      mediaItems: mediaItems,
      mediaEl: mediaEl,
      getIndex: function () { return currentIndex; },
      goTo: goTo,
      pause: function () { pauseVideosInElement(mediaEl); }
    };
  }

  window.portfolioWorkDetail = {
    getMediaItems: getMediaItems,
    buildMediaSlide: buildMediaSlide,
    buildMediaFigure: buildMediaFigure,
    pauseVideosInElement: pauseVideosInElement,
    renderWorkMeta: renderWorkMeta,
    renderWorkBody: renderWorkBody,
    renderWorkMedia: renderWorkMedia,
    renderWorkMediaStack: renderWorkMediaStack,
    clearCarouselNav: clearCarouselNav
  };
})();
