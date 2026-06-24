/**
 * 6969osc hero — split title into animated character spans; optional idle shimmer.
 */
(function () {
  'use strict';

  var titleSelector = '.osc-hero-title';

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function initTitle() {
    var h1 = document.querySelector(titleSelector);
    if (!h1) return;

    var raw = (h1.textContent || '').trim();
    if (!raw) return;

    try {
      h1.setAttribute('aria-label', raw);
      h1.textContent = '';

      var chars = raw.split('');
      for (var i = 0; i < chars.length; i++) {
        var span = document.createElement('span');
        span.className = 'osc-hero-title__char';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--i', String(i));
        span.textContent = chars[i];
        if (prefersReducedMotion()) {
          span.classList.add('osc-hero-title__char--static');
        }
        h1.appendChild(span);
      }

      h1.classList.add('osc-hero-title--ready');

      if (!prefersReducedMotion()) {
        window.setTimeout(function () {
          h1.classList.add('osc-hero-title--idle');
        }, 1180 + chars.length * 70);
      }
    } catch (e) {
      h1.textContent = raw;
      h1.removeAttribute('aria-label');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTitle);
  } else {
    initTitle();
  }
})();
