/**
 * generate-gallery-thumbs.js — 128px-max WebP thumbs for the visual research gallery canvas
 *
 * Sources: assets/images/visual (.webp preferred; skips raster when a .webp sibling exists)
 * Output:  assets/images/gallery-thumbs/visual/… (mirrors source paths)
 *
 * Usage:
 *   node scripts/generate-gallery-thumbs.js
 *   node scripts/generate-gallery-thumbs.js --dry-run
 *   node scripts/generate-gallery-thumbs.js --force
 */
"use strict";

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var visualRoot = path.join(root, "assets", "images", "visual");
var outputRoot = path.join(root, "assets", "images", "gallery-thumbs", "visual");

var dryRun = process.argv.includes("--dry-run");
var force = process.argv.includes("--force");

var RASTER_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff", ".webp"]);
var CONCURRENCY = 5;
var THUMB_SIZE = 128;
var THUMB_QUALITY = 76;

var stats = {
  scanned: 0,
  skipped: 0,
  converted: 0,
  errors: 0,
};

function ensureDir(dir) {
  if (dryRun) return;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeWriteFile(targetPath, writeFn) {
  if (dryRun) {
    console.log("[dry-run] would write " + path.relative(root, targetPath));
    return Promise.resolve();
  }
  return writeFn(targetPath).catch(function (err) {
    if (err && err.code === "EBUSY") {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          writeFn(targetPath).then(resolve).catch(reject);
        }, 120);
      });
    }
    throw err;
  });
}

function isRasterFile(filePath) {
  return RASTER_EXT.has(path.extname(filePath).toLowerCase());
}

function hasWebpSibling(filePath) {
  var parsed = path.parse(filePath);
  return fs.existsSync(path.join(parsed.dir, parsed.name + ".webp"));
}

function walkVisual(dir, results) {
  if (!fs.existsSync(dir)) return;
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(function (ent) {
    var full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkVisual(full, results);
      return;
    }
    if (!ent.isFile() || !isRasterFile(full)) return;
    var ext = path.extname(full).toLowerCase();
    if (ext !== ".webp" && hasWebpSibling(full)) return;
    results.push(full);
  });
}

function relFromVisual(absPath) {
  return path.relative(visualRoot, absPath).split(path.sep).join("/");
}

function thumbPathForSource(srcAbs) {
  var rel = relFromVisual(srcAbs);
  var parsed = path.posix.parse(rel);
  return path.join(outputRoot, parsed.dir, parsed.name + ".webp");
}

function isUpToDate(srcAbs, thumbAbs) {
  if (force) return false;
  try {
    var srcM = fs.statSync(srcAbs).mtimeMs;
    var thumbM = fs.statSync(thumbAbs).mtimeMs;
    return thumbM >= srcM;
  } catch (e) {
    return false;
  }
}

async function convertOne(sharp, srcAbs) {
  stats.scanned++;
  var thumbAbs = thumbPathForSource(srcAbs);

  if (isUpToDate(srcAbs, thumbAbs)) {
    stats.skipped++;
    return;
  }

  ensureDir(path.dirname(thumbAbs));

  if (dryRun) {
    console.log("[dry-run] thumb " + path.relative(root, srcAbs));
    stats.converted++;
    return;
  }

  try {
    await safeWriteFile(thumbAbs, function (tmp) {
      return sharp(srcAbs, { failOnError: false })
        .rotate()
        .resize(THUMB_SIZE, THUMB_SIZE, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: THUMB_QUALITY, effort: 4 })
        .toFile(tmp);
    });

    stats.converted++;
  } catch (err) {
    stats.errors++;
    console.warn("Error: " + path.relative(root, srcAbs) + " — " + err.message);
  }
}

async function runPool(sharp, files) {
  var i = 0;
  var workers = [];

  function next() {
    if (i >= files.length) return Promise.resolve();
    var idx = i++;
    return convertOne(sharp, files[idx]).then(next);
  }

  for (var w = 0; w < CONCURRENCY; w++) {
    workers.push(next());
  }
  await Promise.all(workers);
}

async function main() {
  var sharp;
  try {
    sharp = require("sharp");
  } catch (e) {
    console.error("Missing sharp. Run: npm install");
    process.exit(1);
  }

  if (!fs.existsSync(visualRoot)) {
    console.error("Missing " + path.relative(root, visualRoot));
    process.exit(1);
  }

  console.log(
    (dryRun ? "DRY RUN — " : "") +
      "Gallery thumbs (max " +
      THUMB_SIZE +
      "px) from " +
      path.relative(root, visualRoot) +
      " …\n"
  );

  var sources = [];
  walkVisual(visualRoot, sources);
  console.log("Found " + sources.length + " visual sources\n");

  await runPool(sharp, sources);

  console.log("\n--- Summary ---");
  console.log("Scanned:   " + stats.scanned);
  console.log("Converted: " + stats.converted);
  console.log("Skipped:   " + stats.skipped + " (up to date)");
  console.log("Errors:    " + stats.errors);
  console.log("Output:    " + path.relative(root, outputRoot) + "/");
  if (stats.errors) process.exit(1);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
