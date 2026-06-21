/**
 * utils.js — shared helpers; used by render, lightbox, player
 * Check window.portfolioData before use.
 */
(function () {
  'use strict';

  window.portfolioUtils = {
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
