/**
 * gallery.js — VISUAL RESEARCH as series strips
 * One row per project (newest first when a year/date exists, else data order):
 * header with title, year, link to the work page; below it a horizontal strip.
 * Strip + fullscreen viewer come from js/viewer.js.
 */
(function () {
  'use strict';

  /* Rows whose images load eagerly; the rest use native lazy-loading */
  var EAGER_ROWS = 2;

  var root;
  var loadingEl;

  function workHref(id) {
    if (window.portfolioWorkLookup && typeof window.portfolioWorkLookup.workPageUrl === 'function') {
      return window.portfolioWorkLookup.workPageUrl(id);
    }
    return './work/' + encodeURIComponent(id) + '/';
  }

  /* Mirrors yearFromItem() in scripts/generate-work-pages.js */
  function yearFromItem(item) {
    if (item.year != null && item.year !== '') return String(item.year);
    var match = String(item.date || item.youtubeDate || '').match(/(\d{4})/);
    return match ? match[1] : '';
  }

  function sortNewestFirst(items) {
    return items
      .map(function (item, index) {
        return { item: item, index: index, year: parseInt(yearFromItem(item), 10) || 0 };
      })
      .sort(function (a, b) {
        return (b.year - a.year) || (a.index - b.index);
      })
      .map(function (entry) { return entry.item; });
  }

  function buildRow(item, rowIndex) {
    var title = item.title || 'Untitled';
    var href = workHref(item.id);
    var year = yearFromItem(item);
    var headingId = 'series-' + item.id;

    var section = document.createElement('section');
    section.className = 'gallery-series reveal';
    section.style.setProperty('--i', Math.min(rowIndex, 8));
    section.setAttribute('aria-labelledby', headingId);

    var head = document.createElement('header');
    head.className = 'gallery-series__head';

    var h2 = document.createElement('h2');
    h2.className = 'gallery-series__title';
    h2.id = headingId;
    h2.textContent = title;
    head.appendChild(h2);

    var meta = document.createElement('span');
    meta.className = 'gallery-series__meta';
    var count = item.images.length;
    meta.textContent = [year, count + (count === 1 ? ' image' : ' images')].filter(Boolean).join(' · ');
    head.appendChild(meta);

    var link = document.createElement('a');
    link.className = 'gallery-series__link';
    link.href = href;
    link.textContent = 'view work →';
    link.setAttribute('aria-label', 'View work: ' + title);
    head.appendChild(link);

    section.appendChild(head);

    var series = { title: title, href: href, images: item.images.slice() };
    section.appendChild(window.portfolioStrip.build(series, {
      variant: 'gallery',
      eagerCount: rowIndex < EAGER_ROWS ? 6 : 0
    }));

    return section;
  }

  function render(data) {
    if (!root) return;

    var drawings = (data.projects && data.projects.drawings) || [];
    var items = drawings.filter(function (item) {
      return item.category === 'VISUAL RESEARCH' && item.images && item.images.length > 0;
    });

    root.innerHTML = '';

    if (!items.length || !window.portfolioStrip) {
      if (loadingEl) {
        loadingEl.textContent = 'No visual research items found.';
        loadingEl.hidden = false;
      }
      return;
    }

    sortNewestFirst(items).forEach(function (item, rowIndex) {
      root.appendChild(buildRow(item, rowIndex));
    });

    if (loadingEl) loadingEl.hidden = true;

    if (typeof window.refreshScrollReveal === 'function') {
      window.refreshScrollReveal();
    }
  }

  function init() {
    root = document.getElementById('gallery-root');
    loadingEl = document.getElementById('gallery-loading');
    if (!root) return;

    if (window.portfolioData) {
      render(window.portfolioData);
    } else {
      document.addEventListener('portfolio:ready', function () {
        render(window.portfolioData);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
