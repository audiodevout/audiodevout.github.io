// Shared by the popup, the background worker and the content script.

// YouTube's auto-generated "News" topic channel. Same ID worldwide; the
// edition shown is picked by the gl (region) parameter.
const NEWS_CHANNEL = "https://www.youtube.com/channel/UCYfdidRxbB8Qhf0Nx7ioOYw";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "IE", name: "Ireland" },
  { code: "IN", name: "India" },
  { code: "PK", name: "Pakistan" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "TR", name: "Türkiye" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "DE", name: "Germany" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "IT", name: "Italy" },
  { code: "PL", name: "Poland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
];

// The plain News page with no region forced: whatever edition YouTube picks
// for you. This is the "News" button YouTube took out of the sidebar.
const LOCAL = { code: "", name: "Your region" };

// Newspaper icon used in the sidebar section and the popup.
const NEWS_ICON_PATH =
  "M4 4h13v16H5a1 1 0 0 1-1-1V4zm2 3v2h9V7H6zm0 4v2h9v-2H6zm0 4v2h6v-2H6zM18 8h2v11a1 1 0 0 1-1 1h-1V8z";

// Codes shown in the News section of YouTube's sidebar ("" = Your region).
const DEFAULT_SIDEBAR = ["", "US"];

// hl stays English so YouTube's own buttons and menus don't change language
// per tab; the news videos themselves still come from that country's edition.
function newsUrl(code) {
  return code ? `${NEWS_CHANNEL}?gl=${code}&hl=en` : NEWS_CHANNEL;
}

async function getSidebar() {
  const { sidebar, pinned } = await chrome.storage.sync.get(["sidebar", "pinned"]);
  if (sidebar) return sidebar;
  // Earlier versions stored starred countries as "pinned".
  if (pinned) return ["", ...pinned];
  return DEFAULT_SIDEBAR;
}

function setSidebar(sidebar) {
  return chrome.storage.sync.set({ sidebar });
}

// Starred countries are listed first in the popup.
async function getStarred() {
  const { starred } = await chrome.storage.sync.get({ starred: [] });
  return starred;
}

function setStarred(starred) {
  return chrome.storage.sync.set({ starred });
}
