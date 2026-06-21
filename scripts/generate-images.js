/**
 * generate-images.js — WebP + thumb generation for assets/images
 *
 * After Decap CMS uploads, run: npm run generate-images:rewrite
 *
 * Usage:
 *   node scripts/generate-images.js              # generate missing/stale outputs
 *   node scripts/generate-images.js --rewrite  # + update data/*.json + rebuild parts
 *   node scripts/generate-images.js --dry-run
 *   node scripts/generate-images.js --force    # ignore mtime, regenerate all
 */
"use strict";

var fs = require("fs");
var path = require("path");
var { execSync } = require("child_process");

var root = path.join(__dirname, "..");
var imagesRoot = path.join(root, "assets", "images");
var thumbsRoot = path.join(imagesRoot, "thumbs");
var dataDir = path.join(root, "data");

var dryRun = process.argv.includes("--dry-run");
var force = process.argv.includes("--force");
var rewrite = process.argv.includes("--rewrite");

var RASTER_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff"]);
var CONCURRENCY = 5;
var THUMB_SIZE = 96;
var THUMB_QUALITY = 74;

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

function walkImages(dir, results) {
  if (!fs.existsSync(dir)) return;
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(function (ent) {
    var full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "thumbs") return;
      walkImages(full, results);
      return;
    }
    if (!ent.isFile() || !isRasterFile(full)) return;
    results.push(full);
  });
}

function relFromImages(absPath) {
  return path.relative(imagesRoot, absPath).split(path.sep).join("/");
}

function webpPathForSource(srcAbs) {
  var rel = relFromImages(srcAbs);
  var parsed = path.posix.parse(rel);
  return path.join(imagesRoot, parsed.dir, parsed.name + ".webp");
}

function thumbPathForSource(srcAbs) {
  var rel = relFromImages(srcAbs);
  var parsed = path.posix.parse(rel);
  return path.join(thumbsRoot, parsed.dir, parsed.name + ".webp");
}

function isUpToDate(srcAbs, webpAbs, thumbAbs) {
  if (force) return false;
  try {
    var srcM = fs.statSync(srcAbs).mtimeMs;
    var webpM = fs.statSync(webpAbs).mtimeMs;
    var thumbM = fs.statSync(thumbAbs).mtimeMs;
    return webpM >= srcM && thumbM >= srcM;
  } catch (e) {
    return false;
  }
}

function qualityFor(meta, ext) {
  var q = 82;
  if (meta.width > 2000) q = 85;
  else if (ext === ".png") q = 85;
  if (ext === ".png" && meta.width && meta.width < 400 && meta.height && meta.height < 400) {
    q = 88;
  }
  return q;
}

async function convertOne(sharp, srcAbs) {
  stats.scanned++;
  var webpAbs = webpPathForSource(srcAbs);
  var thumbAbs = thumbPathForSource(srcAbs);

  if (isUpToDate(srcAbs, webpAbs, thumbAbs)) {
    stats.skipped++;
    return;
  }

  ensureDir(path.dirname(webpAbs));
  ensureDir(path.dirname(thumbAbs));

  if (dryRun) {
    console.log("[dry-run] convert " + path.relative(root, srcAbs));
    stats.converted++;
    return;
  }

  try {
    var meta = await sharp(srcAbs, { failOnError: false }).metadata();
    var ext = path.extname(srcAbs).toLowerCase();
    var q = qualityFor(meta, ext);

    await safeWriteFile(webpAbs, function (tmp) {
      return sharp(srcAbs, { failOnError: false })
        .rotate()
        .webp({ quality: q, effort: 4, smartSubsample: true, alphaQuality: 90 })
        .toFile(tmp);
    });

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

function rewriteJsonPaths() {
  var files = fs.readdirSync(dataDir).filter(function (f) {
    return f.endsWith(".json");
  });
  var re = /\.(jpe?g|png)(\?[^"']*)?/gi;

  files.forEach(function (file) {
    var filePath = path.join(dataDir, file);
    var raw = fs.readFileSync(filePath, "utf8");
    var updated = raw.replace(re, function (_match, _ext, qs) {
      return ".webp" + (qs || "");
    });
    if (updated !== raw) {
      if (dryRun) {
        console.log("[dry-run] would update " + file);
      } else {
        fs.writeFileSync(filePath, updated, "utf8");
        console.log("Updated " + file);
      }
    }
  });
}

function rebuildParts() {
  if (dryRun) {
    console.log("[dry-run] would run build-portfolio-data.js");
    return;
  }
  execSync("node scripts/build-portfolio-data.js", { cwd: root, stdio: "inherit" });
}

async function main() {
  var sharp;
  try {
    sharp = require("sharp");
  } catch (e) {
    console.error("Missing sharp. Run: npm install");
    process.exit(1);
  }

  console.log(
    (dryRun ? "DRY RUN — " : "") +
      "Scanning " +
      path.relative(root, imagesRoot) +
      " …\n"
  );

  var sources = [];
  walkImages(imagesRoot, sources);
  console.log("Found " + sources.length + " raster sources\n");

  await runPool(sharp, sources);

  if (rewrite) {
    console.log("\nRewriting data/*.json image paths to .webp …");
    rewriteJsonPaths();
    console.log("Rebuilding portfolioData.parts.js …");
    rebuildParts();
  }

  console.log("\n--- Summary ---");
  console.log("Scanned:   " + stats.scanned);
  console.log("Converted: " + stats.converted);
  console.log("Skipped:   " + stats.skipped + " (up to date)");
  console.log("Errors:    " + stats.errors);
  if (stats.errors) process.exit(1);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
