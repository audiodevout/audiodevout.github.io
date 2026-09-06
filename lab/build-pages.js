/**
 * lab/build-pages.js — bake static Defiance pages from data/*.json
 *
 * Sandbox only. Does not touch live work/ pages or sitemap.
 * Run: node lab/build-pages.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LAB = __dirname;
const WORK_DIR = path.join(LAB, "work");

const HOME_GROUPS = [
  {
    label: "Works",
    items: [
      { id: "instruments-for-becoming", year: "2026" },
      { id: "symmetrical-fictions", year: "2025" },
      { id: "gesture-performance-system", year: "2025" },
    ],
  },
  {
    label: "Sound",
    items: [
      { id: "asymmetrica-gcpssm", year: "2026" },
      { id: "asymmetrica-recording-tests-akerk", year: "2025" },
      { id: "asymmetrica-minus-12-c", year: "2025" },
      { id: "asymmetrica-impulse", year: "2025" },
      { id: "asymmetrica-sublimatic", year: "2024" },
      { id: "asymmetrica-the-sauce", year: "2024" },
      { id: "asymmetrica-a-reasonable-crashout", year: "2024" },
      { id: "asymmetrica-automaton", year: "2024" },
      { id: "asymmetrica-not-as-i-remember-it", year: "2023" },
      { id: "asymmetrica-stranded-deep", year: "2023" },
      { id: "asymmetrica-stretching", year: "2023" },
    ],
  },
  {
    label: "TouchDesigner Tutorials",
    items: [
      { id: "audiodevout-video-glitch-tracing-instancing", year: "2026" },
      { id: "audiodevout-contour-experiments", year: "2026" },
      { id: "audiodevout-noise-sculpting-part9", year: "2026" },
      { id: "audiodevout-generative-soundscapes-data-driven", year: "2025" },
      { id: "audiodevout-typewriter-effect", year: "2025" },
    ],
  },
];

const HOME_IDS = [
  "instruments-for-becoming",
  "symmetrical-fictions",
  "gesture-performance-system",
  "asymmetrica-gcpssm",
  "asymmetrica-recording-tests-akerk",
  "asymmetrica-minus-12-c",
  "asymmetrica-impulse",
  "asymmetrica-sublimatic",
  "asymmetrica-the-sauce",
  "asymmetrica-a-reasonable-crashout",
  "asymmetrica-automaton",
  "asymmetrica-not-as-i-remember-it",
  "asymmetrica-stranded-deep",
  "asymmetrica-stretching",
  "audiodevout-video-glitch-tracing-instancing",
  "audiodevout-contour-experiments",
  "audiodevout-noise-sculpting-part9",
  "audiodevout-generative-soundscapes-data-driven",
  "audiodevout-typewriter-effect",
];

const URL_LABELS = {
  pdf: "PDF",
  link: "Link",
  patreon: "Patreon",
  instagram: "Instagram",
  akerk: "Akerk",
  profile: "Profile",
  kunstpunt: "Kunstpunt",
  page: "Page",
};

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function yearFromDate(value) {
  const match = String(value || "").match(/(\d{4})/);
  return match ? match[1] : "Other";
}

function youtubeId(url) {
  if (!url) return "";
  const match = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : "";
}

function assetHref(src, fromWork) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  const cleaned = String(src).replace(/^\.\//, "");
  return (fromWork ? "../../" : "../") + cleaned;
}

function chrome(options) {
  const {
    title,
    bodyClass,
    current,
    cssHref,
    homeHref,
    prefix,
  } = options;

  const nav = [
    { id: "home", href: homeHref, label: "Home" },
    { id: "gallery", href: prefix + "gallery.html", label: "Gallery" },
    { id: "exhibitions", href: prefix + "exhibitions.html", label: "Exhibitions" },
    { id: "archive", href: prefix + "archive.html", label: "Archive" },
    { id: "about", href: prefix + "about.html", label: "About" },
  ];

  const lcpSrc = prefix + "images/noisepyramids.6.webp";

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>${esc(title)}</title>
  <link rel="preload" as="image" href="${lcpSrc}" fetchpriority="high" />
  <link rel="stylesheet" href="${cssHref}" />
</head>
<body class="${esc(bodyClass)}">
  <div class="lab-canvas" aria-hidden="true">
    <img class="lab-canvas__lcp" src="${lcpSrc}" alt="" width="1280" height="1280" fetchpriority="high" decoding="sync" />
  </div>
  <nav class="lab-bar" aria-label="Lab skins">
    <a class="lab-bar__link" href="${prefix}index.html">Techniques</a>
    <a class="lab-bar__link" href="${prefix}steel.html">Steel</a>
    <a class="lab-bar__link" href="${prefix}defiance.html" aria-current="page">Defiance</a>
  </nav>

  <header class="site-header" role="banner">
    <div class="header-inner">
      <a href="${homeHref}" class="site-brand" aria-label="Home">
        <h1 class="site-brand__title">Atharva Gupta</h1>
      </a>
      <div class="header-right">
        <nav class="main-nav" aria-label="Site navigation">
          ${nav
            .map((item) => {
              const currentAttr =
                item.id === current ? ' aria-current="page"' : "";
              return `<a href="${item.href}" class="nav-link"${currentAttr}>${item.label}</a>`;
            })
            .join("\n          ")}
        </nav>
      </div>
    </div>
  </header>
`;
}

function pageEnd() {
  return `</body>
</html>
`;
}

function rootPage(opts) {
  return {
    title: opts.title,
    bodyClass: opts.bodyClass,
    current: opts.current,
    cssHref: "./defiance.css",
    homeHref: "./defiance.html",
    prefix: "./",
  };
}

function workChrome(title) {
  return chrome({
    title,
    bodyClass: "page-work",
    current: "",
    cssHref: "../defiance.css",
    homeHref: "../defiance.html",
    prefix: "../",
  });
}

function collectItems() {
  const bags = [
    readJson("data/installations.json"),
    readJson("data/performance.json"),
    readJson("data/sound.json"),
    readJson("data/visual.json"),
    readJson("data/writing.json"),
    readJson("data/exhibitions.json"),
  ];
  const map = new Map();
  bags.forEach((bag) => {
    (bag.items || []).forEach((item) => {
      if (item && item.id) map.set(item.id, item);
    });
  });
  return map;
}

function splitBody(text) {
  return String(text || "")
    .split(/\n\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function bodyHtml(text) {
  return splitBody(text)
    .map((chunk) => {
      const lines = chunk.split("\n");
      const single = lines.length === 1 ? lines[0] : "";
      if (
        single &&
        single.length < 42 &&
        !/[.?!]$/.test(single) &&
        !single.includes("—")
      ) {
        return `        <h3 class="work-page__subhead">${esc(single)}</h3>`;
      }
      return `        <p class="work-page__description">${esc(chunk).replace(
        /\n/g,
        "<br />"
      )}</p>`;
    })
    .join("\n");
}

function mediaHtml(item) {
  const figures = [];
  const images = item.images || [];
  images.forEach((src, index) => {
    figures.push(`        <figure class="work-page__figure work-page__figure--image">
          <img src="${esc(assetHref(src, true))}" alt="${esc(item.title)}" ${
      index === 0 ? 'loading="eager"' : 'loading="lazy"'
    } decoding="async" />
        </figure>`);
  });

  (item.videos || []).forEach((url) => {
    const id = youtubeId(url);
    if (id) {
      figures.push(`        <figure class="work-page__figure work-page__figure--youtube">
          <div class="work-page__embed work-page__embed--youtube">
            <iframe src="https://www.youtube-nocookie.com/embed/${esc(id)}" title="${esc(
        item.title
      )}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
          </div>
        </figure>`);
      return;
    }
    figures.push(`        <figure class="work-page__figure work-page__figure--video">
          <video src="${esc(assetHref(url, true))}" controls loop playsinline></video>
        </figure>`);
  });

  (item.bandcampTracks || []).forEach((track) => {
    figures.push(`        <figure class="work-page__figure work-page__figure--bandcamp">
          <div class="work-page__embed work-page__embed--bandcamp">
            <iframe src="https://bandcamp.com/EmbeddedPlayer/track=${esc(
              track.trackId
            )}/size=large/bgcol=111111/linkcol=ffffff/tracklist=false/artwork=large/transparent=false/" title="${esc(
      track.title || item.title
    )}"></iframe>
          </div>
        </figure>`);
  });

  return figures.join("\n");
}

function linksHtml(item, fromWork) {
  const urls = item.urls || {};
  const keys = Object.keys(urls);
  if (!keys.length) return "";
  const links = keys
    .map((key) => {
      const href = urls[key];
      if (!href) return "";
      const external = /^https?:\/\//i.test(href);
      const resolved = external ? href : assetHref(href, fromWork);
      const label = URL_LABELS[key] || key;
      const extra = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a class="work-page__link" href="${esc(resolved)}"${extra}>${esc(
        label
      )}</a>`;
    })
    .filter(Boolean);
  if (!links.length) return "";
  return `      <p class="work-page__links">${links.join(" ")}</p>`;
}

function metaBits(item) {
  const bits = [];
  if (item.role) bits.push(item.role);
  if (item.venue) bits.push(item.venue);
  if (item.location) bits.push(item.location);
  if (item.date) bits.push(item.date);
  if (item.category && !item.role) bits.push(item.category);
  return bits;
}

function writeWorkPage(item, backHref, backLabel) {
  const meta = metaBits(item);
  const category = item.role || item.category || "";
  const body = item.fullDescription || item.description || "";
  const media = mediaHtml(item);
  const html = `${workChrome(`${item.title} — Defiance`)}
  <main class="main work-page" id="work-page" data-work-id="${esc(item.id)}" role="main">
    <div class="work-page__toolbar">
      <a class="work-page__back" href="${esc(backHref)}">${esc(backLabel)}</a>
    </div>

    <article class="work-page__article">
      <header class="work-page__header">
        <h1 class="work-page__title">${esc(item.title)}</h1>
        ${
          category
            ? `<p class="work-page__category">${esc(category)}</p>`
            : ""
        }
        ${
          meta.length
            ? `<p class="work-page__meta">${meta.map(esc).join(" · ")}</p>`
            : ""
        }
      </header>

      <div class="work-page__intro">
${bodyHtml(body)}
      </div>
${linksHtml(item, true)}
      <div class="work-page__media-stack">
${media}
      </div>
    </article>
  </main>
${pageEnd()}`;

  fs.writeFileSync(path.join(WORK_DIR, `${item.id}.html`), html);
}

function writeExhibitions(exhibitions) {
  const buckets = [];
  exhibitions.forEach((ex) => {
    const label = yearFromDate(ex.date);
    const last = buckets[buckets.length - 1];
    if (!last || last.label !== label) {
      buckets.push({ label, items: [ex] });
    } else {
      last.items.push(ex);
    }
  });

  const groups = buckets
    .map((bucket) => {
      const items = bucket.items
        .map((ex) => {
          const parts = [ex.title, ex.venue, ex.location, ex.date].filter(
            Boolean
          );
          const line = parts
            .map((part, index) => {
              const cls = index === 0 ? "work-list__title" : "work-list__detail";
              const sep =
                index > 0
                  ? `<span class="work-list__sep" aria-hidden="true"> · </span>`
                  : "";
              return `${sep}<span class="${cls}">${esc(part)}</span>`;
            })
            .join("");
          return `          <a class="work-list__item work-list__item--exhibition" href="./work/${esc(
            ex.id
          )}.html" data-year="${esc(yearFromDate(ex.date))}"><p class="work-list__line">${line}</p></a>`;
        })
        .join("\n");
      return `        <section class="work-list__group">
          <h2 class="work-list__group-label" data-count="${bucket.items.length}">${esc(
        bucket.label
      )}</h2>
${items}
        </section>`;
    })
    .join("\n\n");

  const html = `${chrome(rootPage({
    title: "Exhibitions — Defiance",
    bodyClass: "page-exhibitions",
    current: "exhibitions",
  }))}
  <main class="main" id="main" role="main">
    <section class="section section--list" id="exhibitions-content">
      <div class="work-list">
${groups}
      </div>
    </section>
  </main>
${pageEnd()}`;

  fs.writeFileSync(path.join(LAB, "exhibitions.html"), html);
}

function writeAbout(profile, links) {
  const about = profile.about || {};
  const cv = profile.cv || {};
  const intro = (profile.home && profile.home.seoIntro) || [];
  const image = assetHref(about.image || "./assets/images/profile/atharva.webp", false);

  const social = (links.items || [])
    .map(
      (s) =>
        `<a class="about__social-link" href="${esc(
          s.url
        )}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>`
    )
    .join("\n            ");

  const education = (cv.education || [])
    .map(
      (row) => `          <div class="cv-row">
            <p class="cv-row__title">${esc(row.degree)}</p>
            <p class="cv-row__meta">${esc(row.institution)}${
        row.location ? " · " + esc(row.location) : ""
      }</p>
            <p class="cv-row__period">${esc(row.period)}</p>
          </div>`
    )
    .join("\n");

  const jobs = (cv.workExperience || [])
    .map(
      (job) => `          <div class="cv-row">
            <p class="cv-row__title">${esc(job.title)}${
        job.company ? " · " + esc(job.company) : ""
      }</p>
            <p class="cv-row__meta">${esc(job.location || "")}</p>
            <p class="cv-row__period">${esc(job.period)}</p>
          </div>`
    )
    .join("\n");

  const skills = cv.skills || {};
  const skillCloud = []
    .concat(skills.general || [], skills.technologies || [], skills.interests || [])
    .map((word) => `<span class="cv-skill">${esc(word)}</span>`)
    .join("\n            ");

  const html = `${chrome(rootPage({
    title: "About — Defiance",
    bodyClass: "page-about",
    current: "about",
  }))}
  <main class="main" id="main" role="main">
    <section class="section section--about" id="about" aria-labelledby="about-heading">
      <h2 id="about-heading" class="section-heading">About</h2>
      <div class="about-grid">
        <div class="about-image-wrap">
          <img src="${esc(image)}" alt="Atharva Gupta" />
        </div>
        <div class="about-copy">
          <p class="about__description">${esc(about.description)}</p>
          ${
            intro[2]
              ? `<p class="about__description about__description--veil">${esc(
                  intro[2]
                )}</p>`
              : ""
          }
          <div class="about__social">
            ${social}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--cv" id="cv" aria-labelledby="cv-heading">
      <h2 id="cv-heading" class="section-heading">CV</h2>
      <div class="cv-block">
        <h3 class="cv-block__title" data-count="${(cv.education || []).length}">Education</h3>
${education}
      </div>
      <div class="cv-block">
        <h3 class="cv-block__title" data-count="${(cv.workExperience || []).length}">Work</h3>
${jobs}
      </div>
      <div class="cv-block cv-block--skills">
        <h3 class="cv-block__title">Skills</h3>
        <p class="cv-skill-cloud">
            ${skillCloud}
        </p>
      </div>
    </section>
  </main>
${pageEnd()}`;

  fs.writeFileSync(path.join(LAB, "about.html"), html);
}

function writeArchive(writing) {
  const items = [
    {
      href: "../thesis/",
      title: "Instruments for Becoming",
      detail: "Thesis — MADTECH, Frank Mohr Institute, 2026",
      external: false,
    },
    ...writing.map((item) => ({
      href: `./work/${item.id}.html`,
      title: item.title,
      detail: item.category || "Writing",
      external: false,
    })),
  ];

  const rows = items
    .map(
      (item, index) =>
        `          <a class="work-list__item" href="${esc(item.href)}"${
          index === 0 ? ' target="_blank" rel="noopener noreferrer"' : ""
        }><h3 class="work-list__title">${esc(item.title)}</h3><span class="work-list__detail">${esc(
          item.detail
        )}</span></a>`
    )
    .join("\n");

  const html = `${chrome(rootPage({
    title: "Archive — Defiance",
    bodyClass: "page-archive",
    current: "archive",
  }))}
  <main class="main" id="main" role="main">
    <section class="section section--list" id="archive-content">
      <div class="work-list">
        <section class="work-list__group">
          <h2 class="work-list__group-label" data-count="${items.length}">Archive</h2>
${rows}
        </section>
      </div>
    </section>
  </main>
${pageEnd()}`;

  fs.writeFileSync(path.join(LAB, "archive.html"), html);
}

function writeHome(items) {
  const groups = HOME_GROUPS.map((group) => {
    const rows = group.items
      .map((entry) => {
        const item = items.get(entry.id);
        if (!item) throw new Error("Missing home-list item: " + entry.id);
        return `          <a class="work-list__item" href="./work/${esc(
          entry.id
        )}.html" data-year="${esc(entry.year)}"><h3 class="work-list__title">${esc(
          item.title
        )}</h3></a>`;
      })
      .join("\n");
    return `        <section class="work-list__group">
          <h2 class="work-list__group-label" data-count="${group.items.length}">${esc(
      group.label
    )}</h2>
${rows}
        </section>`;
  }).join("\n\n");

  const html = `${chrome(rootPage({
    title: "Defiance — Lab Skin",
    bodyClass: "page-home",
    current: "home",
  }))}
  <main class="main" id="main" role="main">
    <section class="section section--list" id="list-content">
      <div class="work-list">
${groups}
      </div>
    </section>
  </main>
${pageEnd()}`;

  fs.writeFileSync(path.join(LAB, "defiance.html"), html);
}

function writeGallery(visual) {
  const research = (visual.items || []).filter(
    (item) =>
      item.category === "VISUAL RESEARCH" &&
      item.images &&
      item.images.length
  );

  const figures = [];
  research.forEach((item) => {
    item.images.slice(0, 2).forEach((src, imageIndex) => {
      const i = figures.length;
      figures.push(`        <figure class="gallery-masonry__item">
          <img src="${esc(assetHref(src, false))}" alt="${esc(item.title)}" ${
        i < 6 ? 'loading="eager"' : 'loading="lazy"'
      } decoding="async" />
          <figcaption class="gallery-masonry__caption">${esc(item.title)}</figcaption>
        </figure>`);
    });
  });

  const html = `${chrome(rootPage({
    title: "Gallery — Defiance",
    bodyClass: "page-gallery",
    current: "gallery",
  }))}
  <main class="main main--gallery" id="main" role="main">
    <div class="gallery-masonry" id="gallery-root" aria-label="Visual research gallery">
${figures.join("\n")}
    </div>
  </main>
${pageEnd()}`;

  fs.writeFileSync(path.join(LAB, "gallery.html"), html);
}

function main() {
  fs.mkdirSync(WORK_DIR, { recursive: true });
  const items = collectItems();
  const exhibitions = readJson("data/exhibitions.json").items || [];
  const writing = readJson("data/writing.json").items || [];
  const visual = readJson("data/visual.json");
  const profile = readJson("data/profile.json");
  const links = readJson("data/links.json");

  writeHome(items);
  writeExhibitions(exhibitions);
  writeAbout(profile, links);
  writeArchive(writing);
  writeGallery(visual);

  let workCount = 0;
  HOME_IDS.forEach((id) => {
    const item = items.get(id);
    if (!item) throw new Error("Missing home-list item: " + id);
    writeWorkPage(item, "../defiance.html", "← Works");
    workCount += 1;
  });

  exhibitions.forEach((item) => {
    writeWorkPage(item, "../exhibitions.html", "← Exhibitions");
    workCount += 1;
  });

  writing.forEach((item) => {
    writeWorkPage(item, "../archive.html", "← Archive");
    workCount += 1;
  });

  console.log(
    "Wrote lab/defiance.html, exhibitions.html, about.html, archive.html, gallery.html and " +
      workCount +
      " work pages."
  );
}

main();
