/**
 * loading.js — first-visit loading screen (Phase 5)
 * Fades out when portfolioData is ready; remove from DOM after.
 */
(function () {
  'use strict';

  var MIN_DISPLAY_MS = 1500;
  var start = Date.now();

  function hide() {
    var el = document.getElementById('loading-screen');
    if (!el) return;
    el.classList.add('is-hidden');
    setTimeout(function () {
      el.remove();
    }, 400);
  }

  function tryHide() {
    if (typeof window.portfolioData === 'undefined') return;
    var elapsed = Date.now() - start;
    if (elapsed >= MIN_DISPLAY_MS) {
      hide();
    } else {
      setTimeout(hide, MIN_DISPLAY_MS - elapsed);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      tryHide();
      setTimeout(tryHide, MIN_DISPLAY_MS + 200);
    });
  } else {
    tryHide();
  }
})();
