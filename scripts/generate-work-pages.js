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
  funProjects: "fun-projects.json",
  exhibitions: "exhibitions.json",
};

var PROJECT_KINDS = {
  installations: "installation",
  performance: "performance",
  sound: "sound",
  visual: "visual",
  writing: "writing",
  funProjects: "fun",
};

var FALLBACK_OG_IMAGE = "/assets/images/profile/atharva.jpeg";
var CREATOR_NAME = "Atharva Gupta";
var HOME_META_DESCRIPTION =
  "Atharva Gupta — new media artist and sculptor working with sound, technology, and spatial practice.";
var PERSON_KNOWS_ABOUT = [
  "New Media Art",
  "Sculpture",
  "Sound Art",
  "Installation Art",
  "Audiovisual Performance",
  "TouchDesigner",
];
var PERSON_HOME_LOCATION = "Groningen, Netherlands";
var MUSIC_GROUP_NAME = "asymmetrica";
var MUSIC_GROUP_GENRE = ["Experimental", "Electronic", "Sound Art"];

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

  var jsonLd = buildWorkJsonLd(entry, {
    title: title,
    metaDescription: metaDescription,
    canonical: canonical,
    ogImage: ogImage,
    category: category,
  });

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

function dedupeById(list) {
  var seen = Object.create(null);
  return (list || []).filter(function (item) {
    if (!item || !item.id || seen[item.id]) return false;
    seen[item.id] = true;
    return true;
  });
}

function groupByCategory(list) {
  var groups = {};
  (list || []).forEach(function (item) {
    var cat = item.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });
  return groups;
}

function sortByYoutubeDate(list) {
  return (list || []).slice().sort(function (a, b) {
    var dA = a.youtubeDate || "";
    var dB = b.youtubeDate || "";
    if (dB !== dA) return dB.localeCompare(dA);
    return (a.title || "").localeCompare(b.title || "");
  });
}

function sortVisualGroupsByYoutubeDate(groups) {
  var sorted = {};
  Object.keys(groups).forEach(function (cat) {
    if (cat === "TouchDesigner Tutorials") {
      sorted[cat] = sortByYoutubeDate(groups[cat] || []);
    } else {
      sorted[cat] = groups[cat] || [];
    }
  });
  return sorted;
}

function workPageHref(id) {
  return "./work/" + encodeURIComponent(id) + "/";
}

function readSameAsUrls() {
  return items(readJson("links.json"))
    .map(function (link) {
      return link && link.url ? String(link.url).trim() : "";
    })
    .filter(Boolean);
}

function readMusicGroupSameAs() {
  return readSameAsUrls().filter(function (url) {
    return (
      url.indexOf("asymmetrica.bandcamp.com") !== -1 ||
      url.indexOf("instagram.com/asymmetrica_") !== -1
    );
  });
}

function buildPersonNode(sameAs) {
  return {
    "@type": "Person",
    "@id": BASE_URL + "/#person",
    name: CREATOR_NAME,
    url: BASE_URL + "/about.html",
    image: BASE_URL + FALLBACK_OG_IMAGE,
    jobTitle: "New Media Artist",
    description:
      "Artist and researcher working with sound, technology, sculpture, and spatial practice.",
    knowsAbout: PERSON_KNOWS_ABOUT,
    homeLocation: {
      "@type": "Place",
      name: PERSON_HOME_LOCATION,
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Frank Mohr Institute, Minerva Academy",
      },
    ],
    sameAs: sameAs,
  };
}

function buildMusicGroupNode() {
  return {
    "@type": "MusicGroup",
    "@id": BASE_URL + "/#asymmetrica",
    name: MUSIC_GROUP_NAME,
    genre: MUSIC_GROUP_GENRE,
    sameAs: readMusicGroupSameAs(),
    member: { "@id": BASE_URL + "/#person" },
  };
}

