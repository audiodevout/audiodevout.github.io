/**
 * Reorganize assets/images into category/item-id folders and update data/*.json paths.
 * Archives unreferenced files to assets/images/_archive/.
 *
 * Usage:
 *   node scripts/organize-assets.js --dry-run
 *   node scripts/organize-assets.js
 */
"use strict";

var fs = require("fs");
var path = require("path");
var { execSync } = require("child_process");

var root = path.join(__dirname, "..");
var imagesRoot = path.join(root, "assets", "images");
var archiveRoot = path.join(imagesRoot, "_archive");
var dryRun = process.argv.includes("--dry-run");

var DATA_FILES = {
  profile: { file: "profile.json", category: "profile" },
  installations: { file: "installations.json", category: "installations" },
  performance: { file: "performance.json", category: "performance" },
  visual: { file: "visual.json", category: "visual" },
  exhibitions: { file: "exhibitions.json", category: "exhibitions" },
};

function normalizeAssetPath(p) {
  if (typeof p !== "string") return null;
  var s = p.replace(/^\.\//, "");
  if (!s.startsWith("assets/images/")) return null;
  return s;
}

function toPublicPath(relativePath) {
  return "./" + relativePath.replace(/\\/g, "/");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    if (dryRun) return;
    fs.mkdirSync(dir, { recursive: true });
  }
}

function gitTrackedImages() {
  var out = execSync('git ls-files "assets/images"', { cwd: root, encoding: "utf8" });
  return out
    .trim()
    .split(/\r?\n/)
    .filter(function (line) {
      return line && !line.startsWith("assets/images/_archive/");
    });
}

