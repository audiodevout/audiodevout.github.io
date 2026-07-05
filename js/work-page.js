/**
 * work-page.js — progressive enhancement for generated work pages
 */
(function () {
  'use strict';

  var lookup = window.portfolioWorkLookup || {};
  var detail = window.portfolioWorkDetail || {};
  var findPortfolioItem = lookup.findPortfolioItem || function () { return null; };
  var toWorkPageItem = lookup.toWorkPageItem || function (item) { return item; };
  var renderWorkMeta = detail.renderWorkMeta || function () {};
  var renderWorkBody = detail.renderWorkBody || function () {};
  var renderWorkMedia = detail.renderWorkMedia || function () {};

  function getWorkId() {
    var root = document.getElementById('work-page');
    return root ? root.getAttribute('data-work-id') : '';
  }

  function showNotFound() {
    var main = document.getElementById('work-page');
    if (!main) return;
    var article = main.querySelector('.work-page__article');
    if (article) {
      var notice = document.createElement('p');
      notice.className = 'work-page__notice';
      notice.textContent = 'Live project data could not be loaded. Showing saved page content.';
      main.insertBefore(notice, article);
      return;
    }
    main.innerHTML =
      '<div class="work-page__not-found">' +
      '<p>This work page is out of date or the project was removed.</p>' +
      '<a class="work-page__back" href="../../index.html">← Back to home</a>' +
      '</div>';
  }

  function enhancePage() {
    var workId = getWorkId();
    if (!workId) return;

    var found = findPortfolioItem(workId);
    if (!found) {
      showNotFound();
      return;
    }

    var item = toWorkPageItem(found.item, found.kind);
    if (!item || item.id !== workId) {
      showNotFound();
      return;
    }

    var mediaHost = document.querySelector('[data-work-media-host]');
    if (mediaHost) {
      renderWorkMedia(mediaHost, item, { inline: true });
    }

    var bodyHost = document.querySelector('[data-work-body-host]');
    if (bodyHost) {
      var staticDesc = bodyHost.querySelector('.work-page__description');
      renderWorkBody(bodyHost, item, {});
      if (staticDesc && staticDesc.textContent && !item.fullDescription) {
        bodyHost.insertBefore(staticDesc, bodyHost.firstChild);
      } else if (staticDesc) {
        staticDesc.remove();
      }
    }

    var metaEl = document.querySelector('.work-page__meta');
    if (metaEl) {
      renderWorkMeta({ meta: metaEl }, item, {});
    }

    if (typeof window.refreshScrollReveal === 'function') {
      window.refreshScrollReveal();
    }
  }

  function init() {
    if (window.portfolioData) {
      enhancePage();
    } else {
      document.addEventListener('portfolio:ready', enhancePage);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
