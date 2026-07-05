/**
 * Generates static work/<id>/index.html pages, sitemap.xml, and robots.txt.
 *
 * Run after CMS edits (with build-data):
 *   npm run build
 *
 * Or individually:
 *   npm run generate-work-pages
 */
"use strict";

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var dataDir = path.join(root, "data");
var workDir = path.join(root, "work");
var templatePath = path.join(workDir, "_template.html");

var DATA_FILES = {
  sound: "sound.json",
  performance: "performance.json",
  installations: "installations.json",
  visual: "visual.json",
  writing: "writing.json",
  exhibitions: "exhibitions.json",
};

var PROJECT_KINDS = {
  installations: "installation",
  performance: "performance",
  sound: "sound",
  visual: "visual",
  writing: "writing",
};

var FALLBACK_OG_IMAGE = "/assets/images/profile/atharva.jpeg";
var CREATOR_NAME = "Atharva Gupta";

function readCnameBase() {
  var cnamePath = path.join(root, "CNAME");
  if (!fs.existsSync(cnamePath)) return "https://atharvagupta.net";
  var host = fs.readFileSync(cnamePath, "utf8").trim();
  return "https://" + host.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, filename), "utf8"));
}

function items(obj) {
  return obj && Array.isArray(obj.items) ? obj.items : [];
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(text, maxLen) {
  var s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1).trim() + "…";
}

function normalizeAssetPath(src) {
  if (!src) return "";
  var s = String(src).trim();
  if (s.indexOf("./") === 0) s = s.slice(2);
  if (s.indexOf("/") === 0) s = s.slice(1);
  return s;
}

function absoluteAssetUrl(base, src) {
  var normalized = normalizeAssetPath(src);
  if (!normalized) return base + FALLBACK_OG_IMAGE;
  return base + "/" + normalized;
}

function relativeAssetFromWorkPage(src) {
  var normalized = normalizeAssetPath(src);
  if (!normalized) return "";
  return "../../" + normalized;
}

function buildMediaStackHtml(item, title) {
  var images = Array.isArray(item.images) ? item.images : [];
  if (images.length === 0) return "";
  return images
    .map(function (src, index) {
      return (
        '<figure class="work-page__figure work-page__figure--image">' +
        '<img src="' +
        escapeHtml(relativeAssetFromWorkPage(src)) +
        '" alt="' +
        escapeHtml(title) +
        '" loading="' +
        (index === 0 ? "eager" : "lazy") +
        '" decoding="async" />' +
        "</figure>"
      );
    })
    .join("\n        ");
}

function collectWorkItems() {
  var collected = [];
  var seen = Object.create(null);

  Object.keys(DATA_FILES).forEach(function (key) {
    if (key === "exhibitions") return;
    var list = items(readJson(DATA_FILES[key]));
    var kind = PROJECT_KINDS[key] || key;
    list.forEach(function (item) {
      if (!item || !item.id || seen[item.id]) return;
      if (item.urls && item.urls.page) return;
      seen[item.id] = true;
      collected.push({ item: item, kind: kind });
    });
  });

  items(readJson(DATA_FILES.exhibitions)).forEach(function (item) {
    if (!item || !item.id || seen[item.id]) return;
    if (item.urls && item.urls.page) return;
    seen[item.id] = true;
    collected.push({ item: item, kind: "exhibition" });
  });

  return collected;
}

function pageMeta(entry) {
  var item = entry.item;
  var kind = entry.kind;
  var title = item.title || "Untitled";
  var category = kind === "exhibition" ? (item.role || "") : (item.category || "");
  var description = item.fullDescription || item.description || "";
  var metaDescription = truncate(description || title, 160);
  var pageTitle = truncate(title, 55) + " — " + CREATOR_NAME;

  var firstImage = Array.isArray(item.images) && item.images.length ? item.images[0] : "";
  var ogImage = absoluteAssetUrl(BASE_URL, firstImage || FALLBACK_OG_IMAGE);
  var canonical = BASE_URL + "/work/" + encodeURIComponent(item.id) + "/";

  var metaParts = [];
  if (kind === "exhibition") {
    if (item.date) metaParts.push(item.date);
    if (item.venue) metaParts.push(item.venue);
    if (item.location) metaParts.push(item.location);
  }
  var metaHtml = metaParts.length
    ? '<p class="work-page__meta">' + escapeHtml(metaParts.join(" · ")) + "</p>"
    : "";

  var heroHtml = "";
  if (firstImage) {
    heroHtml =
      '<figure class="work-page__hero">' +
      '<img src="' +
      escapeHtml(relativeAssetFromWorkPage(firstImage)) +
      '" alt="' +
      escapeHtml(title) +
      '" width="1200" height="800" loading="eager" decoding="async" />' +
      "</figure>";
  }

  var mediaStackHtml = buildMediaStackHtml(item, title);

  var categoryHtml = category
    ? '<p class="work-page__category">' + escapeHtml(category) + "</p>"
    : "";

  var jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: metaDescription,
    url: canonical,
    image: ogImage,
    creator: {
      "@type": "Person",
      name: CREATOR_NAME,
      url: BASE_URL + "/",
    },
  };

  return {
    id: item.id,
    title: title,
    category: category,
    description: description,
    metaDescription: metaDescription,
    pageTitle: pageTitle,
    canonical: canonical,
    ogImage: ogImage,
    metaHtml: metaHtml,
    categoryHtml: categoryHtml,
    heroHtml: heroHtml,
    mediaStackHtml: mediaStackHtml,
    jsonLd: JSON.stringify(jsonLd),
  };
}

