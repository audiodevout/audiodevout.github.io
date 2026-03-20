/**
 * router.js — set active state on top nav and site brand by pathname
 */
(function () {
  'use strict';

  const siteBrand = document.querySelector('.site-brand');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  function getPageSection() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('exhibitions') !== -1) return 'exhibitions';
    if (path.indexOf('about') !== -1) return 'about';
    return 'home';
  }

  function setActiveState() {
    const current = getPageSection();
    if (siteBrand) {
      siteBrand.classList.toggle('is-active', current === 'home');
    }
    navLinks.forEach(function (link) {
      const href = (link.getAttribute('href') || '').trim();
      let linkSection = null;
      if (href.indexOf('exhibitions') !== -1) linkSection = 'exhibitions';
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
