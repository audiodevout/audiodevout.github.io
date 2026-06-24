"use strict";

const QRCode = require("qrcode");

function qrGenerate(ip, port) {
  const url = `http://${ip}:${port}`;
  return QRCode.toString(url, { type: "terminal" });
}

if (require.main === module) {
  const ip = process.argv[2] || "unknown";
  const port = process.argv[3] || "3000";

  qrGenerate(ip, port)
    .then((terminal) => {
      console.log("\n" + terminal + "\n");
    })
    .catch((err) => {
      console.error("[QR] Error:", err.message);
      process.exit(1);
    });
} else {
  module.exports = { qrGenerate };
}
