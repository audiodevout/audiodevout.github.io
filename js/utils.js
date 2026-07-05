/**
 * utils.js — shared helpers; used by render, lightbox, player
 * Check window.portfolioData before use.
 */
(function () {
  'use strict';

  window.portfolioUtils = {
    getSiteRoot: function () {
      var scripts = document.getElementsByTagName('script');
      var i;
      for (i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (src && src.indexOf('portfolioData.js') !== -1) {
          return new URL('.', src).href;
        }
      }
      return new URL('./', window.location.href).href;
    },

    resolveAssetSrc: function (src) {
      if (!src || typeof src !== 'string') return src;
      if (/^https?:\/\//i.test(src)) return src;
      var root = window.portfolioUtils.getSiteRoot();
      if (src.charAt(0) === '/') return new URL(src.slice(1), root).href;
      if (src.indexOf('./') === 0) return new URL(src.slice(2), root).href;
      return new URL(src, root).href;
    },

    esc: function (s) {
      if (s == null || s === '') return '';
      var div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    },

    getYoutubeId: function (url) {
      if (!url || typeof url !== 'string') return '';
      if (url.indexOf('youtube.com') !== -1) {
        var qs = (url.split('?')[1] || '').split('&').reduce(function (acc, p) {
          var parts = p.split('=');
          if (parts[0]) acc[parts[0]] = parts[1] || '';
          return acc;
        }, {});
        return qs.v || '';
      }
      if (url.indexOf('youtu.be/') !== -1) return url.split('/').pop().split('?')[0];
      return '';
    },

    isYoutubeUrl: function (url) {
      return typeof url === 'string' && (url.indexOf('youtube') !== -1 || url.indexOf('youtu.be') !== -1);
    },

    getThumbSrc: function (src) {
      if (!src || typeof src !== 'string') return src;
      var resolved = window.portfolioUtils.resolveAssetSrc(src);
      if (resolved.indexOf('assets/images/thumbs/') !== -1) return resolved;
      var marker = 'assets/images/';
      var idx = resolved.indexOf(marker);
      if (idx === -1) return resolved;
      var rel = resolved.slice(idx + marker.length).split('?')[0].split('#')[0];
      var dot = rel.lastIndexOf('.');
      if (dot !== -1) rel = rel.slice(0, dot) + '.webp';
      return window.portfolioUtils.resolveAssetSrc('./assets/images/thumbs/' + rel);
    }
  };

  // Populate hero from portfolioData when available
  var heroInitialized = false;
  function initHero() {
    if (heroInitialized) return;
    var data = window.portfolioData;
    if (!data || !data.pageContent || !data.pageContent.home) return;
    heroInitialized = true;
    var home = data.pageContent.home;
    var labelEl = document.getElementById('hero-label');
    var titleEl = document.getElementById('hero-title');
    var descEl = document.getElementById('hero-description');
    if (labelEl && home.subtitle) labelEl.textContent = home.subtitle;
    if (titleEl && home.title) titleEl.textContent = home.title;
    if (descEl && home.description) {
      var words = home.description.trim().split(/\s+/);
      var html = words.map(function (w) { return '<span class="word">' + window.portfolioUtils.esc(w) + '</span>'; }).join(' ');
      descEl.innerHTML = html;
    }
  }

  document.addEventListener('portfolio:ready', initHero);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }
})();
