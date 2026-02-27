/**
 * cursor.js — custom cursor (Phase 5)
 * Small circle with lerp; expands on hoverables; "VIEW" on gallery images; disabled on touch.
 */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  var cursorLabel = document.createElement('span');
  cursorLabel.className = 'custom-cursor__label';
  cursorLabel.textContent = 'VIEW';
  cursor.appendChild(cursorLabel);

  var x = 0, y = 0;
  var tx = 0, ty = 0;
  var size = 12;
  var targetSize = 12;
  var LERP = 0.15;

  document.addEventListener('mousemove', function (e) {
    x = e.clientX;
    y = e.clientY;
  });

  function update() {
    tx += (x - tx) * LERP;
    ty += (y - ty) * LERP;
    size += (targetSize - size) * 0.2;
    var s = size;
    cursor.style.transform = 'translate(' + (tx - s / 2) + 'px, ' + (ty - s / 2) + 'px) scale(' + (s / 12) + ')';
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  function enterHover(e) {
    targetSize = 40;
    cursor.classList.add('is-hover');
    if (e.target && e.target.closest && e.target.closest('.work-card__media')) {
      cursor.classList.add('is-view');
    } else {
      cursor.classList.remove('is-view');
    }
  }

  function leaveHover() {
    targetSize = 12;
    cursor.classList.remove('is-hover', 'is-view');
  }

  var hoverables = document.querySelectorAll('a, button, .work-card');
  hoverables.forEach(function (el) {
    el.addEventListener('mouseenter', enterHover);
    el.addEventListener('mouseleave', leaveHover);
  });

  document.body.classList.add('has-custom-cursor');
})();
