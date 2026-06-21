/**
 * scroll-reveal.js — IntersectionObserver reveal (Phase 5)
 * Adds .revealed when .reveal elements enter viewport.
 * Re-scans after portfolio content is rendered (timeline entries, etc.).
 */
(function () {
  'use strict';

  var observer = null;
  var observed = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
  var observedFallback = [];

  function alreadyObserved(el) {
    if (observed) return observed.has(el);
    return observedFallback.indexOf(el) !== -1;
  }

  function markObserved(el) {
    if (observed) observed.add(el);
    else observedFallback.push(el);
  }

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  function initObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px' });
    return observer;
  }

  function observeReveals() {
    var obs = initObserver();
    var reveals = document.querySelectorAll('.reveal:not(.revealed)');
    reveals.forEach(function (el, i) {
      if (alreadyObserved(el)) return;
      markObserved(el);
      el.style.setProperty('--i', i);
      if (isInViewport(el)) {
        el.classList.add('revealed');
        return;
      }
      obs.observe(el);
    });
  }

  window.refreshScrollReveal = observeReveals;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeReveals);
  } else {
    observeReveals();
  }

  document.addEventListener('portfolio:ready', observeReveals);
})();
