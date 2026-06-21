/**
 * portfolioData.js - Portfolio Content Loader
 *
 * PURPOSE: Fetches content from data/*.json (editable via Decap CMS) and
 *   assembles the window.portfolioData object consumed by the renderer.
 *
 * STRUCTURE (assembled shape, unchanged from the previous inline data):
 *   - projects: soundInstallations, performance, installations, drawings, writing
 *   - exhibitions: chronological list of exhibitions/presentations
 *   - contact: about, cv, social links
 *   - pageContent: homepage content
 *   - works: derived unified array for normalized access
 *
 * On success, sets window.portfolioData and dispatches the "portfolio:ready"
 * event on document. On failure, falls back to an empty-but-valid structure.
 */

(function () {
  "use strict";

  function dataUrl(filename) {
    return new URL("data/" + filename, window.location.href).href;
  }

  var DATA_FILES = {
    sound: dataUrl("sound.json"),
    performance: dataUrl("performance.json"),
    installations: dataUrl("installations.json"),
    visual: dataUrl("visual.json"),
    writing: dataUrl("writing.json"),
    exhibitions: dataUrl("exhibitions.json"),
    links: dataUrl("links.json"),
    profile: dataUrl("profile.json"),
  };

  function fetchJson(url) {
    if (window.location.protocol === "file:") {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
          if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (parseError) {
              reject(parseError);
            }
          } else {
            reject(new Error("Failed to load " + url + " (" + xhr.status + ")"));
          }
        };
        xhr.onerror = function () {
          reject(new Error("Failed to load " + url));
        };
        xhr.send();
      });
    }

    return fetch(url, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + url + " (" + res.status + ")");
      return res.json();
    });
  }

  function items(obj) {
    return obj && Array.isArray(obj.items) ? obj.items : [];
  }

  function assemble(parts) {
    var profile = parts.profile || {};

    var portfolioData = {
      projects: {
        soundInstallations: items(parts.sound),
        performance: items(parts.performance),
        installations: items(parts.installations),
        drawings: items(parts.visual),
        writing: items(parts.writing),
      },
      exhibitions: items(parts.exhibitions),
      contact: {
        about: profile.about || {},
        cv: profile.cv || {},
        description: profile.contactDescription || "",
        social: items(parts.links),
      },
      pageContent: {
        home: profile.home || {},
      },
    };

    // Derive a unified works array for normalized access
    var works = [];

    var pushProjects = function (list, type, status) {
      if (!Array.isArray(list)) return;
      list.forEach(function (item) {
        if (!item || !item.id) return;
        works.push({
          id: item.id,
          title: item.title,
          type: type,
          status: status || null,
          medium: item.medium || null,
          dimensions: item.dimensions || null,
          descriptionShort: item.description || null,
          descriptionLong: item.fullDescription || item.description || null,
          images: Array.isArray(item.images) ? item.images : [],
          videos: Array.isArray(item.videos) ? item.videos : [],
          bandcampTracks: Array.isArray(item.bandcampTracks) ? item.bandcampTracks : [],
          tags: item.tags || null,
          themes: item.themes || null,
          urls: item.urls || null,
          featured: Boolean(item.featured),
          showInMainGallery: item.showInGallery !== false,
          mainGalleryLimit:
            typeof item.num_images_maingallery === "number" && item.num_images_maingallery > 0
              ? item.num_images_maingallery
              : null,
        });
      });
    };

    pushProjects(portfolioData.projects.installations, "installation", "major");
    pushProjects(portfolioData.projects.performance, "performance", "major");
    pushProjects(portfolioData.projects.soundInstallations, "sound", "major");
    pushProjects(portfolioData.projects.drawings, "visual", "experiment");
    pushProjects(portfolioData.projects.writing, "text", "major");

    portfolioData.works = works;

    // Normalize exhibitions with derived year where possible
    portfolioData.exhibitions = portfolioData.exhibitions.map(function (ex) {
      var normalized = {};
      for (var k in ex) {
        if (Object.prototype.hasOwnProperty.call(ex, k)) normalized[k] = ex[k];
      }
      if (ex.date && typeof ex.date === "string") {
        var yearMatch = ex.date.match(/(20\d{2})/);
        normalized.year = yearMatch ? parseInt(yearMatch[1], 10) : null;
      } else {
        normalized.year = null;
      }
      return normalized;
    });

    return portfolioData;
  }

  function fallbackData() {
    return {
      projects: {
        drawings: [],
        installations: [],
        performance: [],
        soundInstallations: [],
        writing: [],
      },
      exhibitions: [],
      contact: {
        description: "Portfolio data failed to load. Please refresh the page.",
        social: [],
      },
      pageContent: {
        home: {
          title: "Experimental Systems",
          subtitle: "Loading Error",
          description: "Please refresh the page.",
        },
      },
      works: [],
    };
  }

  function publish(data) {
    if (typeof window !== "undefined") {
      window.portfolioData = data;
    }
    if (typeof document !== "undefined" && typeof document.dispatchEvent === "function") {
      document.dispatchEvent(new CustomEvent("portfolio:ready", { detail: data }));
    }
  }

  var keys = Object.keys(DATA_FILES);

  Promise.all(
    keys.map(function (key) {
      return fetchJson(DATA_FILES[key]);
    })
  )
    .then(function (results) {
      var parts = {};
      keys.forEach(function (key, i) {
        parts[key] = results[i];
      });
      publish(assemble(parts));
    })
    .catch(function (error) {
      console.error("Error loading portfolio data:", error);
      publish(fallbackData());
    });
})();
