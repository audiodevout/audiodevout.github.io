/**
 * Folios are rendered via ifb-folios.css (@page margin boxes).
 * These no-ops remain so existing book handlers do not error.
 */
(function () {
  function noop() {}

  window.ifbPaintFolioOnPage = noop;
  window.ifbPaintFoliosInRoot = noop;
})();
