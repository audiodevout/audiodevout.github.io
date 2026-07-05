"use strict";

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var errors = [];

function fail(msg) {
  errors.push(msg);
}

function getSiteRoot(scriptSrc) {
  return new URL(".", scriptSrc).href;
}

function dataUrl(filename, siteRoot) {
  return new URL("data/" + filename, siteRoot).href;
}

function resolveAssetSrc(src, siteRoot) {
  if (!src || typeof src !== "string") return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.charAt(0) === "/") return new URL(src.slice(1), siteRoot).href;
  if (src.indexOf("./") === 0) return new URL(src.slice(2), siteRoot).href;
  return new URL(src, siteRoot).href;
}

// Path resolution from nested work page
var workScript =
  "https://atharvagupta.net/work/instruments-for-becoming/../../portfolioData.js";
var siteRoot = getSiteRoot(workScript);
var dataSound = dataUrl("sound.json", siteRoot);
var img = resolveAssetSrc(
  "./assets/images/installations/instruments-for-becoming/rain-stick-1.webp",
  siteRoot
);

if (dataSound !== "https://atharvagupta.net/data/sound.json") {
  fail("Data URL wrong: " + dataSound);
}
if (
  img !==
  "https://atharvagupta.net/assets/images/installations/instruments-for-becoming/rain-stick-1.webp"
) {
  fail("Asset URL wrong: " + img);
}

// Stack image assets on disk
["instruments-for-becoming", "rot-2026", "symmetrical-fictions"].forEach(function (id) {
  var html = fs.readFileSync(path.join(root, "work", id, "index.html"), "utf8");
  var match = html.match(/<img src="([^"]+)"/);
  if (!match) return;
  var rel = match[1].replace(/^\.\.\/\.\.\//, "");
  if (!fs.existsSync(path.join(root, rel))) {
    fail("Missing stack image for " + id + ": " + rel);
  }
});

// All baked stack image paths
var stackMissing = 0;
fs.readdirSync(path.join(root, "work")).forEach(function (id) {
  if (id.charAt(0) === "_" || id === "work-page.css") return;
  var html = fs.readFileSync(path.join(root, "work", id, "index.html"), "utf8");
  var match = html.match(/<img src="([^"]+)"/);
  if (!match) return;
  var rel = match[1].replace(/^\.\.\/\.\.\//, "");
  if (!fs.existsSync(path.join(root, rel))) stackMissing++;
});
if (stackMissing > 0) fail(stackMissing + " generated pages reference missing stack images");

// Thesis archive item
var render = fs.readFileSync(path.join(root, "js", "render.js"), "utf8");
if (render.indexOf("urls: { page: './thesis/' }") === -1) {
  fail("Thesis archive item missing custom page URL");
}

// Lightbox startIndex support
var lightbox = fs.readFileSync(path.join(root, "js", "lightbox.js"), "utf8");
if (lightbox.indexOf("startIndex") === -1) {
  fail("lightbox.js missing startIndex support for expand button");
}

// work-detail script order on template: utils before work-detail
var template = fs.readFileSync(path.join(root, "work", "_template.html"), "utf8");
var utilsIdx = template.indexOf("utils.js");
var detailIdx = template.indexOf("work-detail.js");
var partsIdx = template.indexOf("portfolioData.parts.js");
var pdataIdx = template.indexOf("portfolioData.js");
if (partsIdx === -1 || pdataIdx === -1 || partsIdx > pdataIdx) {
  fail("Template script order: parts must load before portfolioData");
}
if (utilsIdx === -1 || detailIdx === -1 || utilsIdx > detailIdx) {
  fail("Template script order: utils must load before work-detail");
}

if (errors.length) {
  console.log("Runtime check errors:");
  errors.forEach(function (e) {
    console.log("  ✗ " + e);
  });
  process.exit(1);
}

console.log("Runtime checks passed.");
console.log("  Site root resolves to:", siteRoot);
console.log("  Sample data URL:", dataSound);
console.log("  Sample asset URL:", img);
