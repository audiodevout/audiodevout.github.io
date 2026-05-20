/**
 * QR codes for .ifb-author-qr hosts (qrcodejs).
 * qrcodejs paints to canvas then swaps to <img> — keep the img, hide canvas/table.
 * Call on each .pagedjs_page (Paged.js clones back matter out of the source flow).
 */
function ifbInitAuthorQRCodes(root) {
  if (typeof QRCode === "undefined") return;
  var scope = root || document;
  var dark = document.documentElement.classList.contains("ifb-print-root--dark");
  var darkColor = dark ? "#e4e4e4" : "#000000";
  var lightColor = dark ? "#000000" : "#ffffff";
  var px = 160;

  scope.querySelectorAll(".ifb-author-qr[data-ifb-qr-url]").forEach(function (host) {
    if (host.dataset.ifbQrReady) return;
    var url = host.getAttribute("data-ifb-qr-url");
    if (!url) return;

    host.dataset.ifbQrReady = "1";
    host.innerHTML = "";
    host.removeAttribute("title");

    /* eslint-disable no-new */
    new QRCode(host, {
      text: url,
      width: px,
      height: px,
      colorDark: darkColor,
      colorLight: lightColor,
      correctLevel: QRCode.CorrectLevel.M,
    });

    function showQrImage() {
      var table = host.querySelector("table");
      if (table) table.remove();

      var canvas = host.querySelector("canvas");
      if (canvas) canvas.style.display = "none";

      var img = host.querySelector("img");
      if (img) {
        img.style.display = "block";
        img.style.width = "17mm";
        img.style.height = "17mm";
        img.alt = "";
      }

      host.removeAttribute("title");
    }

    /* makeCode → makeImage is async; one frame is not always enough */
    requestAnimationFrame(function () {
      requestAnimationFrame(showQrImage);
    });
    setTimeout(showQrImage, 50);
  });
}

function ifbInitAuthorQRCodesOnPages(pages) {
  if (!pages || !pages.length) {
    ifbInitAuthorQRCodes(document.body);
    return;
  }
  pages.forEach(function (page) {
    var el = page.element || page;
    if (el && el.querySelectorAll) ifbInitAuthorQRCodes(el);
  });
}
