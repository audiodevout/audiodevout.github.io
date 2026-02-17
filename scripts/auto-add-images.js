/**
 * auto-add-images.js
 *
 * Super quick workflow:
 * 1) Drop images into `assets/images/` named like:  <projectId>-1.jpg, <projectId>-2.png, ...
 *    Example:  rain-reminders-1.jpg, rain-reminders-2.jpg
 * 2) Run: `node scripts/auto-add-images.js`
 * 3) This will update `portfolioData.js` to set `images: [...]` for any project ids that have matching files.
 *
 * Notes:
 * - Only updates `images:` arrays (does not touch videos/bandcamp).
 * - Uses natural sort, so -2 comes before -10.
 */

const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..")
const DATA_FILE = path.join(ROOT, "portfolioData.js")
const IMAGES_DIR = path.join(ROOT, "assets", "images")

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}

function isEscaped(source, i) {
  let bs = 0
  for (let j = i - 1; j >= 0 && source[j] === "\\"; j--) bs++
  return bs % 2 === 1
}

function findObjectStart(source, idIndex) {
  let inSingle = false
  let inDouble = false
  let inTemplate = false
  let inLineComment = false
  let inBlockComment = false

  let depth = 0
  for (let i = idIndex; i >= 0; i--) {
    const ch = source[i]
    const prev = i > 0 ? source[i - 1] : ""
    const next = i + 1 < source.length ? source[i + 1] : ""

    if (!inSingle && !inDouble && !inTemplate) {
      if (!inBlockComment && ch === "/" && next === "*") inBlockComment = true
      if (inBlockComment && prev === "*" && ch === "/") inBlockComment = false
      if (!inLineComment && ch === "/" && next === "/") inLineComment = true
      if (inLineComment && ch === "\n") inLineComment = false
    }
    if (inLineComment || inBlockComment) continue

    if (!inDouble && !inTemplate && ch === "'" && !isEscaped(source, i)) inSingle = !inSingle
    else if (!inSingle && !inTemplate && ch === `"` && !isEscaped(source, i)) inDouble = !inDouble
    else if (!inSingle && !inDouble && ch === "`" && !isEscaped(source, i)) inTemplate = !inTemplate

    if (inSingle || inDouble || inTemplate) continue

    if (ch === "}") depth++
    else if (ch === "{") {
      if (depth === 0) return i
      depth--
    }
  }
  return -1
}

function findMatchingBraceEnd(source, start) {
  let inSingle = false
  let inDouble = false
  let inTemplate = false
  let inLineComment = false
  let inBlockComment = false

  let depth = 0
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    const prev = i > 0 ? source[i - 1] : ""
    const next = i + 1 < source.length ? source[i + 1] : ""

    if (!inSingle && !inDouble && !inTemplate) {
      if (!inLineComment && !inBlockComment && ch === "/" && next === "/") {
        inLineComment = true
        i++
        continue
      }
      if (!inLineComment && !inBlockComment && ch === "/" && next === "*") {
        inBlockComment = true
        i++
        continue
      }
      if (inBlockComment && prev === "*" && ch === "/") {
        inBlockComment = false
        continue
      }
      if (inLineComment && ch === "\n") {
        inLineComment = false
        continue
      }
    }
    if (inLineComment || inBlockComment) continue

    if (!inDouble && !inTemplate && ch === "'" && !isEscaped(source, i)) inSingle = !inSingle
    else if (!inSingle && !inTemplate && ch === `"` && !isEscaped(source, i)) inDouble = !inDouble
    else if (!inSingle && !inDouble && ch === "`" && !isEscaped(source, i)) inTemplate = !inTemplate

    if (inSingle || inDouble || inTemplate) continue

    if (ch === "{") depth++
    else if (ch === "}") {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

function formatImagesArray(paths) {
  const lines = paths.map((p) => `            "${p}"`).join(",\n")
  return `images: [\n${lines}\n          ]`
}

function main() {
  const original = fs.readFileSync(DATA_FILE, "utf8")
  let updated = original

  const files = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : []
  const byId = new Map()

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!IMAGE_EXTS.has(ext)) continue
    const base = path.basename(file, ext)
    const dash = base.lastIndexOf("-")
    if (dash <= 0) continue
    const id = base.slice(0, dash)
    if (!byId.has(id)) byId.set(id, [])
    byId.get(id).push(`./assets/images/${file}`)
  }

  // Natural sort each id group
  for (const [id, arr] of byId.entries()) {
    byId.set(id, arr.sort(naturalSort))
  }

  const idRegex = /id:\s*"([^"]+)"/g
  let match
  let changedCount = 0

  while ((match = idRegex.exec(original)) !== null) {
    const id = match[1]
    const images = byId.get(id)
    if (!images || images.length === 0) continue

    const idIndex = updated.indexOf(`id: "${id}"`)
    if (idIndex === -1) continue

    const start = findObjectStart(updated, idIndex)
    if (start === -1) continue
    const end = findMatchingBraceEnd(updated, start)
    if (end === -1) continue

    let block = updated.slice(start, end + 1)

    const nextImages = formatImagesArray(images)
    if (block.includes("images:")) {
      block = block.replace(/images:\s*\[[\s\S]*?\]/, nextImages)
    } else {
      // Insert right after id line (keeps it near top)
      block = block.replace(/id:\s*"[^"]+",?/, (m) => `${m}\n          ${nextImages},`)
    }

    updated = updated.slice(0, start) + block + updated.slice(end + 1)
    changedCount++
  }

  if (updated !== original) {
    fs.writeFileSync(DATA_FILE, updated)
    console.log(`Updated images arrays for ${changedCount} project(s).`)
  } else {
    console.log("No changes. (No matching <id>-N.* files found, or already up to date.)")
  }
}

main()