function buildWorkJsonLd(entry, meta) {
  var item = entry.item;
  var kind = entry.kind;
  var jsonLd = {
    "@context": "https://schema.org",
    name: meta.title,
    description: meta.metaDescription,
    url: meta.canonical,
    image: meta.ogImage,
  };

  if (kind === "exhibition" || kind === "performance") {
    jsonLd["@type"] = "VisualArtsEvent";
    jsonLd.performer = { "@id": BASE_URL + "/#person" };
    var placeName = [item.venue, item.location].filter(Boolean).join(", ");
    if (placeName) {
      jsonLd.location = {
        "@type": "Place",
        name: placeName,
      };
    }
    return jsonLd;
  }

  if (kind === "visual" && item.category === "VISUAL RESEARCH") {
    jsonLd["@type"] = "VisualArtwork";
    jsonLd.creator = { "@id": BASE_URL + "/#person" };
    jsonLd.artform = "Digital art";
    jsonLd.artMedium = "Digital";
    return jsonLd;
  }

  if (kind === "installation") {
    jsonLd["@type"] = "VisualArtwork";
    jsonLd.creator = { "@id": BASE_URL + "/#person" };
    jsonLd.artform = "Installation";
    return jsonLd;
  }

  if (kind === "sound") {
    jsonLd["@type"] = "MusicRecording";
    jsonLd.byArtist = { "@id": BASE_URL + "/#asymmetrica" };
    return jsonLd;
  }

  if (kind === "writing") {
    jsonLd["@type"] = "Article";
    jsonLd.author = { "@id": BASE_URL + "/#person" };
    return jsonLd;
  }

  jsonLd["@type"] = "CreativeWork";
  jsonLd.creator = { "@id": BASE_URL + "/#person" };
  return jsonLd;
}

function buildHomeJsonLd(sameAs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": BASE_URL + "/#website",
        name: CREATOR_NAME,
        url: BASE_URL + "/",
        description: "Portfolio of Atharva Gupta, new media artist and sculptor.",
        author: { "@id": BASE_URL + "/#person" },
      },
      buildPersonNode(sameAs),
      buildMusicGroupNode(),
    ],
  });
}

function buildAboutJsonLd(sameAs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": BASE_URL + "/about.html#profilepage",
        url: BASE_URL + "/about.html",
        name: "About Atharva Gupta",
        description: "About Atharva Gupta, new media artist and sculptor.",
        mainEntity: { "@id": BASE_URL + "/#person" },
      },
      buildPersonNode(sameAs),
      buildMusicGroupNode(),
    ],
  });
}

function buildListSectionHtml(heading, listItems) {
  if (!listItems || listItems.length === 0) return "";
  var rows = listItems
    .map(function (item) {
      var title = item.title || "Untitled";
      return (
        '        <a class="work-list__item" href="' +
        escapeHtml(workPageHref(item.id)) +
        '">' +
        '<h3 class="work-list__title">' +
        escapeHtml(title) +
        "</h3></a>"
      );
    })
    .join("\n");
  return (
    '      <section class="work-list__group">\n' +
    '        <h2 class="work-list__group-label">' +
    escapeHtml(heading) +
    "</h2>\n" +
    rows +
    "\n      </section>"
  );
}

function buildHomeListHtml() {
  var installations = dedupeById(items(readJson(DATA_FILES.installations)));
  var performance = dedupeById(items(readJson(DATA_FILES.performance)));
  var visual = dedupeById(items(readJson(DATA_FILES.visual)));
  var sound = dedupeById(items(readJson(DATA_FILES.sound)));
  var funProjects = dedupeById(items(readJson(DATA_FILES.funProjects)));

  var worksItems = installations.concat(performance);
  var sections = [];

  if (worksItems.length) sections.push(buildListSectionHtml("Works", worksItems));
  if (sound.length) sections.push(buildListSectionHtml("Sound", sound));

  var visualGroups = sortVisualGroupsByYoutubeDate(groupByCategory(visual));
  Object.keys(visualGroups).forEach(function (cat) {
    if (cat === "VISUAL RESEARCH") return;
    sections.push(buildListSectionHtml(cat, visualGroups[cat]));
  });

  if (funProjects.length) sections.push(buildListSectionHtml("Fun Projects", funProjects));

  if (sections.length === 0) return "";
  return "    <div class=\"work-list\">\n" + sections.join("\n") + "\n    </div>";
}

