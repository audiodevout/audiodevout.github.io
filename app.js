/**
 * Portfolio app — single-page gallery driven by portfolioData.js
 * Renders sections, handles modals, smooth scroll, and media embeds.
 */
(function () {
  "use strict";

  const data = typeof window !== "undefined" ? window.portfolioData : null;
  if (!data) return;

  const works = Array.isArray(data.works) ? data.works : [];
  const exhibitions = Array.isArray(data.exhibitions) ? data.exhibitions : [];

  // Filtered collections
  const installations = works.filter((w) => w.type === "installation");
  const performanceWorks = works.filter((w) => w.type === "performance");
  const asymmetricaWorks = works.filter(
    (w) => w.type === "sound" && Array.isArray(w.bandcampTracks) && w.bandcampTracks.length > 0
  );
  const audiodevoutWorks = works.filter(
    (w) => w.type === "visual" && w.id && w.id.startsWith("audiodevout-")
  );
  const digitalArtWorks = works.filter(
    (w) => w.type === "visual" && (!w.id || !w.id.startsWith("audiodevout-"))
  );

  // --- Helpers ---
  function esc(s) {
    if (s == null || s === "") return "";
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  // Utilities adapted from the original main.js
  function getYoutubeId(url) {
    if (!url || typeof url !== "string") return "";
    if (url.includes("youtube.com")) {
      const qs = url.split("?")[1] || "";
      const params = new URLSearchParams(qs);
      return params.get("v") || "";
    }
    if (url.includes("youtu.be/")) {
      return url.split("/").pop().split("?")[0];
    }
    return "";
  }

  function youtubeEmbedUrl(url) {
    const id = getYoutubeId(url);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  }

  // Prefer smaller thumbnails when available (./assets/images/thumbs/)
  function getThumbnailSrc(src) {
    if (!src || typeof src !== "string") return src;
    if (!src.startsWith("./assets/images/")) return src;
    const withoutPrefix = src.replace("./assets/images/", "");
    return `./assets/images/thumbs/${withoutPrefix}`;
  }

  // ============================================
  // DYNAMIC THEMES — 24 pastel/mono palettes
  // ============================================

  const THEMES = [
    { bg: "#0b0c0e", surface: "#111318", border: "#21232a", text: "#f3f4f6", textSecondary: "#9ca3af" }, // 0
    { bg: "#0b1013", surface: "#11161b", border: "#1f2933", text: "#e5f0ff", textSecondary: "#9fb3c8" }, // 1 cool blue
    { bg: "#0c1011", surface: "#121617", border: "#202728", text: "#f5f7fa", textSecondary: "#a0aec0" }, // 2 neutral
    { bg: "#0d1012", surface: "#14181c", border: "#262b33", text: "#fdf2f8", textSecondary: "#f9a8d4" }, // 3 dusty pink
    { bg: "#0b1210", surface: "#111917", border: "#20332d", text: "#ecfdf3", textSecondary: "#86efac" }, // 4 soft green
    { bg: "#0b1013", surface: "#12151a", border: "#232637", text: "#e0f2fe", textSecondary: "#93c5fd" }, // 5 slate blue
    { bg: "#0b0f13", surface: "#13171c", border: "#27303b", text: "#e5e7eb", textSecondary: "#9ca3af" }, // 6 graphite
    { bg: "#0c0d12", surface: "#151620", border: "#2d2640", text: "#f3e8ff", textSecondary: "#d8b4fe" }, // 7 violet
    { bg: "#0c1010", surface: "#13191a", border: "#1f2933", text: "#e5f6ff", textSecondary: "#7ed0ff" }, // 8 icy
    { bg: "#0c0f11", surface: "#14181b", border: "#252b33", text: "#f9fafb", textSecondary: "#9ca3af" }, // 9 neutral
    { bg: "#0c1012", surface: "#14161c", border: "#283241", text: "#eff6ff", textSecondary: "#bfdbfe" }, // 10 blue-grey
    { bg: "#0c0f10", surface: "#15191a", border: "#27312e", text: "#ecfdf5", textSecondary: "#bbf7d0" }, // 11 mint
    { bg: "#0b0c10", surface: "#13141a", border: "#26273a", text: "#f9fafb", textSecondary: "#d1d5db" }, // 12 midnight neutral
    { bg: "#0b0c11", surface: "#141622", border: "#29274b", text: "#ede9fe", textSecondary: "#c4b5fd" }, // 13 indigo
    { bg: "#0c0d0f", surface: "#15161a", border: "#26272f", text: "#e5e7eb", textSecondary: "#9ca3af" }, // 14 charcoal
    { bg: "#0c0f13", surface: "#151922", border: "#2b3142", text: "#e0f2fe", textSecondary: "#7fb4ff" }, // 15 steel blue
    { bg: "#0b1011", surface: "#141a1c", border: "#263239", text: "#ecfeff", textSecondary: "#99f6e4" }, // 16 teal
    { bg: "#0c0e10", surface: "#15171b", border: "#262935", text: "#f9fafb", textSecondary: "#a1a1aa" }, // 17 soft neutral
    { bg: "#0c0d11", surface: "#151722", border: "#2c2f45", text: "#fef9c3", textSecondary: "#fde68a" }, // 18 muted amber
    { bg: "#0c0f11", surface: "#15191d", border: "#27313a", text: "#e5f4ff", textSecondary: "#a5b4fc" }, // 19 periwinkle
    { bg: "#0b0d10", surface: "#14171b", border: "#232931", text: "#f3f4f6", textSecondary: "#9ca3af" }, // 20 neutral
    { bg: "#0b0f12", surface: "#151920", border: "#273246", text: "#f1f5f9", textSecondary: "#cbd5f5" }, // 21 soft navy
    { bg: "#0b0f0f", surface: "#151917", border: "#243228", text: "#ecfdf5", textSecondary: "#a7f3d0" }, // 22 sea green
    { bg: "#0b0d10", surface: "#15171b", border: "#262830", text: "#e5e7eb", textSecondary: "#9ca3af" }, // 23 fallback
  ];

  function lerpChannel(a, b, t) {
    return Math.round(a + (b - a) * t);
  }

  function hexToRgb(hex) {
    if (!hex || typeof hex !== "string") return null;
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return null;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }

  function rgbToHex({ r, g, b }) {
    const toHex = (v) => v.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function lerpColor(aHex, bHex, t) {
    const a = hexToRgb(aHex);
    const b = hexToRgb(bHex);
    if (!a || !b) return aHex;
    return rgbToHex({
      r: lerpChannel(a.r, b.r, t),
      g: lerpChannel(a.g, b.g, t),
      b: lerpChannel(a.b, b.b, t),
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--text-secondary", theme.textSecondary);
  }

  // Gradual shift between hour themes over the first 20 minutes of each hour
  function updateThemeFromTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentIndex = hour % THEMES.length;
    const prevIndex = (currentIndex + THEMES.length - 1) % THEMES.length;
    const currentTheme = THEMES[currentIndex];
    const prevTheme = THEMES[prevIndex];
    const t = Math.min(minute / 20, 1); // 0–20 minutes: blend prev -> current, then hold
    const blended = {
      bg: lerpColor(prevTheme.bg, currentTheme.bg, t),
      surface: lerpColor(prevTheme.surface, currentTheme.surface, t),
      border: lerpColor(prevTheme.border, currentTheme.border, t),
      text: lerpColor(prevTheme.text, currentTheme.text, t),
      textSecondary: lerpColor(prevTheme.textSecondary, currentTheme.textSecondary, t),
    };
    applyTheme(blended);
  }

  function bandcampEmbedUrl(trackId) {
    if (!trackId) return null;
    // Bandcamp embedded player for a single track, with visible artwork
    return `https://bandcamp.com/EmbeddedPlayer/track=${trackId}/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=large/transparent=false/`;
  }

  function renderHero() {
    const home = data.pageContent && data.pageContent.home;
    if (!home) return;
    const titleEl = document.querySelector(".hero-title");
    const subtitleEl = document.querySelector(".hero-subtitle");
    const descEl = document.querySelector(".hero-description");
    if (titleEl) titleEl.textContent = home.title || "";
    if (subtitleEl) subtitleEl.textContent = home.subtitle || "";
    if (descEl) descEl.textContent = home.description || "";
  }

  function firstImage(item) {
    const imgs = item.images;
    return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : null;
  }

  function firstVideoUrl(item) {
    const v = item.videos;
    if (!Array.isArray(v) || v.length === 0) return null;
    const u = v[0];
    return typeof u === "string" ? u : null;
  }

  // --- Card renderers (return HTML string) ---
  function cardMediaHTML(item, options = {}) {
    const img = firstImage(item);
    const videoUrl = firstVideoUrl(item);
    const placeholder = options.placeholder !== false;
    if (img) {
      // Use the original asset path for reliability; thumbnails can be wired later
      return `<div class="card-media"><img src="${esc(img)}" alt="" loading="lazy" /></div>`;
    }
    if (videoUrl && options.videoAsThumb !== true) {
      const embed = youtubeEmbedUrl(videoUrl);
      if (embed && options.lazyYouTube) {
        const id = (videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]+)/) || [])[1];
        return `<div class="card-media card-embed"><div class="card-media-placeholder" data-youtube-id="${esc(id)}" data-embed-url="${esc(embed)}" role="button" tabindex="0"><span>Play video</span></div></div>`;
      }
      if (embed) {
        return `<div class="card-media card-embed"><iframe src="${esc(embed)}" loading="lazy" title="Video"></iframe></div>`;
      }
    }
    if (placeholder) {
      return `<div class="card-media"><div class="card-media-placeholder">—</div></div>`;
    }
    return "";
  }

  function cardBodyHTML(item, metaLines = []) {
    const title = esc(item.title || "");
    const metaHTML = metaLines
      .filter(Boolean)
      .map((p) => `<span class="card-meta-line">${p}</span>`)
      .join("");
    let tagsHTML = "";
    const tags = item.tags;
    if (typeof tags === "string") {
      tagsHTML = `<span class="card-tag">${esc(tags)}</span>`;
    } else if (Array.isArray(tags) && tags.length) {
      tagsHTML = tags.map((t) => `<span class="card-tag">${esc(t)}</span>`).join("");
    }
    if (tagsHTML) tagsHTML = `<div class="card-tags">${tagsHTML}</div>`;
    return `
      <div class="card-body">
        <h3 class="card-title">${title}</h3>
        ${metaHTML ? `<p class="card-meta">${metaHTML}</p>` : ""}
        ${tagsHTML}
      </div>`;
  }

  let currentSectionId = "works";

  function getModalContentBySectionAndId(sectionId, itemId) {
    if (!sectionId || !itemId) return null;
    if (sectionId === "works") {
      const item = installations.find((w) => w.id === itemId);
      return item ? modalContentWork(item) : null;
    }
    if (sectionId === "performance") {
      const item = performanceWorks.find((w) => w.id === itemId);
      return item ? modalContentWork(item) : null;
    }
    if (sectionId === "exhibitions") {
      const ex = exhibitions.find((e) => e.id === itemId);
      return ex ? modalContentExhibition(ex) : null;
    }
    if (sectionId === "digital-art") {
      const item = digitalArtWorks.find((w) => w.id === itemId);
      return item ? modalContentWork(item) : null;
    }
    return null;
  }

  function openModal(contentHTML, opts = {}) {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modal-body");
    if (!modal || !body) return;
    body.innerHTML = contentHTML;
    modal.setAttribute("aria-hidden", "false");
    const firstFocus = body.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocus && typeof firstFocus.focus === "function") firstFocus.focus();
    trapFocus(modal);
    document.body.style.overflow = "hidden";
    if (opts.sectionId && opts.itemId) {
      const hash = "#" + opts.sectionId + "/" + opts.itemId;
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    }
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    untrapFocus(modal);
    if (currentSectionId === "home") {
      const clean = window.location.pathname + window.location.search;
      if (window.location.hash) {
        window.history.replaceState(null, "", clean);
      }
    } else {
      const hash = "#" + (currentSectionId || "home");
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    }
  }

  let focusTrapCleanup = null;
  function trapFocus(container) {
    const focusables = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    function onKey(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          if (last) last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          if (first) first.focus();
        }
      }
    }
    container.addEventListener("keydown", onKey);
    focusTrapCleanup = () => {
      container.removeEventListener("keydown", onKey);
      focusTrapCleanup = null;
    };
  }

  function untrapFocus(container) {
    if (focusTrapCleanup) {
      focusTrapCleanup();
    }
  }

  function modalContentWork(item) {
    const imgs = Array.isArray(item.images) ? item.images : [];
    const mediaHTML = imgs
      .map((src) => `<img src="${esc(src)}" alt="" loading="lazy" />`)
      .join("");
    const desc = item.descriptionLong ? esc(item.descriptionLong) : "";
    const links = [];
    if (item.urls && item.urls.pdf) links.push(`<a href="${esc(item.urls.pdf)}">PDF</a>`);
    if (Array.isArray(item.videos) && item.videos.length) {
      item.videos.forEach((v) => {
        if (typeof v === "string" && v.includes("youtube")) {
          links.push(`<a href="${esc(v)}" target="_blank" rel="noopener">Watch video</a>`);
        }
      });
    }
    const linksHTML = links.length ? `<div class="modal-links">${links.join(" ")}</div>` : "";
    return `
      <h2 id="modal-title" class="modal-title">${esc(item.title || "")}</h2>
      ${item.medium ? `<p class="modal-meta">${esc(item.medium)}</p>` : ""}
      ${desc ? `<div class="modal-description">${desc.replace(/\n/g, "<br>")}</div>` : ""}
      ${mediaHTML ? `<div class="modal-media">${mediaHTML}</div>` : ""}
      ${linksHTML}
    `;
  }

  function modalContentExhibition(ex) {
    const imgs = Array.isArray(ex.images) ? ex.images : [];
    const mediaHTML = imgs
      .map((src) => `<img src="${esc(src)}" alt="" loading="lazy" />`)
      .join("");
    const desc = ex.description ? esc(ex.description) : "";
    const links = [];
    if (ex.urls) {
      if (ex.urls.pdf) links.push(`<a href="${esc(ex.urls.pdf)}">PDF</a>`);
      if (ex.urls.link) links.push(`<a href="${esc(ex.urls.link)}" target="_blank" rel="noopener">Event link</a>`);
      if (ex.urls.instagram) links.push(`<a href="${esc(ex.urls.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
    }
    const linksHTML = links.length ? `<div class="modal-links">${links.join(" ")}</div>` : "";
    return `
      <h2 id="modal-title" class="modal-title">${esc(ex.title || "")}</h2>
      <p class="modal-meta">${esc(ex.date || "")} · ${esc(ex.venue || "")} · ${esc(ex.location || "")}</p>
      ${desc ? `<div class="modal-description">${desc.replace(/\n/g, "<br>")}</div>` : ""}
      ${mediaHTML ? `<div class="modal-media">${mediaHTML}</div>` : ""}
      ${linksHTML}
    `;
  }

  function modalContentDoc(doc) {
    if (!doc) return "";
    const desc =
      doc.description && typeof doc.description === "string"
        ? esc(doc.description).replace(/\n/g, "<br>")
        : "";
    const themesText =
      Array.isArray(doc.themes) && doc.themes.length
        ? doc.themes.join(", ")
        : typeof doc.themes === "string"
        ? doc.themes
        : "";
    const linkHTML = doc.url
      ? `<div class="modal-links"><a href="${esc(doc.url)}" target="_blank" rel="noopener">${esc(
          doc.label || "Open PDF"
        )}</a></div>`
      : "";
    return `
      <h2 id="modal-title" class="modal-title">${esc(doc.title || "")}</h2>
      ${themesText ? `<p class="modal-meta">${esc(themesText)}</p>` : ""}
      ${desc ? `<div class="modal-description">${desc}</div>` : ""}
      ${linkHTML}
    `;
  }

  // --- Section: Works (installations) ---
  function renderWorks() {
    const container = document.querySelector('[data-section="works"]');
    if (!container) return;
    if (!installations.length) {
      container.innerHTML = "<p class=\"card-meta\">No installations listed.</p>";
      return;
    }
    container.innerHTML = installations
      .map((item) => {
        const img = firstImage(item);
        const metaLines = [];
        if (item.medium) metaLines.push(item.medium);
        if (item.dimensions) metaLines.push(item.dimensions);
        const media = cardMediaHTML(item);
        const body = cardBodyHTML(item, metaLines);
        return `<article class="card" data-id="${esc(item.id)}">${media}${body}</article>`;
      })
      .join("");

    container.querySelectorAll(".card").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        const item = installations.find((w) => w.id === id);
        if (item) openModal(modalContentWork(item), { sectionId: "works", itemId: item.id });
      });
    });
  }

  // --- Section: Performance ---
  function renderPerformance() {
    const container = document.querySelector('[data-section="performance"]');
    if (!container) return;
    if (!performanceWorks.length) {
      container.innerHTML = "<p class=\"card-meta\">No performance works listed.</p>";
      return;
    }
    container.innerHTML = performanceWorks
      .map((item) => {
        const metaLines = [];
        if (item.medium) metaLines.push(item.medium);
        if (item.tags) metaLines.push(typeof item.tags === "string" ? item.tags : (item.tags || []).join(" · "));
        const media = cardMediaHTML(item);
        const body = cardBodyHTML(item, metaLines);
        return `<article class="card" data-id="${esc(item.id)}">${media}${body}</article>`;
      })
      .join("");

    container.querySelectorAll(".card").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        const item = performanceWorks.find((w) => w.id === id);
        if (item) openModal(modalContentWork(item), { sectionId: "performance", itemId: item.id });
      });
    });
  }

  // --- Section: Exhibitions ---
  function renderExhibitions() {
    const container = document.querySelector('[data-section="exhibitions"]');
    if (!container) return;
    if (!exhibitions.length) {
      container.innerHTML = "<p class=\"card-meta\">No exhibitions listed.</p>";
      return;
    }
    container.innerHTML = exhibitions
      .map((ex) => {
        const img = Array.isArray(ex.images) && ex.images.length ? ex.images[0] : null;
        const imgHTML = img
          ? `<div class="card-media"><img src="${esc(img)}" alt="" loading="lazy" /></div>`
          : "";
        const meta = [ex.date, ex.venue, ex.location].filter(Boolean).join(" · ");
        const hasImageClass = img ? " exhibition-card has-image" : "";
        return `
          <article class="card exhibition-card${hasImageClass}" data-ex-id="${esc(ex.id)}">
            ${imgHTML}
            <div class="card-body">
              <span class="exhibition-date">${esc(ex.date || "")}</span>
              <h3 class="exhibition-title">${esc(ex.title || "")}</h3>
              <p class="exhibition-meta">${esc(ex.role || "")}${meta ? " · " + esc(meta) : ""}</p>
              ${ex.description ? `<p class="exhibition-description">${esc(ex.description.slice(0, 200))}${ex.description.length > 200 ? "…" : ""}</p>` : ""}
            </div>
          </article>`;
      })
      .join("");

    container.querySelectorAll(".exhibition-card").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-ex-id");
        const ex = exhibitions.find((e) => e.id === id);
        if (ex) openModal(modalContentExhibition(ex), { sectionId: "exhibitions", itemId: ex.id });
      });
    });
  }

  // --- Section: Audiodevout (YouTube) ---
  function renderAudiodevout() {
    const container = document.querySelector('[data-section="audiodevout"]');
    if (!container) return;
    if (!audiodevoutWorks.length) {
      container.innerHTML = "<p class=\"card-meta\">No Audiodevout content listed.</p>";
      return;
    }
    container.innerHTML = audiodevoutWorks
      .map((item) => {
        const videoUrl = firstVideoUrl(item);
        const embed = videoUrl ? youtubeEmbedUrl(videoUrl) : null;
        const mediaHTML = embed
          ? `<div class="card-media card-embed"><iframe src="${esc(
              embed
            )}" title="Audiodevout video" loading="lazy" allowfullscreen></iframe></div>`
          : cardMediaHTML(item);
        const metaLines = item.medium ? [item.medium] : [];
        const body = cardBodyHTML(item, metaLines);
        return `<article class="card card-embed" data-id="${esc(item.id)}">${mediaHTML}${body}</article>`;
      })
      .join("");
  }

  // --- Section: Asymmetrica (Bandcamp) ---
  function renderAsymmetrica() {
    const container = document.querySelector('[data-section="asymmetrica"]');
    if (!container) return;
    if (!asymmetricaWorks.length) {
      container.innerHTML = "<p class=\"card-meta\">No Asymmetrica tracks listed.</p>";
      return;
    }
    container.innerHTML = asymmetricaWorks
      .map((item) => {
        const tracks = item.bandcampTracks || [];
        const firstTrack = tracks[0];
        const embedSrc = firstTrack ? bandcampEmbedUrl(firstTrack.trackId) : null;
        let embedHTML = "";
        if (embedSrc) {
          embedHTML = `<div class="bandcamp-embed"><iframe src="${esc(embedSrc)}" title="${esc(firstTrack.title || "")}"></iframe></div>`;
        }
        const metaLines = item.medium ? [item.medium] : [];
        const body = cardBodyHTML(item, metaLines);
        const bodyInner = body.replace(/<\/?div[^>]*class="card-body"[^>]*>/g, "").replace(/<\/div>\s*$/, "");
        return `<article class="card" data-id="${esc(item.id)}"><div class="card-body">${bodyInner}${embedHTML}</div></article>`;
      })
      .join("");
  }

  // --- Section: Digital Art ---
  function renderDigitalArt() {
    const container = document.querySelector('[data-section="digital-art"]');
    if (!container) return;
    if (!digitalArtWorks.length) {
      container.innerHTML = "<p class=\"card-meta\">No digital art listed.</p>";
      return;
    }
    container.innerHTML = digitalArtWorks
      .map((item) => {
        const media = cardMediaHTML(item);
        const metaLines = item.medium ? [item.medium] : [];
        const body = cardBodyHTML(item, metaLines);
        return `<article class="card" data-id="${esc(item.id)}">${media}${body}</article>`;
      })
      .join("");

    container.querySelectorAll(".card").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        const item = digitalArtWorks.find((w) => w.id === id);
        if (item) openModal(modalContentWork(item), { sectionId: "digital-art", itemId: item.id });
      });
    });
  }

  // --- Section: Archive (writing + docs) ---
  function renderArchive() {
    const container = document.querySelector('[data-section="archive"]');
    if (!container) return;
    const writing = (data.projects && data.projects.writing) || [];
    const docItems = writing.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description || doc.fullDescription,
      themes: doc.themes,
      url: doc.urls && doc.urls.pdf ? doc.urls.pdf : null,
      label: "PDF",
    }));
    const seenUrls = new Set(docItems.map((d) => d.url).filter(Boolean));
    works.forEach((w) => {
      if (w.urls && w.urls.pdf && !seenUrls.has(w.urls.pdf)) {
        seenUrls.add(w.urls.pdf);
        docItems.push({
          id: w.id,
          title: w.title,
          description: w.descriptionShort || w.descriptionLong,
          themes: w.themes,
          url: w.urls.pdf,
          label: "PDF",
        });
      }
    });
    exhibitions.forEach((ex) => {
      if (ex.urls && ex.urls.pdf && !seenUrls.has(ex.urls.pdf)) {
        seenUrls.add(ex.urls.pdf);
        docItems.push({
          id: ex.id + "-pdf",
          title: ex.title + " (PDF)",
          description: ex.description,
          url: ex.urls.pdf,
          label: "PDF",
        });
      }
    });

    if (!docItems.length) {
      container.innerHTML = "<p class=\"card-meta\">No documents in archive.</p>";
      return;
    }
    container.innerHTML = `<div class="gallery">${docItems
      .map(
        (doc) => {
          const url = doc.url;
          const linkHTML = url ? `<a href="${esc(url)}" class="card-cta" target="_blank" rel="noopener">${esc(doc.label || "Open PDF")}</a>` : "";
          return `
        <article class="card card-doc">
          <div class="card-body">
            <h3 class="card-title">${esc(doc.title || "")}</h3>
            ${doc.description ? `<p class="card-meta">${esc(String(doc.description).slice(0, 180))}${String(doc.description).length > 180 ? "…" : ""}</p>` : ""}
            ${doc.themes ? `<p class="card-meta">${esc(typeof doc.themes === "string" ? doc.themes : (Array.isArray(doc.themes) ? doc.themes.join(", ") : ""))}</p>` : ""}
            ${linkHTML}
          </div>
        </article>`;
        }
      )
      .join("")}</div>`;
    const cards = container.querySelectorAll(".card-doc");
    cards.forEach((el, index) => {
      const doc = docItems[index];
      el.addEventListener("click", (e) => {
        if (e.target.closest(".card-cta")) return; // let the PDF link behave normally
        if (!doc) return;
        openModal(modalContentDoc(doc));
      });
    });
  }

  // --- Section: About / CV ---
  function renderAbout() {
    const container = document.querySelector('[data-section="about"]');
    if (!container) return;
    const about = data.contact && data.contact.about;
    const cv = data.contact && data.contact.cv;
    const social = (data.contact && data.contact.social) || [];

    let html = '<div class="about-grid"><div class="about-profile">';
    if (about && about.image) {
      html += `<img src="${esc(about.image)}" alt="" class="about-image" loading="lazy" />`;
    }
    if (about && about.description) {
      html += `<div class="about-statement">${about.description.replace(/\n/g, "<br>")}</div>`;
    }
    html += "</div><div class=\"about-cv\">";

    if (cv) {
      if (cv.education && cv.education.length) {
        html += '<div class="cv-block"><h3 class="cv-block-title">Education</h3>';
        cv.education.forEach((e) => {
          html += `<div class="cv-item"><div class="cv-item-title">${esc(e.degree || "")}</div><div class="cv-item-meta"><span>${esc(e.institution || "")}</span><span>${esc(e.period || "")}</span><span>${esc(e.location || "")}</span></div></div>`;
        });
        html += "</div>";
      }
      if (cv.skills) {
        const s = cv.skills;
        html += '<div class="cv-block"><h3 class="cv-block-title">Skills & interests</h3><div class="cv-item">';
        if (s.general && s.general.length) html += `<p class="card-meta">${esc(s.general.join(", "))}</p>`;
        if (s.interests && s.interests.length) html += `<p class="card-meta">${esc(s.interests.join(", "))}</p>`;
        if (s.technologies && s.technologies.length) html += `<p class="card-meta">${esc(s.technologies.join(", "))}</p>`;
        html += "</div></div>";
      }
      if (cv.workExperience && cv.workExperience.length) {
        html += '<div class="cv-block"><h3 class="cv-block-title">Experience</h3>';
        cv.workExperience.forEach((w) => {
          html += `<div class="cv-item"><div class="cv-item-title">${esc(w.title || "")}</div><div class="cv-item-meta"><span>${esc(w.company || "")}</span><span>${esc(w.period || "")}</span><span>${esc(w.location || "")}</span></div></div>`;
        });
        html += "</div>";
      }
    }

    html += "</div></div>";

    if (social.length) {
      html += '<div class="social-links">';
      social.forEach((s) => {
        html += `<a href="${esc(s.url)}" class="social-link" target="_blank" rel="noopener">${esc(s.name)}</a>`;
      });
      html += "</div>";
    }
    container.innerHTML = html;
  }

  // --- Modal close button and backdrop ---
  function bindModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;
    const closeBtn = modal.querySelector(".modal-close");
    const backdrop = modal.querySelector(".modal-backdrop");
    const close = () => closeModal();
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") close();
    });
  }

  // --- Nav as section filter (single-page, page-like views) ---
  function bindNav() {
    const links = document.querySelectorAll('.main-nav a[href^="#"]');
    const sections = Array.from(document.querySelectorAll("main .section"));
    const hero = document.querySelector(".hero");

    function activateSection(id, options) {
      const updateHash = options && options.updateHash === false ? false : true;
      currentSectionId = id || currentSectionId;

      sections.forEach((sec) => {
        if (!sec.id) return;
        sec.style.display = sec.id === id ? "block" : "none";
      });

      if (hero) {
        hero.style.display = id === "home" || id === "works" ? "block" : "none";
      }

      links.forEach((a) => {
        const dataSection = a.getAttribute("data-section");
        const href = a.getAttribute("href") || "";
        const targetId = dataSection || (href.startsWith("#") ? href.slice(1).split("/")[0] : "");
        a.classList.toggle("is-active", targetId === id);
      });

      if (updateHash) {
        try {
          sessionStorage.setItem("portfolioSection", id);
        } catch (e) {}
        const hash = "#" + id;
        if (window.location.hash !== hash) {
          window.history.replaceState(null, "", hash);
        }
      }
    }

    function parseHash() {
      const raw = (window.location.hash || "").replace(/^#/, "");
      const [sectionId, itemId] = raw.split("/").filter(Boolean);
      return { sectionId: sectionId || null, itemId: itemId || null };
    }

    function applyStateFromHash() {
      const { sectionId, itemId } = parseHash();
      let id = sectionId;
      if (!id) {
        try {
          id = sessionStorage.getItem("portfolioSection");
        } catch (e) {}
        id = id || "works";
      }

      activateSection(id, { updateHash: !sectionId });

      const modal = document.getElementById("modal");
      const modalOpen = modal && modal.getAttribute("aria-hidden") === "false";

      if (itemId && sectionId) {
        const content = getModalContentBySectionAndId(sectionId, itemId);
        if (content) {
          openModal(content, { sectionId: sectionId, itemId: itemId });
        } else {
          window.history.replaceState(null, "", "#" + sectionId);
        }
      } else if (modalOpen) {
        closeModal();
      }
    }

    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        let id = (href.slice(1) || "").split("/")[0];
        if (!id) return;
        e.preventDefault();
        const modal = document.getElementById("modal");
        if (modal && modal.getAttribute("aria-hidden") === "false") {
          closeModal();
        }
        activateSection(id);

        const nav = document.querySelector(".main-nav");
        const toggle = document.querySelector(".nav-toggle");
        if (nav && toggle && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    window.addEventListener("hashchange", applyStateFromHash);

    applyStateFromHash();
  }

  // --- Mobile nav toggle ---
  function bindNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.hidden = false;
    });
  }

  // --- Init ---
  function init() {
    updateThemeFromTime();
    // Refresh theme roughly once a minute for smooth temporal drift
    setInterval(updateThemeFromTime, 60 * 1000);

    renderHero();
    renderWorks();
    renderPerformance();
    renderExhibitions();
    renderAudiodevout();
    renderAsymmetrica();
    renderDigitalArt();
    renderArchive();
    renderAbout();
    bindModal();
    bindNav();
    bindNavToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
