/**
 * verify-work-pages.js — sanity checks for work page build + wiring
 * Run: node scripts/verify-work-pages.js
 */
"use strict";

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var dataDir = path.join(root, "data");
var workDir = path.join(root, "work");

var DATA_FILES = {
  sound: "sound.json",
  performance: "performance.json",
  installations: "installations.json",
  visual: "visual.json",
  writing: "writing.json",
  exhibitions: "exhibitions.json",
};

var errors = [];
var warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
}

function items(obj) {
  return obj && Array.isArray(obj.items) ? obj.items : [];
}

function collectExpectedIds() {
  var ids = [];
  var seen = Object.create(null);
  Object.keys(DATA_FILES).forEach(function (key) {
    items(readJson(DATA_FILES[key])).forEach(function (item) {
      if (!item || !item.id) return;
      if (item.urls && item.urls.page) return;
      if (seen[item.id]) fail("Duplicate id in data: " + item.id);
      seen[item.id] = true;
      ids.push(item.id);
    });
  });
  return ids;
}

function checkGeneratedPages(expectedIds) {
  var generated = fs
    .readdirSync(workDir)
    .filter(function (name) {
      return name.charAt(0) !== "_" && name !== "work-page.css";
    });

  expectedIds.forEach(function (id) {
    var pagePath = path.join(workDir, id, "index.html");
    if (!fs.existsSync(pagePath)) {
      fail("Missing generated page for id: " + id);
      return;
    }
    var html = fs.readFileSync(pagePath, "utf8");
    if (html.indexOf("{{") !== -1) fail("Unreplaced template placeholder in " + id);
    if (html.indexOf('data-work-id="' + id + '"') === -1) {
      fail("Wrong data-work-id in " + id);
    }
    if (html.indexOf("https://atharvagupta.net/work/" + id + "/") === -1) {
      fail("Missing canonical URL for " + id);
    }
    if (html.indexOf('application/ld+json') === -1) fail("Missing JSON-LD in " + id);
    if (html.indexOf("../../js/portfolioData.parts.js") === -1) {
      fail("Missing portfolioData.parts.js script in " + id);
    }
    if (html.indexOf("../../portfolioData.js") === -1) {
      fail("Missing portfolioData.js script in " + id);
    }
    if (html.indexOf("work-page__media-stack") === -1) {
      fail("Missing media stack in " + id);
    }
    if (html.indexOf("<h1") === -1 || html.indexOf("work-page__title") === -1) {
      fail("Missing baked h1 in " + id);
    }
    if (html.indexOf("work-page__intro") === -1) {
      fail("Missing intro block in " + id);
    }
  });

  generated.forEach(function (name) {
    if (expectedIds.indexOf(name) === -1) {
      var stat = fs.statSync(path.join(workDir, name));
      if (stat.isDirectory()) warn("Extra work directory not in data: " + name);
    }
  });

  if (expectedIds.length !== generated.filter(function (n) {
    return fs.statSync(path.join(workDir, n)).isDirectory();
  }).length) {
    fail(
      "Page count mismatch: expected " +
        expectedIds.length +
        " dirs, found " +
        generated.length
    );
  }
}

function checkSitemap(expectedIds) {
  var sitemapPath = path.join(root, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    fail("Missing sitemap.xml");
    return;
  }
  var xml = fs.readFileSync(sitemapPath, "utf8");
  expectedIds.forEach(function (id) {
    var url = "https://atharvagupta.net/work/" + id + "/";
    if (xml.indexOf(url) === -1) fail("Sitemap missing " + url);
  });
  ["gallery.html", "exhibitions.html", "archive.html", "about.html", "/thesis/"].forEach(function (p) {
    if (xml.indexOf(p) === -1) warn("Sitemap may be missing static page: " + p);
  });
}

function checkRobots() {
  var robotsPath = path.join(root, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    fail("Missing robots.txt");
    return;
  }
  var txt = fs.readFileSync(robotsPath, "utf8");
  if (txt.indexOf("Sitemap: https://atharvagupta.net/sitemap.xml") === -1) {
    fail("robots.txt missing sitemap reference");
  }
  if (txt.indexOf("Disallow: /admin/") === -1) fail("robots.txt missing /admin/ disallow");
}

function checkListingPages() {
  ["index.html", "exhibitions.html", "archive.html"].forEach(function (page) {
    var html = fs.readFileSync(path.join(root, page), "utf8");
    if (html.indexOf("work-lookup.js") === -1) fail(page + " missing work-lookup.js");
    if (html.indexOf("lightbox.js") !== -1) fail(page + " still includes lightbox.js");
  });
  var gallery = fs.readFileSync(path.join(root, "gallery.html"), "utf8");
  if (gallery.indexOf("work-lookup.js") === -1) fail("gallery.html missing work-lookup.js");
  if (gallery.indexOf("lightbox.js") !== -1) fail("gallery.html still includes lightbox.js");
}

function checkRenderJs() {
  var src = fs.readFileSync(path.join(root, "js", "render.js"), "utf8");
  if (src.indexOf("openLightbox") !== -1) fail("render.js still references openLightbox");
  if (src.indexOf("workHref") === -1) fail("render.js missing workHref helper");
  if (src.indexOf("createElement('a')") === -1 && src.indexOf('createElement("a")') === -1) {
    fail("render.js may not use anchor links");
  }
}

