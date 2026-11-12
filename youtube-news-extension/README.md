# News Button for YouTube

YouTube took the News button out of its sidebar, but the News page still
works. This Chrome extension puts a News section back in the sidebar, between
You and Explore, and lets you open the News page for other countries too.

- Click the extension icon, then a country, to open that country's News page.
- Ctrl-click or middle-click to open it in a background tab and keep the list open.
- The switch next to a country shows it in the sidebar's News section.
- "Open all" (or Alt+Shift+N) opens every country that's switched on.

It only stores which countries you've switched on. See [PRIVACY.md](PRIVACY.md).

## Install from source

1. Go to `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and pick this folder.

## Build the store zip

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

This writes `dist/news-button-<version>.zip`. Store images and icons are
redrawn with `store/render-assets.ps1` (needs Microsoft Edge). Listing text
for the Chrome Web Store is in [STORE_LISTING.md](STORE_LISTING.md).

## Files

| File | What it does |
| --- | --- |
| `countries.js` | Country list, News page links and saved settings (shared by everything) |
| `popup.html/.css/.js` | The list you get from the toolbar icon |
| `content.js/.css` | The News section in YouTube's sidebar |
| `background.js` | Opens tabs and handles the Alt+Shift+N shortcut |
| `fonts/` | Roboto (Apache 2.0, see `fonts/LICENSE.txt`) |

Not affiliated with YouTube or Google.
