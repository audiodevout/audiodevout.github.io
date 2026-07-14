/**
 * transition-hints.js — named view-transition on clicked nav/list links (pageswap/pagereveal).
 */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof PageSwapEvent === 'undefined') return;

  var NAMED = 'nav-active-link';

  function findLink(target) {
    if (!target || !target.closest) return null;
    return target.closest('.work-list__item, .nav-link');
  }

  window.addEventListener('pageswap', function (event) {
    if (!event.viewTransition) return;
    var link = findLink(event.activation && event.activation.source);
    if (!link) return;
    link.style.viewTransitionName = NAMED;
    event.viewTransition.finished.finally(function () {
      link.style.viewTransitionName = '';
    });
  });

  window.addEventListener('pagereveal', function (event) {
    if (!event.viewTransition) return;
    var link = findLink(document.activeElement);
    if (!link) {
      link = document.querySelector('.nav-link.is-active, .work-list__item:focus-visible');
    }
    if (!link) return;
    link.style.viewTransitionName = NAMED;
    event.viewTransition.finished.finally(function () {
      link.style.viewTransitionName = '';
    });
  });
})();