function buildHomeIntroHtml(profile) {
  var home = (profile && profile.home) || {};
  var paragraphs = Array.isArray(home.seoIntro) ? home.seoIntro : [];
  if (paragraphs.length === 0 && profile && profile.about && profile.about.description) {
    paragraphs = [profile.about.description];
  }
  return paragraphs
    .map(function (text) {
      return "      <p>" + escapeHtml(String(text || "").trim()) + "</p>";
    })
    .join("\n");
}

function buildAboutContentHtml(profile) {
  var about = (profile && profile.about) || {};
  var description = about.description || "";
  return '        <p class="about__description">' + escapeHtml(description) + "</p>";
}

function buildFooterHtml() {
  var links = items(readJson("links.json"));
  var linkHtml = links
    .map(function (link) {
      return (
        '      <a href="' +
        escapeHtml(link.url || "#") +
        '" rel="noopener noreferrer">' +
        escapeHtml(link.name || "Link") +
        "</a>"
      );
    })
    .join("\n");
  return (
    '  <footer class="site-footer">\n' +
    '    <p class="site-footer__copy">Atharva Gupta © 2025</p>\n' +
    '    <nav class="site-footer__links" aria-label="External links">\n' +
    linkHtml +
    "\n    </nav>\n" +
    "  </footer>"
  );
}

function patchMarkers(filePath, replacements) {
  var html = fs.readFileSync(filePath, "utf8");
  Object.keys(replacements).forEach(function (marker) {
    var start = "<!-- GENERATE:" + marker + ":start -->";
    var end = "<!-- GENERATE:" + marker + ":end -->";
    var pattern = new RegExp(
      start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        "[\\s\\S]*?" +
        end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    var next =
      start + "\n" + replacements[marker] + "\n  " + end;
    if (!pattern.test(html)) {
      console.warn("Missing marker pair: " + marker + " in " + path.relative(root, filePath));
      return;
    }
    html = html.replace(pattern, next);
  });
  fs.writeFileSync(filePath, html, "utf8");
}

function patchHomeMetaDescriptions(html) {
  var escaped = escapeHtml(HOME_META_DESCRIPTION);
  return html
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      "$1" + escaped + "$2"
    )
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      "$1" + escaped + "$2"
    );
}

function writeHomePageSeo() {
  var profile = readJson("profile.json");
  var sameAs = readSameAsUrls();
  var indexPath = path.join(root, "index.html");
  patchMarkers(indexPath, {
    "home-jsonld":
      '  <script type="application/ld+json">' +
      buildHomeJsonLd(sameAs) +
      "</script>",
    "home-intro": buildHomeIntroHtml(profile),
    "home-list": buildHomeListHtml(),
    "home-footer": buildFooterHtml(),
  });
  var html = fs.readFileSync(indexPath, "utf8");
  fs.writeFileSync(indexPath, patchHomeMetaDescriptions(html), "utf8");
  console.log("Updated homepage SEO snapshot in index.html");
}

function writeAboutPageSeo() {
  var profile = readJson("profile.json");
  var sameAs = readSameAsUrls();
  patchMarkers(path.join(root, "about.html"), {
    "about-jsonld":
      '  <script type="application/ld+json">' +
      buildAboutJsonLd(sameAs) +
      "</script>",
    "about-content": buildAboutContentHtml(profile),
  });
  console.log("Updated about page SEO snapshot in about.html");
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
writeHomePageSeo();
writeAboutPageSeo();
