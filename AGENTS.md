# AGENTS.md — Maintainer guide for atharvagupta.net

This document is for **AI agents and future maintainers** editing [atharvagupta.net](https://atharvagupta.net/). Read this before changing content, layout, SEO, or build scripts.

**Repo:** `audiodevout/audiodevout.github.io` · **Custom domain:** `atharvagupta.net` (see `CNAME`) · **Stack:** static HTML/CSS/JS on GitHub Pages · **CMS:** Decap CMS at `/admin/`

---

## Mental model

```
data/*.json          ← source of truth (edited via CMS or by hand)
       ↓
npm run build        ← build-data + generate-work-pages
       ↓
┌──────────────────────────────────────────────────────────────┐
│ js/portfolioData.parts.js   (bundled JSON for file://)       │
│ work/<id>/index.html        (91 static work pages)           │
│ index.html / about.html     (SEO snapshots via markers)      │
│ sitemap.xml, robots.txt                                      │
└──────────────────────────────────────────────────────────────┘
       ↓
Browser loads portfolioData.js → window.portfolioData → render.js fills DOM
```

**Two layers of content:**

1. **Build-time static HTML** — baked into `index.html`, `about.html`, and `work/<id>/index.html` for SEO crawlers and first paint.
2. **Runtime JS** — `render.js` / `gallery.js` / `work-page.js` replace or enhance DOM after `portfolio:ready`.

If you add homepage/list content, update **both** the build script (`scripts/generate-work-pages.js`) and the runtime renderer (`js/render.js`) unless they share the same grouping logic intentionally duplicated.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local server at http://localhost:8080 |
| `npm run build` | **Run before every deploy** after data/CMS changes |
| `npm run build-data` | Only bundles `data/*.json` → `js/portfolioData.parts.js` |
| `npm run generate-work-pages` | Work pages, sitemap, robots, homepage/about SEO snapshots |
| `npm run verify-work-pages` | Sanity checks for work pages + homepage SEO |
| `npm run generate-images` | Image pipeline (Sharp) — see script header |
| `npm run generate-gallery-thumbs` | Gallery thumbnail generation |

**After any CMS publish or edit to `data/*.json`:** run `npm run build`, then commit generated files (`js/portfolioData.parts.js`, `work/`, `index.html` markers, `sitemap.xml`, `robots.txt`).

---

## Source of truth: `data/`

All portfolio content lives in JSON files. Each file wraps items in `{ "items": [ ... ] }` except `profile.json`.

| File | CMS collection | Maps to `portfolioData` | Used on |
|---|---|---|---|
| `data/installations.json` | Installations | `projects.installations` | Home list, work pages |
| `data/performance.json` | Performance | `projects.performance` | Home list, work pages |
| `data/sound.json` | Sound | `projects.soundInstallations` | Home list (Sound group) |
| `data/visual.json` | Visual & Tutorials | `projects.drawings` | Home list, gallery, work pages |
| `data/writing.json` | Writing | `projects.writing` | Archive, work pages |
| `data/exhibitions.json` | Exhibitions | `exhibitions` | Exhibitions page, work pages |
| `data/links.json` | Social Links | `contact.social` | About, homepage footer |
| `data/profile.json` | Profile | `contact.about`, `contact.cv`, `pageContent.home` | About, SEO intro |

### Item fields (projects & exhibitions)

Common fields across project types:

| Field | Purpose |
|---|---|
| `id` | **Unique slug** — becomes URL `work/<id>/`. Never change after publish without redirect. |
| `title` | Display name |
| `category` | Group label on home list (e.g. `"TouchDesigner Tutorials"`, `"VISUAL RESEARCH"`) |
| `color` | Accent token: `glacier`, `crimson`, `violet`, `amber`, `cerulean`, `electric-lime`, `saffron`, `neon-magenta`, `graphite` |
| `description` | Short text — meta description source, list cards, work page intro fallback |
| `fullDescription` | Long text — work page body when JS loads |
| `images` | Array of paths like `"./assets/images/..."` |
| `videos` | YouTube URLs or local `./assets/video/...` paths |
| `youtubeDate` | `YYYYMMDD` — sorts TouchDesigner Tutorials newest first |
| `urls.page` | If set, item **skips** auto work-page generation (external page, e.g. `./thesis/`) |
| `urls.pdf`, `urls.link`, etc. | Extra links rendered on work detail |
| `bandcampTracks` | `[{ title, trackId, url }]` — embeds on work pages |
| `showInGallery` | Default true; set false to exclude from gallery masonry |
| `num_images_maingallery` | Limit images per item in gallery |
| `featured` | Boolean flag in unified `works` array |

Exhibition-specific: `date`, `venue`, `location`, `role` (shown as category on exhibition work pages).

Profile-specific (`data/profile.json`):

| Field | Purpose |
|---|---|
| `home.title`, `home.subtitle` | Legacy hero labels (utils.js still references if hero DOM exists) |
| `home.seoIntro` | **Array of paragraph strings** — build injects into homepage `<!-- GENERATE:home-intro -->` |
| `about.description` | About page bio — must start with "Atharva Gupta" for entity SEO |
| `about.image` | Profile photo on About page |
| `cv.education`, `cv.skills`, `cv.workExperience` | Rendered by `renderCVSection()` |

---

## Runtime data loader: `portfolioData.js`

- Loads `data/*.json` via fetch (live site) or `js/portfolioData.parts.js` (file:// fallback).
- Assembles `window.portfolioData` and fires `document` event **`portfolio:ready`**.
- All renderers listen for `portfolio:ready` or check `window.portfolioData` on init.

**Unified access:** `portfolioData.works` — flat array of all projects with normalized fields (`descriptionShort`, `descriptionLong`, `type`, etc.).

**Naming quirk:** `visual.json` → `projects.drawings` (historical name). `sound.json` → `projects.soundInstallations`.

---

## Pages and what renders them

| Page | HTML shell | JS fills | Key DOM ids |
|---|---|---|---|
| `index.html` | Header, static SEO, pre-built list | `renderMarqueesSection`, `renderListSection` | `#marquees-content`, `#list-content` |
| `gallery.html` | Empty masonry | `gallery.js` | `#gallery-root` |
| `exhibitions.html` | H2 heading | `renderExhibitionsSection` | `#exhibitions-content` |
| `archive.html` | H2 heading | `renderArchiveSection` | `#archive-content` |
| `about.html` | H2 + static bio snapshot | `renderAboutSection`, `renderCVSection` | `#about-content`, `#cv-content` |
| `work/<id>/index.html` | Full static article + SEO | `work-page.js` enhances media/body from live data | `#work-page[data-work-id]` |

### Home list grouping (`js/render.js` → `renderListSection`)

Order mirrors `scripts/generate-work-pages.js` → `buildHomeListHtml`:

1. **Works** — `installations` + `performance`
2. **Sound** — `soundInstallations`
3. **Visual categories** — `drawings` grouped by `category`, excluding `"VISUAL RESEARCH"`
4. TouchDesigner Tutorials sorted by `youtubeDate` desc

Home has two views toggled by `.view-toggle-button`: **list** (default) and **marquee** (`#marquees-content`).

### Gallery (`js/gallery.js`)

- Pulls items where `category === "VISUAL RESEARCH"` from `projects.drawings`.
- Uses full-res images; optional thumbs via `utils.getThumbSrc`.
- Click opens inline expand overlay (not lightbox.js on gallery page).

### Work pages

- **Template:** `work/_template.html` — do not edit generated `work/*/index.html` by hand.
- **Generator:** `scripts/generate-work-pages.js` reads all data files, writes one folder per `id`.
- **Enhancement:** `js/work-page.js` + `js/work-detail.js` add YouTube/Bandcamp/video, full description, metadata.
- **URLs:** `js/work-lookup.js` → `resolveWorkHref(item)` → `./work/<id>/` (or `urls.page` override).
- **Person entity:** work JSON-LD `creator` references `{ "@id": "https://atharvagupta.net/#person" }`.

---

## Build scripts

### `scripts/build-portfolio-data.js`

Bundles all `data/*.json` into:

- `js/portfolioData.parts.js` → `window.__PORTFOLIO_PARTS__`
- `portfolio/portfolioData.parts.js` → print portfolio subset

### `scripts/generate-work-pages.js`

Main build orchestrator. Also:

- **`writeHomePageSeo()`** — patches `index.html` markers:
  - `home-jsonld` — WebSite + Person `@graph`
  - `home-intro` — paragraphs from `profile.home.seoIntro`
  - `home-list` — static H2/H3 work list
  - `home-footer` — copyright + external links from `links.json`
- **`writeAboutPageSeo()`** — patches `about.html` markers:
  - `about-jsonld` — ProfilePage + Person
  - `about-content` — static bio paragraph
- Reads canonical base from `CNAME` (currently `https://atharvagupta.net`).
- Regenerates `sitemap.xml`, `robots.txt`.
- Removes stale `work/<id>/` dirs not in data.

**To change SEO metadata sitewide:** edit constants at top of `generate-work-pages.js` (`HOME_META_DESCRIPTION`, `PERSON_KNOWS_ABOUT`, etc.) and/or `index.html` static `<head>` tags, then rebuild.

### `scripts/verify-work-pages.js`

Checks work page count, canonical URLs, JSON-LD, script includes, homepage H1/canonical/JSON-LD/list, about ProfilePage.

---

## JavaScript modules

| File | Role |
|---|---|
| `portfolioData.js` | Load & assemble data; dispatch `portfolio:ready` |
| `js/render.js` | **Main DOM renderer** — home, exhibitions, archive, about, CV |
| `js/gallery.js` | Gallery masonry + expand viewer |
| `js/work-lookup.js` | Find item by id; build work URLs |
| `js/work-detail.js` | Shared media/body/meta rendering for work pages & lightbox |
| `js/work-page.js` | Work page progressive enhancement |
| `js/utils.js` | `esc`, `resolveAssetSrc`, `getSiteRoot`, `getThumbSrc`, hero init |
| `js/router.js` | Active nav link state |
| `js/nav.js` | Mobile nav toggle |
| `js/theme.js` | Light/dark mode |
| `js/marquee-lens.js` | Hover image preview on home list/marquee items |
| `js/scroll-reveal.js` | Scroll-triggered `.reveal` animations |
| `js/lightbox.js` | Legacy lightbox — **not** loaded on current listing pages |

**Event contract:** anything that needs data should wait for `portfolio:ready` or check `window.portfolioData`.

---

## CSS architecture

Load order on every page: `fonts.css` → `reset.css` → `tokens.css` → `layout.css` → `components.css` → `animations.css` (+ page-specific).

| File | Contains |
|---|---|
| `tokens.css` | CSS variables: colors, fonts, spacing, theme |
| `layout.css` | `.main`, `.section`, hero layout, section spacing |
| `components.css` | Header, nav, work list, cards, about grid, gallery, footer, `.site-brand__title`, `.visually-hidden` |
| `animations.css` | Hero animations, scroll reveals |
| `work/work-page.css` | Work detail page only |
| `fonts.css` | `@font-face` declarations |

Theme tokens live in `:root` / `[data-theme="light"]` in `tokens.css`. Accent colors map via `render.js` → `accentVar()`.

---

## SEO conventions (homepage & entity)

Name-first branding — **"Atharva Gupta"** in:

- `<title>`, `<h1>`, `WebSite.name`, `og:site_name`, `Person.name`

Discipline keywords (*new media artist*, *sculptor*) go in meta description, `Person.knowsAbout`, `home.seoIntro`, `about.description` — **not** in the title.

- No Twitter Card tags on homepage (by design).
- Work pages still have Twitter meta from `_template.html`.
- Hreflang not used (English-only site).

---

## CMS (Decap)

- Config: `admin/config.yml`
- UI: `admin/index.html` → `/admin/` on deployed site
- Backend: GitHub repo `audiodevout/audiodevout.github.io`, branch `main`
- Uploaded images go to `assets/images/`

**CMS does not run the build.** After publishing in CMS, run `npm run build` locally and commit outputs.

Note: `admin/config.yml` may not expose every field (e.g. `home.seoIntro`) — add fields to CMS config if editors need UI access, or edit `profile.json` directly.

---

## Assets

```
assets/
  images/          ← CMS uploads + organized project folders
    installations/<id>/
    visual/<id>/
    exhibitions/<id>/
    profile/
    thumbs/        ← generated thumbnails
  video/
  documents/       ← PDFs linked via urls.pdf
  icons/           ← favicon, webmanifest, apple-touch-icon
  fonts/           ← self-hosted webfonts
```

Image paths in JSON use `./assets/...` relative form. Build scripts normalize to absolute URLs for OG/JSON-LD.

---

## Other subprojects (leave alone unless asked)

| Path | Purpose |
|---|---|
| `thesis/` | Separate thesis microsite (`Instruments for Becoming`) |
| `portfolio/` | Print portfolio data bundle |
| `6969osc/` | TouchDesigner OSC tool subsite |
| `admin/` | Decap CMS |
| `scripts/*.py` | YouTube metadata utilities — optional maintenance |

---

## Common tasks

### Add a new work item

1. Add entry to the correct `data/*.json` with unique `id`.
2. Add images under `assets/images/...`.
3. `npm run build`
4. Verify: `node scripts/verify-work-pages.js`
5. Commit data + generated `work/<id>/` + updated `index.html` list snapshot.

### Change homepage SEO text

1. Edit `data/profile.json` → `home.seoIntro` and/or static tags in `index.html` `<head>`.
2. `npm run build`

### Change how home list is grouped

1. Edit `js/render.js` → `renderListSection`
2. Edit `scripts/generate-work-pages.js` → `buildHomeListHtml` (keep in sync)
3. `npm run build`

### Change work page layout/SEO template

1. Edit `work/_template.html` only
2. `npm run generate-work-pages`

### Point item to external page instead of work page

Set `urls.page` on the item (e.g. `"./thesis/"`). Generator skips it; link must be wired manually in render code if it should appear in lists.

---

## Do not

- Edit generated `work/<id>/index.html` files by hand — changes will be overwritten.
- Edit `js/portfolioData.parts.js` by hand — run `npm run build-data`.
- Remove `<!-- GENERATE:*:start/end -->` markers from `index.html` or `about.html`.
- Duplicate work page logic — extend `work-detail.js` and `_template.html`.
- Assume crawlers run JS — static HTML in markers and work pages is intentional for SEO.

---

## Quick file index

```
index.html              Homepage shell + SEO markers
about.html              Entity home + ProfilePage schema
gallery.html            Visual research gallery
exhibitions.html        Exhibition list
archive.html            Writing + thesis link
portfolioData.js        Client-side data loader
data/                   All content JSON
js/render.js            Primary UI renderer
js/work-lookup.js       ID → URL resolution
scripts/generate-work-pages.js   Build: work pages + SEO snapshots
scripts/build-portfolio-data.js  Build: JSON bundle
scripts/verify-work-pages.js     CI-style checks
work/_template.html     Work page template
admin/config.yml        Decap CMS field definitions
CNAME                   Custom domain for GitHub Pages
sitemap.xml             Generated — do not hand-edit
robots.txt              Generated — do not hand-edit
```

When in doubt: **find the data in `data/`**, **find the renderer in `js/`**, **find the static output in `scripts/generate-work-pages.js`**, then **`npm run build`**.
