/**
 * Fix possessive apostrophes mangled to hyphen in Word exports (bachelor-s → bachelor's).
 * Soft-hyphen / joiner stripping runs from book.html (ifbStripTextArtifactsFromRoot).
 */
(function () {
  var POSSESSIVE_HYPHEN = /\b([a-z]{3,})-s\b/gi;

  function fixPossessiveApostrophesInRoot(root) {
    if (!root || !root.ownerDocument) return;
    var skip = /^(script|style)$/i;
    var w = root.ownerDocument.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null
    );
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentElement;
      if (!p || skip.test(p.tagName)) continue;
      var t = n.textContent;
      var fixed = t.replace(POSSESSIVE_HYPHEN, "$1's");
      if (fixed !== t) n.textContent = fixed;
    }
  }

  window.ifbFixPossessiveApostrophesInRoot = fixPossessiveApostrophesInRoot;
})();
