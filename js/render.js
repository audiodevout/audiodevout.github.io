/**
 * render.js — DOM rendering from portfolioData (Phase 2)
 * Work section: installations, performance, visual (grouped), tutorials row.
 * No unsanitized innerHTML for user content.
 */
(function () {
  'use strict';

  var data = typeof window !== 'undefined' ? window.portfolioData : null;
  if (!data || !data.projects) return;

  var utils = window.portfolioUtils || {};
  var esc = utils.esc || function (s) { return (s == null || s === '') ? '' : String(s); };

  /* Map data color to CSS variable suffix */
  function accentVar(color) {
    if (!color) return 'var(--color-muted)';
    var map = {
      glacier: 'glacier', crimson: 'crimson', violet: 'violet', amber: 'amber',
      cerulean: 'cerulean', 'electric-lime': 'lime', saffron: 'saffron',
      'neon-magenta': 'magenta', graphite: 'graphite'
    };
    var key = map[color] || color;
    return 'var(--color-accent-' + key + ')';
  }

  function dedupeById(items) {
    if (!Array.isArray(items)) return [];
    var seen = {};
    return items.filter(function (item) {
      if (!item || !item.id) return false;
      if (seen[item.id]) return false;
      seen[item.id] = true;
      return true;
    });
  }

  function firstImage(item) {
    var imgs = item.images;
    return (Array.isArray(imgs) && imgs.length > 0) ? imgs[0] : null;
  }

  /** Convert any project to the shape lightbox expects */
  function toLightboxItem(item) {
    if (!item) return null;
    return {
      title: item.title || '',
      category: item.category || '',
      fullDescription: item.fullDescription || item.description || '',
      images: item.images || [],
      videos: item.videos || [],
      urls: item.urls || {},
      medium: item.medium || '',
      themes: item.themes || '',
      bandcampTracks: item.bandcampTracks || null
    };
  }

  /** Build a text marquee with clickable titles; each click opens lightbox with that item */
  function createClickableMarquee(items, openLightbox, options) {
    if (!items || items.length === 0) return null;
    options = options || {};
    var sep = options.separator !== undefined ? options.separator : ' · ';
    var track = document.createElement('div');
    track.className = 'marquee-track marquee-track--clickable';
    var content = document.createElement('div');
    content.className = 'marquee-content marquee-content--clickable';

    function addItem(it) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'marquee-item';
      btn.textContent = it.title || 'Untitled';
      var lbItem = toLightboxItem(it);
      btn.addEventListener('click', function () {
        if (openLightbox && lbItem) openLightbox(lbItem);
      });
      content.appendChild(btn);
      var span = document.createElement('span');
      span.className = 'marquee-sep';
      span.textContent = sep;
      span.setAttribute('aria-hidden', 'true');
      content.appendChild(span);
    }
    items.forEach(addItem);
    items.forEach(addItem);
    items.forEach(addItem);
    track.appendChild(content);
    return track;
  }

  function createCard(item, onClick) {
    var src = firstImage(item);
    var card = document.createElement('div');
    card.className = 'work-card reveal';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.dataset.id = item.id || '';

    var accent = document.createElement('div');
    accent.className = 'work-card__accent';
    accent.style.background = accentVar(item.color);
    card.appendChild(accent);

    var media = document.createElement('div');
    media.className = 'work-card__media';
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = item.title || '';
      img.loading = 'lazy';
      img.width = 320;
      img.height = 240;
      media.appendChild(img);
    }
    card.appendChild(media);

    var body = document.createElement('div');
    body.className = 'work-card__body';
    if (item.category) {
      var cat = document.createElement('div');
      cat.className = 'work-card__category';
      cat.textContent = item.category;
      body.appendChild(cat);
    }
    var title = document.createElement('h3');
    title.className = 'work-card__title';
    title.textContent = item.title || '';
    body.appendChild(title);
    if (item.description) {
      var desc = document.createElement('p');
      desc.className = 'work-card__description';
      desc.textContent = item.description;
      body.appendChild(desc);
    }
    card.appendChild(body);

    function handleOpen(e) {
      if (e.key && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (onClick) onClick(item);
    }
    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') handleOpen(e); });

    return card;
  }

  function groupByCategory(items) {
    var groups = {};
    (items || []).forEach(function (item) {
      var cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }

  function addLabeledMarquee(container, label, items, openLightbox) {
    if (!items || items.length === 0) return;
    var section = document.createElement('div');
    section.className = 'work-marquee-section';
    var heading = document.createElement('h3');
    heading.className = 'work-subsection__label';
    heading.textContent = label;
    section.appendChild(heading);
    var marquee = createClickableMarquee(items, openLightbox);
    if (marquee) section.appendChild(marquee);
    container.appendChild(section);
  }

  /** Single marquee block: Installations, Performance, visual groups, Tutorials, Sound, Archive (subsection labels in JS). */
  function renderMarqueesSection() {
    var container = document.getElementById('marquees-content');
    if (!container) return;

    var openLightbox = window.openLightbox;
    if (typeof openLightbox !== 'function') openLightbox = null;

    container.innerHTML = '';

    var installations = dedupeById(data.projects.installations || []);
    var performance = dedupeById(data.projects.performance || []);
    var drawings = dedupeById(data.projects.drawings || []);
    var excludeCategories = ['CREATIVE TECHNOLOGY / AUDIOVISUAL ART'];

    addLabeledMarquee(container, 'Installations', installations, openLightbox);
    addLabeledMarquee(container, 'Performance', performance, openLightbox);

    var visualGroups = groupByCategory(drawings);
    var order = ['VISUAL RESEARCH', 'VISUAL EXPERIMENT', 'SOLO • RESEARCH-BASED'];
    order.forEach(function (cat) {
      if (visualGroups[cat] && excludeCategories.indexOf(cat) === -1) addLabeledMarquee(container, cat, visualGroups[cat], openLightbox);
    });
    Object.keys(visualGroups).forEach(function (cat) {
      if (order.indexOf(cat) === -1 && excludeCategories.indexOf(cat) === -1) addLabeledMarquee(container, cat, visualGroups[cat], openLightbox);
    });

    var youtubeItems = [];
    [data.projects.installations, data.projects.performance, data.projects.drawings].filter(Boolean).forEach(function (arr) {
      (arr || []).forEach(function (item) {
        var ytUrl = (item.videos || []).find(function (url) { return url && (url.indexOf('youtube') !== -1 || url.indexOf('youtu.be') !== -1); });
        if (ytUrl) youtubeItems.push(item);
      });
    });
    addLabeledMarquee(container, 'Tutorials & Showcases', youtubeItems, openLightbox);

    var soundItems = dedupeById(data.projects.soundInstallations || []);
    if (soundItems.length > 0) addLabeledMarquee(container, 'Sound', soundItems, openLightbox);

    var writingItems = (data.projects && data.projects.writing) ? data.projects.writing : [];
    if (writingItems.length > 0) addLabeledMarquee(container, 'Archive', writingItems, openLightbox);
  }

  /* ---------- Home list view (minimal rows) ---------- */

  function createListItem(item, openLightbox) {
    if (!item) return null;

    var article = document.createElement('article');
    article.className = 'work-list__item';
    article.setAttribute('role', 'button');
    article.setAttribute('tabindex', '0');
    article.dataset.id = item.id || '';

    var title = document.createElement('h3');
    title.className = 'work-list__title';
    title.textContent = item.title || '';
    article.appendChild(title);

    function handleActivate(e) {
      if (e && e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      if (e) e.preventDefault();
      if (typeof openLightbox === 'function') {
        var lbItem = toLightboxItem(item);
        if (lbItem) openLightbox(lbItem);
      }
    }

    article.addEventListener('click', handleActivate);
    article.addEventListener('keydown', handleActivate);

    return article;
  }

  function addListGroup(listRoot, heading, items, openLightbox) {
    if (!listRoot || !items || items.length === 0) return;
    var group = document.createElement('section');
    group.className = 'work-list__group';

    var h = document.createElement('h2');
    h.className = 'work-list__group-label';
    h.textContent = heading;
    group.appendChild(h);

    items.forEach(function (item) {
      var row = createListItem(item, openLightbox);
      if (row) group.appendChild(row);
    });

    listRoot.appendChild(group);
  }

  function renderListSection() {
    var container = document.getElementById('list-content');
    if (!container) return;

    var openLightbox = window.openLightbox;
    if (typeof openLightbox !== 'function') openLightbox = null;

    container.innerHTML = '';

    var listRoot = document.createElement('div');
    listRoot.className = 'work-list';

    var installations = dedupeById(data.projects.installations || []);
    var performance = dedupeById(data.projects.performance || []);
    var drawings = dedupeById(data.projects.drawings || []);

    addListGroup(listRoot, 'Installations', installations, openLightbox);
    addListGroup(listRoot, 'Performance', performance, openLightbox);

    var visualGroups = groupByCategory(drawings);
    Object.keys(visualGroups).forEach(function (cat) {
      addListGroup(listRoot, cat, visualGroups[cat], openLightbox);
    });

    container.appendChild(listRoot);
  }

  /* ---------- Sound section (Phase 3) ---------- */
  /* Bandcamp embed: track=ID, size=small (strip) or size=large (with artwork). Strip is 350×42. */
  var BANDCAMP_EMBED_ROOT = 'https://bandcamp.com/EmbeddedPlayer/track=';
  var BANDCAMP_EMBED_OPTS = '/size=small/bgcol=111111/linkcol=b8f400/tracklist=false/transparent=true/';
  var SOUND_LAZY_MARGIN = 200;

  function buildBandcampEmbedUrl(trackId) {
    return BANDCAMP_EMBED_ROOT + trackId + BANDCAMP_EMBED_OPTS;
  }

  function createEqualizerPlaceholder() {
    var wrap = document.createElement('div');
    wrap.className = 'sound-card__equalizer';
    for (var i = 0; i < 5; i++) {
      var bar = document.createElement('span');
      bar.className = 'sound-card__equalizer-bar';
      wrap.appendChild(bar);
    }
    return wrap;
  }

  function createSoundCardPlaceholder(trackTitles) {
    var wrap = document.createElement('div');
    wrap.className = 'sound-card__placeholder';
    wrap.setAttribute('data-bandcamp-placeholder', '1');
    var title = document.createElement('span');
    title.className = 'sound-card__placeholder-title';
    title.textContent = trackTitles.length > 0 ? trackTitles[0] : 'Loading…';
    wrap.appendChild(title);
    wrap.appendChild(createEqualizerPlaceholder());
    return wrap;
  }

  function injectBandcampIframes(placeholderEl, tracks) {
    if (!placeholderEl || !Array.isArray(tracks) || tracks.length === 0) return;
    var parent = placeholderEl.parentNode;
    if (!parent) return;
    parent.removeChild(placeholderEl);
    tracks.forEach(function (t) {
      var iframe = document.createElement('iframe');
      iframe.src = buildBandcampEmbedUrl(t.trackId);
      iframe.title = t.title || 'Bandcamp track';
      iframe.setAttribute('seamless', '');
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.minWidth = '300px';
      iframe.style.height = '42px';
      iframe.width = '300';
      iframe.height = '42';
      parent.appendChild(iframe);
    });
  }

  function observeSoundPlaceholders() {
    var placeholders = document.querySelectorAll('[data-bandcamp-placeholder="1"]');
    if (placeholders.length === 0) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var container = el.closest('.sound-card') || el.closest('[data-bandcamp-tracks]');
        var tracks = container && container.dataset.bandcampTracks;
        observer.unobserve(el);
        if (!tracks) return;
        try {
          var arr = JSON.parse(tracks);
          injectBandcampIframes(el, arr);
        } catch (e) { /* noop */ }
      });
    }, { rootMargin: SOUND_LAZY_MARGIN + 'px', threshold: 0 });
    placeholders.forEach(function (p) { observer.observe(p); });
  }

  /* Phase 13c: track title weight by viewport proximity */
  function observeSoundCardProximity() {
    var cards = document.querySelectorAll('.sound-card');
    if (cards.length === 0) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var card = entry.target;
        var ratio = entry.intersectionRatio;
        card.style.setProperty('--proximity', String(ratio));
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '0px' });
    cards.forEach(function (card) { observer.observe(card); });
  }

  /* ---------- Phase 4: Exhibitions, Writing, About, CV ---------- */
  var ROLE_ACCENT_ORDER = [
    ['Residency and Group Presentation', 'lime'],
    ['Talk/Presentation', 'violet'],
    ['Kinetic Sculpture', 'saffron'],
    ['AV Performance', 'cerulean'],
    ['Lecture/Presentation', 'amber'],
    ['Residency', 'lime']
  ];

  function roleToAccent(role) {
    if (!role) return 'var(--color-muted)';
    for (var i = 0; i < ROLE_ACCENT_ORDER.length; i++) {
      if (role.indexOf(ROLE_ACCENT_ORDER[i][0]) !== -1) return 'var(--color-accent-' + ROLE_ACCENT_ORDER[i][1] + ')';
    }
    return 'var(--color-muted)';
  }

  function exhibitionToLightboxItem(ex) {
    return {
      title: ex.title,
      category: ex.role || '',
      fullDescription: ex.description || '',
      images: ex.images || [],
      videos: ex.videos || [],
      urls: ex.urls || {}
    };
  }

  function renderExhibitionsSection() {
    var container = document.getElementById('exhibitions-content');
    if (!container) return;

    var list = data.exhibitions || [];
    list = list.slice().sort(function (a, b) {
      var yA = a.year != null ? a.year : 0;
      var yB = b.year != null ? b.year : 0;
      if (yB !== yA) return yB - yA;
      return (b.date || '').localeCompare(a.date || '');
    });

    container.innerHTML = '';
    var timeline = document.createElement('div');
    timeline.className = 'timeline';
    var openLightbox = window.openLightbox;

    /* Phase 14a: group by year, insert year-anchor rows */
    var currentYear = null;
    list.forEach(function (ex) {
      var year = ex.year != null ? ex.year : (ex.date ? parseInt(String(ex.date).slice(0, 4), 10) : 0);
      if (year && year !== currentYear) {
        currentYear = year;
        var yearAnchor = document.createElement('div');
        yearAnchor.className = 'year-anchor';
        var yearNum = document.createElement('span');
        yearNum.className = 'year-number';
        yearNum.textContent = String(year);
        yearAnchor.appendChild(yearNum);
        var yearRule = document.createElement('span');
        yearRule.className = 'year-rule';
        yearAnchor.appendChild(yearRule);
        timeline.appendChild(yearAnchor);
      }

      var entry = document.createElement('article');
      entry.className = 'timeline__entry reveal';

      var dateEl = document.createElement('div');
      dateEl.className = 'timeline__date';
      dateEl.textContent = ex.date || '';
      entry.appendChild(dateEl);

      var venue = document.createElement('div');
      venue.className = 'timeline__venue';
      venue.textContent = ex.venue || '';
      entry.appendChild(venue);

      var title = document.createElement('h3');
      title.className = 'timeline__title';
      title.textContent = ex.title || '';
      entry.appendChild(title);

      var meta = document.createElement('div');
      meta.className = 'timeline__meta';
      if (ex.location) meta.appendChild(document.createTextNode(ex.location + ' · '));
      var roleSpan = document.createElement('span');
      roleSpan.className = 'timeline__role';
      roleSpan.style.background = roleToAccent(ex.role);
      roleSpan.style.color = 'var(--color-bg)';
      roleSpan.textContent = ex.role || '';
      meta.appendChild(roleSpan);
      entry.appendChild(meta);

      if (ex.description) {
        var desc = document.createElement('p');
        desc.className = 'timeline__description';
        desc.textContent = ex.description;
        entry.appendChild(desc);
      }

      if (ex.images && ex.images.length > 0) {
        var thumbs = document.createElement('div');
        thumbs.className = 'timeline__thumbs';
        ex.images.slice(0, 3).forEach(function (src) {
          var img = document.createElement('img');
          img.className = 'timeline__thumb';
          img.src = src;
          img.alt = '';
          img.loading = 'lazy';
          img.width = 80;
          img.height = 60;
          if (openLightbox) img.addEventListener('click', function () { openLightbox(exhibitionToLightboxItem(ex)); });
          thumbs.appendChild(img);
        });
        entry.appendChild(thumbs);
      }

      var linksWrap = document.createElement('div');
      linksWrap.className = 'timeline__links';
      if (ex.urls && ex.urls.link) {
        var link = document.createElement('a');
        link.href = ex.urls.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'timeline__link';
        link.textContent = 'Link ↗';
        linksWrap.appendChild(link);
      }
      if (ex.urls && ex.urls.pdf) {
        var paper = document.createElement('a');
        paper.href = ex.urls.pdf;
        paper.target = '_blank';
        paper.rel = 'noopener noreferrer';
        paper.className = 'timeline__link timeline__link--paper';
        paper.textContent = 'Paper ↗';
        linksWrap.appendChild(paper);
      }
      entry.appendChild(linksWrap);

      timeline.appendChild(entry);
    });

    container.appendChild(timeline);
  }

  function renderAboutSection() {
    var container = document.getElementById('about-content');
    if (!container) return;

    var contact = data.contact || {};
    var about = contact.about || {};
    var social = contact.social || [];

    container.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'about-grid';

    var left = document.createElement('div');
    left.className = 'about-image-wrap';
    if (about.image) {
      var img = document.createElement('img');
      img.src = about.image;
      img.alt = 'Atharva Gupta';
      img.loading = 'lazy';
      left.appendChild(img);
    }
    grid.appendChild(left);

    var right = document.createElement('div');
    var label = document.createElement('p');
    label.className = 'about__label';
    label.textContent = 'ABOUT';
    right.appendChild(label);
    if (about.description) {
      var desc = document.createElement('div');
      desc.className = 'about__description';
      desc.textContent = about.description;
      right.appendChild(desc);
    }
    if (social.length > 0) {
      var socialWrap = document.createElement('div');
      socialWrap.className = 'about__social';
      social.forEach(function (s) {
        var a = document.createElement('a');
        a.href = s.url || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'about__social-link';
        a.style.color = accentVar(s.color);
        a.textContent = s.name || '';
        socialWrap.appendChild(a);
      });
      right.appendChild(socialWrap);
    }
    grid.appendChild(right);
    container.appendChild(grid);
  }

  function renderCVSection() {
    var container = document.getElementById('cv-content');
    if (!container) return;

    var cv = (data.contact && data.contact.cv) ? data.contact.cv : {};
    var homeDesc = (data.pageContent && data.pageContent.home && data.pageContent.home.description) ? data.pageContent.home.description : '';

    container.innerHTML = '';

    if (homeDesc) {
      var summary = document.createElement('p');
      summary.className = 'cv-summary';
      summary.textContent = homeDesc;
      container.appendChild(summary);
    }

    if (cv.education && cv.education.length > 0) {
      var eduBlock = document.createElement('div');
      eduBlock.className = 'cv-block';
      var eduTitle = document.createElement('h3');
      eduTitle.className = 'cv-block__title';
      eduTitle.textContent = 'Education';
      eduBlock.appendChild(eduTitle);
      var table = document.createElement('table');
      table.className = 'cv-table';
      var thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Degree</th><th>Institution</th><th>Location</th><th>Period</th></tr>';
      table.appendChild(thead);
      var tbody = document.createElement('tbody');
      cv.education.forEach(function (row) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + esc(row.degree || '') + '</td><td>' + esc(row.institution || '') + '</td><td>' + esc(row.location || '') + '</td><td>' + esc(row.period || '') + '</td>';
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      eduBlock.appendChild(table);
      container.appendChild(eduBlock);
    }

    if (cv.workExperience && cv.workExperience.length > 0) {
      var workBlock = document.createElement('div');
      workBlock.className = 'cv-block';
      var workTitle = document.createElement('h3');
      workTitle.className = 'cv-block__title';
      workTitle.textContent = 'Work Experience';
      workBlock.appendChild(workTitle);
      cv.workExperience.forEach(function (job) {
        var entry = document.createElement('div');
        entry.className = 'cv-timeline-entry';
        var main = document.createElement('div');
        var title = document.createElement('div');
        title.className = 'cv-timeline-title';
        title.textContent = (job.title || '') + (job.company ? ' · ' + job.company : '');
        main.appendChild(title);
        if (job.location) {
          var meta = document.createElement('div');
          meta.className = 'cv-timeline-meta';
          meta.textContent = job.location;
          main.appendChild(meta);
        }
        entry.appendChild(main);
        var period = document.createElement('div');
        period.className = 'cv-timeline-period';
        period.textContent = job.period || '';
        entry.appendChild(period);
        workBlock.appendChild(entry);
      });
      container.appendChild(workBlock);
    }
  }

  /**
   * Marquee speed from cursor distance: close = faster, far = slower.
   * Best practices: RAF-throttled updates, smooth lerp, resize/scroll/leave handling,
   * prefers-reduced-motion and coarse pointer (touch) get fixed slow speed.
   */
  function initMarqueeCursorSpeed() {
    var tracks = document.querySelectorAll('.marquee-track--clickable');
    if (tracks.length === 0) return;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReducedMotion || !hasFinePointer) {
      tracks.forEach(function (t) { t.style.setProperty('--marquee-duration', '160s'); });
      return;
    }

    var DURATION_MIN = 50;
    var DURATION_MAX = 160;
    var DISTANCE_MAX = 500;
    var LERP_FACTOR = 0.09;
    var SNAP_THRESHOLD = 0.4;
    var CURSOR_LEFT_SENTINEL = -1e5;

    var raf = null;
    var dirty = false;
    var lastX = CURSOR_LEFT_SENTINEL;
    var lastY = CURSOR_LEFT_SENTINEL;
    var trackData = new Map();

    function getTrackData(track) {
      if (!trackData.has(track)) {
        trackData.set(track, { current: DURATION_MAX, target: DURATION_MAX });
      }
      return trackData.get(track);
    }

    function distanceFromPointToRect(x, y, rect) {
      if (x <= CURSOR_LEFT_SENTINEL + 1e4 || y <= CURSOR_LEFT_SENTINEL + 1e4) {
        return DISTANCE_MAX + 1;
      }
      var dx = Math.max(0, Math.max(rect.left - x, x - rect.right));
      var dy = Math.max(0, Math.max(rect.top - y, y - rect.bottom));
      return Math.sqrt(dx * dx + dy * dy);
    }

    function updateTargets() {
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        var rect = track.getBoundingClientRect();
        var d = distanceFromPointToRect(lastX, lastY, rect);
        var t = Math.min(1, d / DISTANCE_MAX);
        var target = DURATION_MIN + t * (DURATION_MAX - DURATION_MIN);
        getTrackData(track).target = target;
      }
    }

    function animate() {
      raf = null;
      if (dirty) {
        updateTargets();
        dirty = false;
      }
      var stillAnimating = false;
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        var data = getTrackData(track);
        data.current += (data.target - data.current) * LERP_FACTOR;
        if (Math.abs(data.current - data.target) > SNAP_THRESHOLD) {
          stillAnimating = true;
        }
        track.style.setProperty('--marquee-duration', data.current.toFixed(2) + 's');
      }
      if (stillAnimating) {
        raf = requestAnimationFrame(animate);
      }
    }

    function scheduleUpdate() {
      dirty = true;
      if (raf == null) {
        raf = requestAnimationFrame(animate);
      }
    }

    function onMove(e) {
      lastX = e.clientX;
      lastY = e.clientY;
      scheduleUpdate();
    }

    function onCursorLeave() {
      lastX = CURSOR_LEFT_SENTINEL;
      lastY = CURSOR_LEFT_SENTINEL;
      scheduleUpdate();
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onCursorLeave, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    updateTargets();
    scheduleUpdate();
  }

  /* ---------- Home view toggle (marquee vs list) ---------- */

  function initHomeViewToggle() {
    var toggleRoot = document.querySelector('.home-view-toggle');
    if (!toggleRoot) return;

    var marqueeEl = document.getElementById('marquees-content');
    var listEl = document.getElementById('list-content');
    var buttons = toggleRoot.querySelectorAll('.view-toggle-button');

    if (!marqueeEl || !listEl || !buttons.length) return;

    var currentView = 'marquee';
    try {
      var stored = sessionStorage.getItem('homeView');
      if (stored === 'list' || stored === 'marquee') currentView = stored;
    } catch (e) { /* ignore */ }

    function applyView(view) {
      currentView = view === 'list' ? 'list' : 'marquee';

      marqueeEl.hidden = currentView !== 'marquee';
      listEl.hidden = currentView !== 'list';

      buttons.forEach(function (btn) {
        var viewName = btn.getAttribute('data-view');
        var isActive = viewName === currentView;
        btn.classList.toggle('view-toggle-button--active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      try {
        sessionStorage.setItem('homeView', currentView);
      } catch (e) { /* ignore */ }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var viewName = btn.getAttribute('data-view');
        applyView(viewName);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        var viewName = btn.getAttribute('data-view');
        applyView(viewName);
      });
    });

    applyView(currentView);
  }

  function init() {
    renderMarqueesSection();
    renderListSection();
    renderExhibitionsSection();
    renderAboutSection();
    renderCVSection();
    initHomeViewToggle();
    initMarqueeCursorSpeed();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
