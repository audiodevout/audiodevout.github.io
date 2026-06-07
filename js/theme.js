/**
 * theme.js — light/dark toggle (Phase 5), persisted in localStorage
 */
(function () {
  'use strict';

  var KEY = 'portfolio-theme';
  var DARK = 'dark';
  var LIGHT = 'light';

  function getStored() {
    try {
      return localStorage.getItem(KEY) || DARK;
    } catch (e) {
      return DARK;
    }
  }

  function setStored(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {}
  }

  function apply(theme) {
    if (theme === LIGHT) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function init() {
    apply(getStored());
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = getStored() === LIGHT ? DARK : LIGHT;
        setStored(next);
        apply(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
