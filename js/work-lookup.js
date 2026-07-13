/**
 * work-lookup.js — find portfolio items by id and build work page URLs
 */
(function () {
  'use strict';

  var CANONICAL_BASE = 'https://atharvagupta.net';

  var PROJECT_SOURCES = [
    { key: 'installations', kind: 'installation' },
    { key: 'performance', kind: 'performance' },
    { key: 'soundInstallations', kind: 'sound' },
    { key: 'drawings', kind: 'visual' },
    { key: 'writing', kind: 'writing' },
    { key: 'funProjects', kind: 'fun' }
  ];

  function getData() {
    return (typeof window !== 'undefined' && window.portfolioData) ? window.portfolioData : null;
  }

  function findPortfolioItem(id) {
    if (!id) return null;
    var data = getData();
    if (!data) return null;

    var i;
    var list;
    var item;

    if (data.projects) {
      for (i = 0; i < PROJECT_SOURCES.length; i++) {
        list = data.projects[PROJECT_SOURCES[i].key];
        if (!Array.isArray(list)) continue;
        for (var j = 0; j < list.length; j++) {
          item = list[j];
          if (item && item.id === id) {
            return { item: item, kind: PROJECT_SOURCES[i].kind };
          }
        }
      }
    }

    if (Array.isArray(data.exhibitions)) {
      for (i = 0; i < data.exhibitions.length; i++) {
        item = data.exhibitions[i];
        if (item && item.id === id) {
          return { item: item, kind: 'exhibition' };
        }
      }
    }

    return null;
  }

  function toWorkPageItem(item, kind) {
    if (!item) return null;

    if (kind === 'exhibition') {
      return {
        id: item.id,
        title: item.title || '',
        category: item.role || '',
        fullDescription: item.fullDescription || item.description || '',
        date: item.date || '',
        location: item.location || '',
        venue: item.venue || '',
        images: item.images || [],
        videos: item.videos || [],
        urls: item.urls || {}
      };
    }

    return {
      id: item.id,
      title: item.title || '',
      category: item.category || '',
      fullDescription: item.fullDescription || item.description || '',
      images: item.images || [],
      videos: item.videos || [],
      urls: item.urls || {},
      medium: item.medium || '',
      themes: item.themes || '',
      technical: item.technical || '',
      bandcampTracks: item.bandcampTracks || null
    };
  }

  function isInsideWorkPage() {
    var path = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
    return /\/work\/[^/]+\/?/.test(path);
  }

  function isFileProtocol() {
    return window.location.protocol === 'file:';
  }

  function workPageUrl(id, opts) {
    if (!id) return '';
    opts = opts || {};

    if (opts.absolute) {
      return CANONICAL_BASE + '/work/' + encodeURIComponent(id) + '/';
    }

    var base = isInsideWorkPage()
      ? '../' + encodeURIComponent(id)
      : './work/' + encodeURIComponent(id);

    if (isFileProtocol()) {
      return base + '/index.html';
    }

    return base + '/';
  }

  function resolveWorkHref(item) {
    if (!item) return '';
    if (item.urls && item.urls.page) return item.urls.page;
    if (!item.id) return '';
    return workPageUrl(item.id);
  }

  window.portfolioWorkLookup = {
    CANONICAL_BASE: CANONICAL_BASE,
    findPortfolioItem: findPortfolioItem,
    toWorkPageItem: toWorkPageItem,
    workPageUrl: workPageUrl,
    resolveWorkHref: resolveWorkHref
  };
})();
