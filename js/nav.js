/**
 * nav.js — mobile-friendly vertical navigation (hamburger + full-screen overlay)
 */
(function () {
  'use strict';

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var overlay = document.getElementById('mobile-nav');
    if (!toggle || !overlay) return;

    var body = document.body;

    function openNav() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    }

    function closeNav() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }

    function toggleNav() {
      if (overlay.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    }

    toggle.addEventListener('click', function () {
      toggleNav();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target && e.target.classList.contains('nav-link')) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeNav();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();

