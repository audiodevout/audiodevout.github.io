importScripts("countries.js");

// One new tab per country. The first gets focus unless asked to open in the
// background (Ctrl/middle-click in the popup).
async function openCountries(codes, background) {
  try {
    await Promise.all(
      codes.map((code, i) => chrome.tabs.create({ url: newsUrl(code), active: !background && i === 0 }))
    );
  } catch (err) {
    console.error("News Button: couldn't open tabs", err);
  }
}

// From the popup.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "open") openCountries(msg.codes, msg.background);
});

// Alt+Shift+N skips the popup and opens everything in the sidebar's News section.
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "open-sidebar") return;
  try {
    await openCountries(await getSidebar(), false);
  } catch (err) {
    console.error("News Button: couldn't load settings", err);
  }
});
