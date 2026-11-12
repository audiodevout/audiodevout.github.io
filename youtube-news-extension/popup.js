// Click a country to open its News page. Ctrl/Cmd-click or middle-click opens
// it in a background tab and keeps the popup open, for opening several.
// The star moves a country to the top of the list. The switch decides whether
// it gets a link in the News section of YouTube's sidebar; switched-on
// countries open together with the footer button or Alt+Shift+N.

const list = document.getElementById("list");
const search = document.getElementById("search");
const footer = document.getElementById("footer");
const openAllBtn = document.getElementById("open-all");

const STAR_ON = "M12 17.3 18.2 21l-1.6-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.4 14l-1.6 7z";
const STAR_OFF =
  "M22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.4 14l-1.6 7L12 17.3 18.2 21l-1.6-7L22 9.2zM12 15.4l-3.8 2.3 1-4.3-3.3-2.9 4.4-.4L12 6.1l1.7 4 4.4.4-3.3 2.9 1 4.3L12 15.4z";

let sidebar = [];
let starred = [];

// Your region first, then starred countries, then the rest; each group A-Z.
function sortedCountries() {
  const byName = (a, b) => a.name.localeCompare(b.name);
  return [
    LOCAL,
    ...COUNTRIES.filter((c) => starred.includes(c.code)).sort(byName),
    ...COUNTRIES.filter((c) => !starred.includes(c.code)).sort(byName),
  ];
}

function open(codes, background) {
  // The background worker opens the tabs: the popup closes as soon as a new
  // tab takes focus, which would cut off anything still running here.
  chrome.runtime.sendMessage({ type: "open", codes, background });
  if (!background) window.close();
}

function icon(d) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", d);
  svg.append(path);
  return svg;
}

function buildStar(c) {
  const star = document.createElement("button");
  star.type = "button";
  star.className = "star";
  star.dataset.code = c.code;
  const on = starred.includes(c.code);
  star.setAttribute("aria-pressed", String(on));
  star.title = on ? `Unstar ${c.name}` : `Star ${c.name} (keeps it at the top)`;
  star.append(icon(on ? STAR_ON : STAR_OFF));
  star.addEventListener("click", () => {
    starred = on ? starred.filter((s) => s !== c.code) : [...starred, c.code];
    save(() => setStarred(starred));
    render();
    // The row has moved; keep keyboard focus on its star.
    list.querySelector(`.star[data-code="${c.code}"]`)?.focus();
  });
  return star;
}

function buildRow(c) {
  const li = document.createElement("li");
  li.className = "row";

  const openBtn = document.createElement("button");
  openBtn.type = "button";
  openBtn.className = "open";
  openBtn.title = `Open ${c.name} News`;
  // Country code on the left, where YouTube puts an item's icon; "Your region"
  // gets the same newspaper icon as the sidebar.
  const code = document.createElement("span");
  code.className = "code";
  if (c.code) {
    code.textContent = c.code;
  } else {
    code.classList.add("icon");
    code.append(icon(NEWS_ICON_PATH));
  }
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = c.name;
  openBtn.append(code, name);
  openBtn.addEventListener("click", (e) => open([c.code], e.ctrlKey || e.metaKey || e.shiftKey));
  openBtn.addEventListener("auxclick", (e) => {
    if (e.button === 1) open([c.code], true);
  });

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "switch";
  toggle.setAttribute("role", "switch");
  const update = () => {
    const on = sidebar.includes(c.code);
    toggle.setAttribute("aria-checked", String(on));
    toggle.title = on ? `Hide ${c.name} from the YouTube sidebar` : `Show ${c.name} in the YouTube sidebar`;
  };
  update();
  toggle.addEventListener("click", () => {
    sidebar = sidebar.includes(c.code) ? sidebar.filter((s) => s !== c.code) : [...sidebar, c.code];
    save(() => setSidebar(sidebar));
    update();
    updateFooter();
  });

  // "Your region" is always first, so it has no star; a spacer keeps the
  // switches lined up.
  let star;
  if (c.code) {
    star = buildStar(c);
  } else {
    star = document.createElement("span");
    star.className = "star";
  }

  li.append(openBtn, star, toggle);
  return li;
}

function render() {
  const q = search.value.trim().toLowerCase();
  list.replaceChildren();

  const rows = sortedCountries().filter(
    (c) => !q || c.name.toLowerCase().includes(q) || (c.code && c.code.toLowerCase().includes(q))
  );
  if (rows.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No matching countries";
    list.append(li);
    return;
  }

  list.append(...rows.map(buildRow));
}

function updateFooter() {
  footer.hidden = sidebar.length < 2;
  openAllBtn.textContent = `Open all ${sidebar.length}`;
}

function rowButtons() {
  return [...list.querySelectorAll("button.open")];
}

search.addEventListener("input", render);

// Typing then Enter opens the first match; arrow keys move into the list.
search.addEventListener("keydown", (e) => {
  const first = rowButtons()[0];
  if (e.key === "Enter" && first) {
    e.preventDefault();
    first.dispatchEvent(new MouseEvent("click", { ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey }));
  } else if (e.key === "ArrowDown" && first) {
    e.preventDefault();
    first.focus();
  }
});

list.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  const buttons = rowButtons();
  const i = buttons.indexOf(document.activeElement);
  if (i === -1) return;
  e.preventDefault();
  if (e.key === "ArrowDown") buttons[Math.min(i + 1, buttons.length - 1)].focus();
  else if (i === 0) search.focus();
  else buttons[i - 1].focus();
});

openAllBtn.addEventListener("click", () => open(sidebar, false));

// Saving can fail (for example if Chrome's sync storage is full); the popup
// keeps working with what's on screen either way.
async function save(write) {
  try {
    await write();
  } catch (err) {
    console.error("News Button: couldn't save settings", err);
  }
}

(async () => {
  try {
    [sidebar, starred] = await Promise.all([getSidebar(), getStarred()]);
  } catch (err) {
    console.error("News Button: couldn't load settings", err);
  }
  render();
  updateFooter();
  search.focus();
})();
