# Chrome Web Store listing

Everything to paste into the [Developer Dashboard](https://chrome.google.com/webstore/devconsole),
tab by tab.

## Package

Upload `dist/news-button-<version>.zip` (run `build.ps1` to make it).

## Store listing

**Name:** News Button for YouTube (comes from the manifest)

**Summary:** comes from the manifest `description`:

> YouTube removed the News button but the page still works. This brings it back and lets you open other countries' News too.

**Description:**

```
YouTube took the News button out of its sidebar. The News page is still there, with the same headlines and videos, but there's no button to get to it anymore. There's also no way to see what the News page looks like in other countries.

So I made this. It adds a News section back to the sidebar, between You and Explore. Click the extension icon and you get a list of countries. Click one and its News page opens. Each country has a switch, and the ones you switch on show up in that sidebar section. If you've got a few switched on, "Open all" opens them all at once, or you can press Alt+Shift+N.

The only thing the extension saves is which countries you've switched on. It doesn't send anything anywhere.

If a tab still shows your own country's news, YouTube is probably using the Location setting on your account, which you can change from your profile menu. A VPN set to that country also works.

This isn't made by YouTube or Google.
```

**Category:** Lifestyle → News & Weather (or Tools)

**Language:** English

**Graphic assets** (all in `store/`, made by `store/render-assets.ps1`):

| Field | File |
| --- | --- |
| Store icon (128×128) | `icons/icon128.png` |
| Screenshot (1280×800) | `store/screenshot-1-1280x800.png` |
| Small promo tile (440×280) | `store/promo-small-440x280.png` |

## Privacy practices

**Single purpose:**

```
Brings back the News button in YouTube's sidebar and opens YouTube's News page for the countries the user picks.
```

**Permission justifications:**

`storage`
```
Saves which countries the user has switched on, so the sidebar section and the popup remember them.
```

Host permission (`https://www.youtube.com/*`, from the content script)
```
Adds a News section with links to YouTube's News page into the sidebar on youtube.com. It only looks at the sidebar's links to decide where to put the section. Nothing is read from the page beyond that, and nothing is sent anywhere.
```

**Are you using remote code?** No, I am not using remote code.

**Data usage:** tick none of the data types. The extension collects none of them.

Then tick all three statements:

- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** link to `PRIVACY.md` in the public GitHub repo, for example
`https://github.com/<your-username>/news-button-for-youtube/blob/main/PRIVACY.md`.
Fill in your contact email in `PRIVACY.md` before you publish.

## Distribution

Public, all regions (or Unlisted if you only want people with the link).

## Updating later

Bump `version` in `manifest.json`, run `build.ps1`, and upload the new zip.
The store rejects a zip whose version isn't higher than the published one.
