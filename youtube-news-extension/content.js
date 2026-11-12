// Adds a "News" section to YouTube's left sidebar, between the You section and
// Explore, with a link per country switched on in the popup ("" = Your region,
// the plain News page YouTube took out of the sidebar).
// LOCAL, newsUrl and getSidebar come from countries.js.
//
// YouTube enforces Trusted Types, so elements are built with createElement
// rather than innerHTML (which would throw).

const SECTION_ID = "ytnews-section";
const SVG_NS = "http://www.w3.org/2000/svg";

let sidebar = [];

function buildEntry(code) {
  const link = document.createElement("a");
  link.className = "ytnews-entry";
  link.href = newsUrl(code);
  link.title = code ? `YouTube News (${code} edition)` : "YouTube News";

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", NEWS_ICON_PATH);
  svg.appendChild(path);

  const label = document.createElement("span");
  const country = COUNTRIES.find((c) => c.code === code);
  label.textContent = country ? country.name : "Your region";

  link.append(svg, label);
  return link;
}

function buildSection() {
  const section = document.createElement("div");
  section.id = SECTION_ID;
  const title = document.createElement("h3");
  title.className = "ytnews-title";
  title.textContent = "News";
  section.append(title, ...sidebar.map(buildEntry));
  return section;
}

// Finds the sidebar section our News section should follow. Matched by link
// targets rather than headings, which are translated.
function findAnchor(sections) {
  const renderers = [...sections.children].filter((el) => el.id !== SECTION_ID);
  const youSection = renderers.find((el) => el.querySelector('a[href^="/feed/history"], a[href^="/feed/you"]'));
  if (youSection) return { after: youSection };
  const explore = renderers.find((el) => el.querySelector('a[href^="/gaming"], a[href^="/feed/storefront"]'));
  if (explore) return { before: explore };
  return renderers[0] ? { after: renderers[0] } : null;
}

function inject() {
  const sections = document.querySelector("ytd-guide-renderer #sections");
  if (!sections) return;
  const existing = document.getElementById(SECTION_ID);
  const anchor = findAnchor(sections);
  if (sidebar.length === 0 || !anchor) {
    existing?.remove();
    return;
  }
  // Already in place: nothing to do. (YouTube can reshuffle its sections, so
  // check the position, not just that it exists.)
  if (existing && (anchor.after ? anchor.after.nextElementSibling === existing : anchor.before.previousElementSibling === existing)) {
    return;
  }
  const section = existing || buildSection();
  if (anchor.after) anchor.after.after(section);
  else anchor.before.before(section);
}

// Rebuild the section when the switches change in the popup.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync" || !changes.sidebar) return;
  sidebar = changes.sidebar.newValue || [];
  document.getElementById(SECTION_ID)?.remove();
  inject();
});

// YouTube is a single-page app that rebuilds the sidebar as you navigate,
// so keep watching and put the section back whenever it goes missing.
let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    inject();
  });
}).observe(document.documentElement, { childList: true, subtree: true });

(async () => {
  try {
    sidebar = await getSidebar();
    inject();
  } catch (err) {
    console.error("News Button: couldn't load settings", err);
  }
})();