function renderPage(meta, template) {
  return template
    .replace(/\{\{ID\}\}/g, escapeHtml(meta.id))
    .replace(/\{\{TITLE\}\}/g, escapeHtml(meta.title))
    .replace(/\{\{CATEGORY\}\}/g, escapeHtml(meta.category))
    .replace(/\{\{CATEGORY_HTML\}\}/g, meta.categoryHtml)
    .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(meta.description))
    .replace(/\{\{META_DESCRIPTION\}\}/g, escapeHtml(meta.metaDescription))
    .replace(/\{\{PAGE_TITLE\}\}/g, escapeHtml(meta.pageTitle))
    .replace(/\{\{CANONICAL_URL\}\}/g, escapeHtml(meta.canonical))
    .replace(/\{\{OG_IMAGE\}\}/g, escapeHtml(meta.ogImage))
    .replace(/\{\{META_HTML\}\}/g, meta.metaHtml)
    .replace(/\{\{HERO_HTML\}\}/g, meta.heroHtml)
    .replace(/\{\{MEDIA_STACK_HTML\}\}/g, meta.mediaStackHtml)
    .replace(/\{\{JSON_LD\}\}/g, meta.jsonLd);
}

function writeWorkPages(entries, template) {
  var ids = Object.create(null);
  entries.forEach(function (entry) {
    var meta = pageMeta(entry);
    ids[meta.id] = true;
    var outDir = path.join(workDir, meta.id);
    fs.mkdirSync(outDir, { recursive: true });
    var outFile = path.join(outDir, "index.html");
    fs.writeFileSync(outFile, renderPage(meta, template), "utf8");
  });

  if (fs.existsSync(workDir)) {
    fs.readdirSync(workDir).forEach(function (name) {
      if (name.charAt(0) === "_" || name === "work-page.css") return;
      if (!ids[name]) {
        var staleDir = path.join(workDir, name);
        if (fs.statSync(staleDir).isDirectory()) {
          fs.rmSync(staleDir, { recursive: true, force: true });
          console.log("Removed stale " + path.relative(root, staleDir));
        }
      }
    });
  }

  return Object.keys(ids);
}

function writeSitemap(workIds) {
  var staticPages = [
    BASE_URL + "/",
    BASE_URL + "/gallery.html",
    BASE_URL + "/exhibitions.html",
    BASE_URL + "/archive.html",
    BASE_URL + "/about.html",
    BASE_URL + "/thesis/",
  ];

  var urls = staticPages.concat(
    workIds.map(function (id) {
      return BASE_URL + "/work/" + encodeURIComponent(id) + "/";
    })
  );

  var body = urls
    .map(function (loc) {
      return "  <url>\n    <loc>" + escapeHtml(loc) + "</loc>\n  </url>";
    })
    .join("\n");

  var xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    "\n</urlset>\n";

  fs.writeFileSync(path.join(root, "sitemap.xml"), xml, "utf8");
  console.log("Wrote sitemap.xml (" + urls.length + " URLs)");
}

function writeRobots() {
  var txt =
    "User-agent: *\n" +
    "Disallow: /admin/\n" +
    "Disallow: /portfolio/\n\n" +
    "Sitemap: " +
    BASE_URL +
    "/sitemap.xml\n";
  fs.writeFileSync(path.join(root, "robots.txt"), txt, "utf8");
  console.log("Wrote robots.txt");
}

var BASE_URL = readCnameBase();

if (!fs.existsSync(templatePath)) {
  console.error("Missing template: " + templatePath);
  process.exit(1);
}

var template = fs.readFileSync(templatePath, "utf8");
var entries = collectWorkItems();
var workIds = writeWorkPages(entries, template);

console.log("Wrote " + workIds.length + " work pages under work/");
writeSitemap(workIds);
writeRobots();