function checkPortfolioDataRootResolution() {
  var src = fs.readFileSync(path.join(root, "portfolioData.js"), "utf8");
  if (src.indexOf("window.location.href") !== -1 && src.indexOf("getSiteRoot") === -1) {
    fail("portfolioData.js may still resolve paths from page URL");
  }
  if (src.indexOf("getSiteRoot") === -1) fail("portfolioData.js missing getSiteRoot");
}

function checkUtilsAssetResolution() {
  var src = fs.readFileSync(path.join(root, "js", "utils.js"), "utf8");
  if (src.indexOf("resolveAssetSrc") === -1) fail("utils.js missing resolveAssetSrc");
  if (src.indexOf("getSiteRoot") === -1) fail("utils.js missing getSiteRoot");
}

function checkWorkDetailUsesResolve() {
  var src = fs.readFileSync(path.join(root, "js", "work-detail.js"), "utf8");
  if (src.indexOf("resolveAssetSrc") === -1) {
    fail("work-detail.js missing resolveAssetSrc usage");
  }
}

function checkPackageScripts() {
  var pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (!pkg.scripts || !pkg.scripts.build) fail("package.json missing build script");
  if (!pkg.scripts["generate-work-pages"]) fail("package.json missing generate-work-pages script");
}

function checkHomepageSeo() {
  var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  if (html.indexOf("<title>Atharva Gupta</title>") === -1) {
    fail("index.html title must be 'Atharva Gupta'");
  }
  if (html.indexOf('rel="canonical" href="https://atharvagupta.net/"') === -1) {
    fail("index.html missing homepage canonical URL");
  }
  if (html.indexOf('property="og:site_name" content="Atharva Gupta"') === -1) {
    fail("index.html missing og:site_name");
  }
  if (html.indexOf('class="site-brand__title"') === -1 || html.indexOf("<h1") === -1) {
    fail("index.html missing H1 site brand");
  }
  if (html.indexOf('"@type":"WebSite"') === -1 || html.indexOf('"@type":"Person"') === -1) {
    fail("index.html missing WebSite/Person JSON-LD");
  }
  if (html.indexOf("https://atharvagupta.net/#person") === -1) {
    fail("index.html missing Person @id");
  }
  if (html.indexOf('class="work-list__group-label"') === -1) {
    fail("index.html missing generated H2 work list groups");
  }
  if (html.indexOf('class="work-list__title"') === -1) {
    fail("index.html missing generated H3 work list titles");
  }
  if (html.indexOf('name="description"') === -1) {
    fail("index.html missing meta description");
  }
  var descMatch = html.match(/name="description" content="([^"]+)"/);
  if (descMatch) {
    var desc = descMatch[1];
    if (desc.indexOf("Atharva Gupta") !== 0) {
      fail("index.html meta description must start with Atharva Gupta");
    }
    if (desc.length < 80 || desc.length > 130) {
      warn("index.html meta description length is " + desc.length + " chars (target 100-130)");
    }
  }
  if (html.indexOf('class="visually-hidden"') === -1) {
    fail("index.html missing crawlable intro paragraphs");
  }
  if (html.indexOf('aria-label="External links"') === -1) {
    fail("index.html missing external links footer");
  }
}

function checkAboutPageSeo() {
  var html = fs.readFileSync(path.join(root, "about.html"), "utf8");
  if (html.indexOf('rel="canonical" href="https://atharvagupta.net/about.html"') === -1) {
    fail("about.html missing canonical URL");
  }
  if (html.indexOf('"@type":"ProfilePage"') === -1) {
    fail("about.html missing ProfilePage JSON-LD");
  }
  if (html.indexOf("https://atharvagupta.net/#person") === -1) {
    fail("about.html missing Person @id reference");
  }
  if (html.indexOf("new media artist") === -1) {
    fail("about.html missing name-first discipline bio");
  }
}

function checkWorkPagePersonReference(expectedIds) {
  if (expectedIds.length === 0) return;
  var sampleId = expectedIds[0];
  var html = fs.readFileSync(path.join(workDir, sampleId, "index.html"), "utf8");
  if (html.indexOf('"@id":"https://atharvagupta.net/#person"') === -1) {
    fail("Work pages should reference Person @id in JSON-LD creator");
  }
}

var expectedIds = collectExpectedIds();
console.log("Expected work pages: " + expectedIds.length);
checkGeneratedPages(expectedIds);
checkSitemap(expectedIds);
checkRobots();
checkListingPages();
checkRenderJs();
checkPortfolioDataRootResolution();
checkUtilsAssetResolution();
checkWorkDetailUsesResolve();
checkPackageScripts();
checkHomepageSeo();
checkAboutPageSeo();
checkWorkPagePersonReference(expectedIds);

if (warnings.length) {
  console.log("\nWarnings (" + warnings.length + "):");
  warnings.forEach(function (w) {
    console.log("  ⚠ " + w);
  });
}

if (errors.length) {
  console.log("\nErrors (" + errors.length + "):");
  errors.forEach(function (e) {
    console.log("  ✗ " + e);
  });
  process.exit(1);
}

console.log("\nAll checks passed.");
