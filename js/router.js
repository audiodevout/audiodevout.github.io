/**
 * router.js — set active state on top nav and site brand by pathname
 */
(function () {
  'use strict';

  const siteBrand = document.querySelector('.site-brand');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  function getPageSection() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('/work/') !== -1) return null;
    if (path.indexOf('exhibitions') !== -1) return 'exhibitions';
    if (path.indexOf('gallery') !== -1) return 'gallery';
    if (path.indexOf('archive') !== -1 || path.indexOf('thesis') !== -1) return 'archive';
    if (path.indexOf('about') !== -1) return 'about';
    return 'home';
  }

  function setActiveState() {
    const current = getPageSection();
    if (current === null) {
      if (siteBrand) siteBrand.classList.remove('is-active');
      navLinks.forEach(function (link) {
        link.classList.remove('is-active');
      });
      return;
    }
    if (siteBrand) {
      siteBrand.classList.toggle('is-active', current === 'home');
    }
    navLinks.forEach(function (link) {
      const href = (link.getAttribute('href') || '').trim();
      let linkSection = null;
      if (href.indexOf('exhibitions') !== -1) linkSection = 'exhibitions';
      else if (href.indexOf('gallery') !== -1) linkSection = 'gallery';
      else if (href.indexOf('archive') !== -1) linkSection = 'archive';
      else if (href.indexOf('about') !== -1) linkSection = 'about';
      else if (
        href === 'index.html' ||
        href === './index.html' ||
        href === '/index.html' ||
        href.endsWith('/')
      ) {
        linkSection = 'home';
      }
      link.classList.toggle('is-active', linkSection !== null && linkSection === current);
    });
  }

  setActiveState();
})();
