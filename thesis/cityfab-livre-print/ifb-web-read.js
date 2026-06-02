/**
 * IFB web reading — lightweight init without Paged.js.
 */
(function () {
  var STRIP_RE = /[\u00AD\u200B-\u200D\u2060\uFEFF\uFFFE\uFFFF]/g;

  function stripArtifacts(root) {
    if (!root || !root.ownerDocument) return;
    var skip = /^(script|style)$/i;
    var w = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentElement;
      if (!p || skip.test(p.tagName)) continue;
      var cleaned = n.textContent.replace(STRIP_RE, "");
      if (cleaned !== n.textContent) n.textContent = cleaned;
    }
  }

  function sweepEmptyPlates(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(".ifb-plate-droite").forEach(function (plate) {
      var imgs = plate.querySelectorAll("img");
      if (!imgs.length) {
        plate.remove();
        return;
      }
      var allDone = true;
      var anyGood = false;
      for (var i = 0; i < imgs.length; i++) {
        var im = imgs[i];
        if (!im.complete) {
          allDone = false;
          break;
        }
        if (im.naturalWidth > 0 && im.naturalHeight > 0) anyGood = true;
      }
      if (allDone && !anyGood) plate.remove();
    });
  }

  function init() {
    var root = document.body;
    stripArtifacts(root);
    if (typeof ifbFixPossessiveApostrophesInRoot === "function") {
      ifbFixPossessiveApostrophesInRoot(root);
    }
    if (typeof ifbMarkPlateLandscapeImages === "function") {
      ifbMarkPlateLandscapeImages(root);
    }
    sweepEmptyPlates(root);
    if (typeof ifbInitAuthorQRCodes === "function") {
      ifbInitAuthorQRCodes(root);
    } else if (typeof ifbInitAuthorQRCodesOnPages === "function") {
      ifbInitAuthorQRCodesOnPages([root]);
    }
    document.documentElement.classList.add("ifb-web-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", function () {
    if (typeof ifbMarkPlateLandscapeImages === "function") {
      ifbMarkPlateLandscapeImages(document.body);
    }
    sweepEmptyPlates(document.body);
  });
})();
