/**
 * make-collage-cutouts.js — builds the "difference" collage assets.
 * Run: node scripts/make-collage-cutouts.js
 * Output: assets/images/collage/*.webp (1400px wide)
 *
 *   sculpt1/4/6/7/9   — sculpture cut-outs: black ground keyed to alpha,
 *                       body lifted slightly so it stays solid under difference
 *   strands / webs    — plain greyscale textures (no alpha)
 */
"use strict";

var fs = require("fs");
var path = require("path");
var sharp = require("sharp");

var root = path.join(__dirname, "..");
var outDir = path.join(root, "assets", "images", "collage");
var WIDTH = 1400;
var QUALITY = 78; // per-job `q` overrides keep each file under ~300 KB

var JOBS = [
  { out: "sculpt1", src: "assets/images/visual/abstract-sculpture-series/abstract_sculpture_series.1", cutout: true, q: 66 },
  { out: "sculpt6", src: "assets/images/visual/abstract-sculpture-series/abstract_sculpture_series.6", cutout: true },
  { out: "sculpt4", src: "assets/images/visual/abstract-sculpture-series/abstract_sculpture_series.4", cutout: true },
  { out: "sculpt7", src: "assets/images/visual/abstract-sculpture-series/abstract_sculpture_series.7", cutout: true },
  { out: "sculpt9", src: "assets/images/visual/abstract-sculpture-series/abstract_sculpture_series.9", cutout: true },
  { out: "strands", src: "assets/images/installations/noise-sculpting/noise-sculpting-07" },
  { out: "webs", src: "assets/images/installations/noise-sculpting/noise-sculpting-26", q: 70 },
];

function findSource(base) {
  var exts = [".webp", ".png", ".jpg", ".jpeg"];
  for (var i = 0; i < exts.length; i++) {
    var abs = path.join(root, (base + exts[i]).replace(/\//g, path.sep));
    if (fs.existsSync(abs)) return abs;
  }
  throw new Error("Source not found: " + base + ".(webp|png|jpg)");
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function makeCutout(abs, dest, q) {
  return sharp(abs)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(function (res) {
      var info = res.info;
      var src = res.data;
      var ch = info.channels;
      var px = info.width * info.height;
      var out = Buffer.alloc(px * 2);
      for (var i = 0; i < px; i++) {
        var L = src[i * ch] / 255;
        out[i * 2] = Math.round(clamp01(L * 1.25) * 255);
        out[i * 2 + 1] = Math.round(clamp01((L - 0.015) / 0.08) * 255);
      }
      return sharp(out, { raw: { width: info.width, height: info.height, channels: 2 } })
        .webp({ quality: q, alphaQuality: 90, effort: 6 })
        .toFile(dest);
    });
}

function makeGrey(abs, dest, q) {
  return sharp(abs)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .greyscale()
    .webp({ quality: q, effort: 6 })
    .toFile(dest);
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  return JOBS.reduce(function (p, job) {
    return p.then(function () {
      var abs = findSource(job.src);
      var dest = path.join(outDir, job.out + ".webp");
      var q = job.q || QUALITY;
      return (job.cutout ? makeCutout(abs, dest, q) : makeGrey(abs, dest, q)).then(function (info) {
        console.log(
          "Wrote " + path.relative(root, dest) + " " + info.width + "x" + info.height +
          " " + Math.round(fs.statSync(dest).size / 1024) + " KB"
        );
      });
    });
  }, Promise.resolve()).catch(function (err) {
    console.error(err);
    process.exit(1);
  });
}

main();
