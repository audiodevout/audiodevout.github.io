const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../portfolioData.js");

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function isEscaped(source, i) {
  // true if source[i] is escaped by an odd number of backslashes immediately before it
  let bs = 0;
  for (let j = i - 1; j >= 0 && source[j] === "\\"; j--) bs++;
  return bs % 2 === 1;
}

function findObjectRange(source, idIndex) {
  // Find the `{ ... }` object that contains the `id:` occurrence at idIndex.
  // This is a lightweight brace matcher that skips strings and comments.
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  // Backwards pass: find start `{`
  let depth = 0;
  for (let i = idIndex; i >= 0; i--) {
    const ch = source[i];
    const prev = i > 0 ? source[i - 1] : "";
    const next = i + 1 < source.length ? source[i + 1] : "";

    // Comments (best-effort backwards)
    if (!inSingle && !inDouble && !inTemplate) {
      if (!inBlockComment && ch === "/" && next === "*") inBlockComment = true;
      if (inBlockComment && prev === "*" && ch === "/") inBlockComment = false;
      if (!inLineComment && ch === "/" && next === "/") inLineComment = true;
      if (inLineComment && ch === "\n") inLineComment = false;
    }
    if (inLineComment || inBlockComment) continue;

    // Strings (toggle on unescaped delimiters)
    if (!inDouble && !inTemplate && ch === "'" && !isEscaped(source, i)) inSingle = !inSingle;
    else if (!inSingle && !inTemplate && ch === `"` && !isEscaped(source, i)) inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === "`" && !isEscaped(source, i)) inTemplate = !inTemplate;

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === "}") depth++;
    else if (ch === "{") {
      if (depth === 0) return { start: i, end: -1 };
      depth--;
    }
  }

  return null;
}

function findMatchingBraceEnd(source, start) {
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  let depth = 0;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const prev = i > 0 ? source[i - 1] : "";
    const next = i + 1 < source.length ? source[i + 1] : "";

    // Enter/exit comments (forward)
    if (!inSingle && !inDouble && !inTemplate) {
      if (!inLineComment && !inBlockComment && ch === "/" && next === "/") {
        inLineComment = true;
        i++;
        continue;
      }
      if (!inLineComment && !inBlockComment && ch === "/" && next === "*") {
        inBlockComment = true;
        i++;
        continue;
      }
      if (inBlockComment && prev === "*" && ch === "/") {
        inBlockComment = false;
        continue;
      }
      if (inLineComment && ch === "\n") {
        inLineComment = false;
        continue;
      }
    }
    if (inLineComment || inBlockComment) continue;

    // Strings (toggle on unescaped delimiters)
    if (!inDouble && !inTemplate && ch === "'" && !isEscaped(source, i)) inSingle = !inSingle;
    else if (!inSingle && !inTemplate && ch === `"` && !isEscaped(source, i)) inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === "`" && !isEscaped(source, i)) inTemplate = !inTemplate;

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function extractArray(block, key) {
  const m = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  return m[1]
    .split("\n")
    .map(l => l.trim().replace(/["',]/g, ""))
    .filter(Boolean);
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

const original = fs.readFileSync(DATA_FILE, "utf8");
let updated = original;

const idRegex = /id:\s*"([^"]+)"/g;
let match;

let report = [];

while ((match = idRegex.exec(original)) !== null) {
  const id = match[1];

  const idIndex = updated.indexOf(`id: "${id}"`);
  if (idIndex === -1) continue;

  const range = findObjectRange(updated, idIndex);
  if (!range) continue;
  const end = findMatchingBraceEnd(updated, range.start);
  if (end === -1) continue;

  let block = updated.slice(range.start, end + 1);
  const blockStart = range.start;
  const startLine = lineNumberAt(updated, blockStart);

  let changed = false;
  let messages = [];

  // Sort images array if exists
  if (block.includes("images:")) {
    const before = extractArray(block, "images");
    const sorted = [...before].sort(naturalSort);
    if (JSON.stringify(before) !== JSON.stringify(sorted)) {
      block = block.replace(
        /images:\s*\[[\s\S]*?\]/,
        `images: [\n${sorted.map(i => `            "${i}"`).join(",\n")}\n          ]`
      );
      changed = true;
      messages.push(`images sorted (${sorted.length})`);
    }
  }

  // Sort videos array if exists
  if (block.includes("videos:")) {
    const before = extractArray(block, "videos");
    const sorted = [...before].sort(naturalSort);
    if (JSON.stringify(before) !== JSON.stringify(sorted)) {
      block = block.replace(
        /videos:\s*\[[\s\S]*?\]/,
        `videos: [\n${sorted.map(i => `            "${i}"`).join(",\n")}\n          ]`
      );
      changed = true;
      messages.push(`videos sorted (${sorted.length})`);
    }
  }

  if (changed) {
    updated = updated.slice(0, range.start) + block + updated.slice(end + 1);
    const endLine = startLine + block.split("\n").length;
    report.push({
      id,
      lines: `${startLine}–${endLine}`,
      messages
    });
  }
}

fs.writeFileSync(DATA_FILE, updated);

if (report.length === 0) {
  console.log("No changes detected. Arrays already sorted.");
} else {
  console.log("Portfolio sync report (arrays sorted):");
  report.forEach(r => {
    console.log(`• ${r.id} (lines ${r.lines})`);
    r.messages.forEach(m => console.log(`  - ${m}`));
  });
}