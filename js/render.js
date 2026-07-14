/**
 * render.js — DOM rendering from portfolioData (Phase 2)
 * Work section: installations, performance, visual (grouped), tutorials row.
 * No unsanitized innerHTML for user content.
 */
(function () {
  'use strict';

  var data = null;

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

  function workHref(item) {
    var lookup = window.portfolioWorkLookup;
    if (lookup && typeof lookup.resolveWorkHref === 'function') {
      return lookup.resolveWorkHref(item);
    }
    if (item && item.urls && item.urls.page) return item.urls.page;
    if (item && item.id) {
      if (window.location.protocol === 'file:') {
        return './work/' + encodeURIComponent(item.id) + '/index.html';
      }
      return './work/' + encodeURIComponent(item.id) + '/';
    }
    return '';
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

  function sortByYoutubeDate(items) {
    return (items || []).slice().sort(function (a, b) {
      var dA = a.youtubeDate || '';
      var dB = b.youtubeDate || '';
      if (dB !== dA) return dB.localeCompare(dA);
      return (a.title || '').localeCompare(b.title || '');
    });
  }

  function sortVisualGroupsByYoutubeDate(groups) {
    var sorted = {};
    Object.keys(groups).forEach(function (cat) {
      var list = groups[cat] || [];
      if (cat === 'TouchDesigner Tutorials') {
        sorted[cat] = sortByYoutubeDate(list);
      } else {
        sorted[cat] = list;
      }
    });
    return sorted;
  }

  var THESIS_ARCHIVE_ITEM = {
    id: 'thesis-instruments-for-becoming',
    title: 'Instruments for Becoming',
    category: 'THESIS',
    description: 'A manual for sound practitioners — MADTECH, Frank Mohr Institute, 2026',
    urls: { page: './thesis/' }
  };

  function createArchiveListItem(item) {
    if (!item) return null;

    var link = document.createElement('a');
    link.className = 'work-list__item work-list__item--link';
    link.href = workHref(item);

    var linkTitle = document.createElement('h3');
    linkTitle.className = 'work-list__title';
    linkTitle.textContent = item.title || '';
    link.appendChild(linkTitle);
    link.classList.add('reveal');

    return link;
  }

  function renderArchiveSection() {
    var container = document.getElementById('archive-content');
    if (!container) return;

    var writingItems = dedupeById((data.projects && data.projects.writing) ? data.projects.writing : []);
    var archiveItems = [THESIS_ARCHIVE_ITEM].concat(writingItems);

    container.innerHTML = '';

    var listRoot = document.createElement('div');
    listRoot.className = 'work-list';

    archiveItems.forEach(function (item, index) {
      var row = createArchiveListItem(item);
      if (row) {
        row.style.setProperty('--i', Math.min(index + 1, 10));
        listRoot.appendChild(row);
      }
    });

    container.appendChild(listRoot);
  }

  /* ---------- Home list view (minimal rows) ---------- */

  function createListItem(item) {
    if (!item) return null;

    var link = document.createElement('a');
    link.className = 'work-list__item';
    link.href = workHref(item);
    link.dataset.id = item.id || '';

    var title = document.createElement('h3');
    title.className = 'work-list__title';
    title.textContent = item.title || '';
    link.appendChild(title);

    var listThumb = firstImage(item);
    if (listThumb) {
      link.setAttribute('data-preview-src', listThumb);
    }

    return link;
  }

  function addListGroup(listRoot, heading, items) {
    if (!listRoot || !items || items.length === 0) return;
    var group = document.createElement('section');
    group.className = 'work-list__group';

    var h = document.createElement('h2');
    h.className = 'work-list__group-label reveal';
    h.textContent = heading;
    group.appendChild(h);

    items.forEach(function (item, index) {
      var row = createListItem(item);
      if (row) {
        row.classList.add('reveal');
        row.style.setProperty('--i', Math.min(index + 1, 10));
        group.appendChild(row);
      }
    });

    listRoot.appendChild(group);
  }

  function renderListSection() {
    var container = document.getElementById('list-content');
    if (!container) return;

    container.innerHTML = '';

    var listRoot = document.createElement('div');
    listRoot.className = 'work-list';

    var installations = dedupeById(data.projects.installations || []);
    var performance = dedupeById(data.projects.performance || []);
    var worksItems = installations.concat(performance);
    var drawings = dedupeById(data.projects.drawings || []);
    var soundItems = dedupeById(data.projects.soundInstallations || []);

    addListGroup(listRoot, 'Works', worksItems);

    if (soundItems.length) {
      addListGroup(listRoot, 'Sound', soundItems);
    }

    var visualGroups = sortVisualGroupsByYoutubeDate(groupByCategory(drawings));
    Object.keys(visualGroups).forEach(function (cat) {
      if (cat === 'VISUAL RESEARCH') return;
      addListGroup(listRoot, cat, visualGroups[cat]);
    });

    var funItems = dedupeById(data.projects.funProjects || []);
    if (funItems.length) {
      addListGroup(listRoot, 'Fun Projects', funItems);
    }

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
  function createExhibitionListItem(ex) {
    if (!ex) return null;

    var link = document.createElement('a');
    link.className = 'work-list__item work-list__item--exhibition';
    link.href = workHref(ex);
    link.dataset.id = ex.id || '';

    var line = document.createElement('p');
    line.className = 'work-list__line';

    var parts = [
      { text: ex.title, className: 'work-list__title' },
      { text: ex.venue, className: 'work-list__detail' },
      { text: ex.location, className: 'work-list__detail' },
      { text: ex.date, className: 'work-list__detail' }
    ].filter(function (part) { return part.text; });

    parts.forEach(function (part, index) {
      if (index > 0) {
        var sep = document.createElement('span');
        sep.className = 'work-list__sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = ' · ';
        line.appendChild(sep);
      }
      var span = document.createElement('span');
      span.className = part.className;
      span.textContent = part.text;
      line.appendChild(span);
    });

    link.appendChild(line);

    var listThumb = firstImage(ex);
    if (listThumb) {
      link.setAttribute('data-preview-src', listThumb);
    }

    return link;
  }

  function addExhibitionListGroup(listRoot, heading, items) {
    if (!listRoot || !items || items.length === 0) return;

    var group = document.createElement('section');
    group.className = 'work-list__group';

    var h = document.createElement('h2');
    h.className = 'work-list__group-label reveal';
    h.textContent = heading;
    group.appendChild(h);

    items.forEach(function (ex, index) {
      var row = createExhibitionListItem(ex);
      if (row) {
        row.classList.add('reveal');
        row.style.setProperty('--i', Math.min(index + 1, 10));
        group.appendChild(row);
      }
    });

    listRoot.appendChild(group);
  }

  function renderExhibitionsSection() {
    var container = document.getElementById('exhibitions-content');
    if (!container) return;

    var list = data.exhibitions || [];
    list = list.slice().sort(function (a, b) {
      var yA = a.year != null ? a.year : 0;
      var yB = b.year != null ? b.year : 0;
      if (yB !== yA) return yB - yA;
      var sA = a.sortDate != null ? a.sortDate : 0;
      var sB = b.sortDate != null ? b.sortDate : 0;
      if (sB !== sA) return sB - sA;
      return (a.title || '').localeCompare(b.title || '');
    });

    container.innerHTML = '';

    var listRoot = document.createElement('div');
    listRoot.className = 'work-list';

    var yearBuckets = [];
    var currentBucket = null;
    list.forEach(function (ex) {
      var year = ex.year != null ? ex.year : (ex.date ? parseInt(String(ex.date).slice(0, 4), 10) : 0);
      var label = year ? String(year) : 'Other';
      if (!currentBucket || currentBucket.label !== label) {
        currentBucket = { label: label, items: [] };
        yearBuckets.push(currentBucket);
      }
      currentBucket.items.push(ex);
    });

    yearBuckets.forEach(function (bucket) {
      addExhibitionListGroup(listRoot, bucket.label, bucket.items);
    });

    container.appendChild(listRoot);
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

  var initialized = false;
  function init() {
    data = (typeof window !== 'undefined') ? window.portfolioData : null;
    if (!data) return;

    if (document.getElementById('exhibitions-content')) renderExhibitionsSection();
    if (document.getElementById('archive-content')) renderArchiveSection();
    if (document.getElementById('about-content')) renderAboutSection();
    if (document.getElementById('cv-content')) renderCVSection();

    if (!data.projects) return;
    if (initialized) return;
    initialized = true;
    renderListSection();

    if (typeof window.refreshScrollReveal === 'function') {
      window.refreshScrollReveal();
    }
  }

  document.addEventListener('portfolio:ready', init);
  if (window.portfolioData) {
    init();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
