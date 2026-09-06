/**
 * router.js — set active state on top nav and site brand by pathname
 */
(function () {
  'use strict';

  const siteBrand = document.querySelector('.site-brand');
  const navLinks = document.querySelectorAll('.main-nav .nav-link, .nav-overlay .nav-link');

  function getPageSection() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('/work/') !== -1) return null;
    if (path.indexOf('exhibitions') !== -1) return 'exhibitions';
    if (path.indexOf('gallery') !== -1) return 'gallery';
    if (path.indexOf('archive') !== -1 || path.indexOf('thesis') !== -1) return 'archive';
    if (path.indexOf('about') !== -1) return 'about';
    return 'home';
  }

  function linkSection(href) {
    if (href.indexOf('exhibitions') !== -1) return 'exhibitions';
    if (href.indexOf('gallery') !== -1) return 'gallery';
    if (href.indexOf('archive') !== -1) return 'archive';
    if (href.indexOf('about') !== -1) return 'about';
    if (
      href === 'index.html' ||
      href === './index.html' ||
      href === '/index.html' ||
      href.endsWith('/')
    ) {
      return 'home';
    }
    return null;
  }

  function setActiveState() {
    const current = getPageSection();
    if (current === null) {
      if (siteBrand) siteBrand.classList.remove('is-active');
      navLinks.forEach(function (link) {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });
      return;
    }
    if (siteBrand) {
      siteBrand.classList.toggle('is-active', current === 'home');
    }
    navLinks.forEach(function (link) {
      const href = (link.getAttribute('href') || '').trim();
      const section = linkSection(href);
      const isActive = section !== null && section === current;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  setActiveState();
})();