function resolveSourcePath(relativePath) {
  var abs = path.join(root, relativePath.replace(/\//g, path.sep));
  if (fs.existsSync(abs)) return abs;

  // Case-insensitive fallback on Windows
  var parts = relativePath.split("/");
  var dir = path.join(root, parts.slice(0, -1).join(path.sep));
  var base = parts[parts.length - 1];
  if (!fs.existsSync(dir)) return null;
  var match = fs.readdirSync(dir).find(function (name) {
    return name.toLowerCase() === base.toLowerCase();
  });
  return match ? path.join(dir, match) : null;
}

function uniqueArchiveName(filename) {
  var target = path.join(archiveRoot, filename);
  if (!fs.existsSync(target)) return filename;
  var ext = path.extname(filename);
  var base = path.basename(filename, ext);
  var n = 1;
  while (fs.existsSync(path.join(archiveRoot, base + "-" + n + ext))) n++;
  return base + "-" + n + ext;
}

function buildMoveMap() {
  /** @type {Map<string, {destRel:string, category:string, itemId:string}>} */
  var moveMap = new Map();
  /** @type {Map<string, string>} old public path -> new public path */
  var pathRewrites = new Map();

  Object.keys(DATA_FILES).forEach(function (key) {
    var meta = DATA_FILES[key];
    var filePath = path.join(root, "data", meta.file);
    var data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (key === "profile") {
      var profileImage = data.about && data.about.image;
      var profileNorm = normalizeAssetPath(profileImage);
      if (profileNorm) {
        var profileDest = "assets/images/profile/" + path.posix.basename(profileNorm);
        moveMap.set(profileNorm, {
          destRel: profileDest,
          category: "profile",
          itemId: "profile",
        });
        pathRewrites.set(profileImage, toPublicPath(profileDest));
      }
      return;
    }

    (data.items || []).forEach(function (item) {
      if (!item || !item.id) return;
      (item.images || []).forEach(function (imgPath) {
        var norm = normalizeAssetPath(imgPath);
        if (!norm) return;

        var basename = path.posix.basename(norm);
        var destRel =
          "assets/images/" + meta.category + "/" + item.id + "/" + basename;

        // First claim wins for shared images (canonical home = first JSON encounter)
        if (!moveMap.has(norm)) {
          moveMap.set(norm, {
            destRel: destRel,
            category: meta.category,
            itemId: item.id,
          });
        }

        var canonical = moveMap.get(norm).destRel;
        pathRewrites.set(imgPath, toPublicPath(canonical));
      });
    });
  });

  return { moveMap: moveMap, pathRewrites: pathRewrites };
}

function rewriteJsonPaths(pathRewrites) {
  Object.keys(DATA_FILES).forEach(function (key) {
    var meta = DATA_FILES[key];
    var filePath = path.join(root, "data", meta.file);
    var raw = fs.readFileSync(filePath, "utf8");
    var updated = raw;

    pathRewrites.forEach(function (newPath, oldPath) {
      if (updated.indexOf(oldPath) === -1) return;
      updated = updated.split(oldPath).join(newPath);
    });

    if (updated !== raw) {
      if (dryRun) {
        console.log("[dry-run] Would update " + path.relative(root, filePath));
      } else {
        fs.writeFileSync(filePath, updated, "utf8");
        console.log("Updated " + path.relative(root, filePath));
      }
    }
  });
}

function moveFile(srcAbs, destRel) {
  var destAbs = path.join(root, destRel.replace(/\//g, path.sep));
  ensureDir(path.dirname(destAbs));

  if (dryRun) {
    console.log("[dry-run] MOVE " + path.relative(root, srcAbs) + " -> " + destRel);
    return;
  }

  if (fs.existsSync(destAbs)) {
    if (path.resolve(srcAbs) === path.resolve(destAbs)) return;
    throw new Error("Destination already exists: " + destRel);
  }

  fs.renameSync(srcAbs, destAbs);
  console.log("Moved " + path.relative(root, srcAbs) + " -> " + destRel);
}

function runMoves(moveMap, tracked) {
  var movedSources = new Set();
  var errors = [];

  moveMap.forEach(function (entry, sourceRel) {
    var srcAbs = resolveSourcePath(sourceRel);
    if (!srcAbs) {
      errors.push("Missing source for referenced image: " + sourceRel);
      return;
    }
    moveFile(srcAbs, entry.destRel);
    movedSources.add(sourceRel.replace(/\\/g, "/").toLowerCase());
  });

  // Archive orphans still on disk under assets/images (excluding _archive)
  tracked.forEach(function (rel) {
    var norm = rel.replace(/\\/g, "/");
    if (norm.startsWith("assets/images/_archive/")) return;
    if (norm.startsWith("assets/images/np3_rearrange/")) {
      // leftover empty dirs handled below; files should have been moved via map
    }

    var srcAbs = path.join(root, rel.replace(/\//g, path.sep));
    if (!fs.existsSync(srcAbs)) return;

    // Skip if already moved to nested destination
    var alreadyNested =
      norm.indexOf("/profile/") !== -1 ||
      norm.indexOf("/installations/") !== -1 ||
      norm.indexOf("/performance/") !== -1 ||
      norm.indexOf("/visual/") !== -1 ||
      norm.indexOf("/exhibitions/") !== -1;
    if (alreadyNested) return;

    var isReferenced = false;
    moveMap.forEach(function (entry, sourceRel) {
      if (sourceRel.replace(/\\/g, "/").toLowerCase() === norm.toLowerCase()) {
        isReferenced = true;
      }
    });
    if (isReferenced) return;

    var archiveName = uniqueArchiveName(path.basename(norm));
    var archiveRel = "assets/images/_archive/" + archiveName;
    moveFile(srcAbs, archiveRel);
  });

  return errors;
}

function validateReferences() {
  var missing = [];
  function walk(val) {
    if (typeof val === "string") {
      var norm = normalizeAssetPath(val);
      if (norm && !fs.existsSync(path.join(root, norm.replace(/\//g, path.sep)))) {
        missing.push(val);
      }
    } else if (Array.isArray(val)) {
      val.forEach(walk);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(walk);
    }
  }

  Object.keys(DATA_FILES).forEach(function (key) {
    var data = JSON.parse(
      fs.readFileSync(path.join(root, "data", DATA_FILES[key].file), "utf8")
    );
    walk(data);
  });

  return missing;
}

function cleanupEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(function (name) {
    if (name === "_archive") return;
    var full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) cleanupEmptyDirs(full);
  });
  if (dir === imagesRoot) return;
  if (fs.readdirSync(dir).length === 0 && !dryRun) {
    fs.rmdirSync(dir);
  }
}

function main() {
  console.log(dryRun ? "DRY RUN — no files will be changed\n" : "Organizing assets/images...\n");

  var tracked = gitTrackedImages();
  console.log("Tracked images (excl. _archive): " + tracked.length);

  var built = buildMoveMap();
  console.log("Referenced images to organize: " + built.moveMap.size);
  console.log("Path rewrites: " + built.pathRewrites.size + "\n");

  var moveErrors = runMoves(built.moveMap, tracked);
  rewriteJsonPaths(built.pathRewrites);

  if (!dryRun) {
    cleanupEmptyDirs(path.join(imagesRoot, "np3_rearrange"));
    cleanupEmptyDirs(imagesRoot);
  }

  var missing = dryRun ? [] : validateReferences();
  var archiveCount = dryRun
    ? tracked.filter(function (rel) {
        var norm = rel.replace(/\\/g, "/");
        if (norm.startsWith("assets/images/_archive/")) return false;
        if (norm.startsWith("assets/images/np3_rearrange/")) return false;
        var nested =
          norm.indexOf("/profile/") !== -1 ||
          norm.indexOf("/installations/") !== -1 ||
          norm.indexOf("/performance/") !== -1 ||
          norm.indexOf("/visual/") !== -1 ||
          norm.indexOf("/exhibitions/") !== -1;
        if (nested) return false;
        return !built.moveMap.has(norm);
      }).length
    : fs.existsSync(archiveRoot)
      ? fs.readdirSync(archiveRoot).length
      : 0;

  console.log("\n--- Summary ---");
  console.log("Organized (referenced): " + built.moveMap.size);
  console.log("Archived (orphans): " + archiveCount);
  console.log("Missing after migration: " + missing.length);

  if (moveErrors.length) {
    console.log("\nErrors:");
    moveErrors.forEach(function (e) {
      console.log("  " + e);
    });
  }
  if (missing.length) {
    console.log("\nMissing references:");
    missing.slice(0, 20).forEach(function (m) {
      console.log("  " + m);
    });
    process.exit(1);
  }

  if (moveErrors.length) process.exit(1);
  console.log("\nDone.");
}

main();
