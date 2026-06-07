/**
 * scroll-reveal.js — IntersectionObserver reveal (Phase 5)
 * Adds .revealed when .reveal elements enter viewport; skip if already visible on load.
 */
(function () {
  'use strict';

  function init() {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
      });
    }, { threshold: 0.15, rootMargin: '0px' });

    reveals.forEach(function (el, i) {
      el.style.setProperty('--i', i);
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
