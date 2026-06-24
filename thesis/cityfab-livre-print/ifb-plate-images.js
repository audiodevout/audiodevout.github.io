/**
 * Mark landscape plate photos for ±90° rotation (see ifb-plates.css).
 * Run after images load and whenever Paged.js lays out a page.
 */
window.ifbMarkPlateLandscapeImages = function ifbMarkPlateLandscapeImages(root) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll(".ifb-plate-droite img").forEach(function (img) {
    function apply() {
      var w = img.naturalWidth;
      var h = img.naturalHeight;
      if (!w || !h) return;
      if (w > h) {
        img.classList.add("ifb-plate-img--landscape-rot");
      } else {
        img.classList.remove("ifb-plate-img--landscape-rot");
      }
    }
    if (img.complete && img.naturalWidth > 0) {
      apply();
    } else {
      img.addEventListener("load", apply, { once: true });
    }
  });
}
