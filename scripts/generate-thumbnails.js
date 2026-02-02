/**
 * generate-thumbnails.js
 *
 * Creates downscaled thumbnail copies (≈0.25x resolution) of all images
 * in `assets/images/` and writes them to `assets/images/thumbs/`.
 *
 * Usage:
 *   1) Install dependency (once):
 *        npm install sharp
 *   2) Run the script from the repo root:
 *        node scripts/generate-thumbnails.js
 *
 * Thumbnails are named exactly like the source files, but live in
 * `assets/images/thumbs/`. The front-page gallery is wired to prefer
 * these thumbnails and will automatically fall back to full-res images
 * if a thumb is missing.
 */

const fs = require("fs")
const path = require("path")

const sharp = require("sharp")

const ROOT = path.join(__dirname, "..")
const SRC_DIR = path.join(ROOT, "assets", "images")
const OUT_DIR = path.join(SRC_DIR, "thumbs")

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"])

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true })
}

async function createThumbnail(inputPath, outputPath) {
  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    const width = metadata.width || 0
    const height = metadata.height || 0

    // Scale to ≈ 0.25 of each dimension (so ~1/16 pixels),
    // but never upscale small images.
    const targetWidth = Math.max(1, Math.floor(width * 0.25))
    const targetHeight = Math.max(1, Math.floor(height * 0.25))

    await image
      .resize({
        width: targetWidth,
        height: targetHeight,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 75 })
      .toFile(outputPath)

    console.log(`✓ Thumbnail created: ${path.basename(outputPath)}`)
  } catch (err) {
    console.error(`✗ Failed to create thumbnail for ${inputPath}:`, err.message)
  }
}

async function main() {
  await ensureDir(OUT_DIR)

  const files = await fs.promises.readdir(SRC_DIR)
  const tasks = []

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!IMAGE_EXTS.has(ext)) continue

    const srcPath = path.join(SRC_DIR, file)
    const outPath = path.join(OUT_DIR, file.replace(/\.(png|webp)$/i, ".jpg"))

    // Skip if thumbnail already exists
    if (fs.existsSync(outPath)) {
      console.log(`• Skipping existing thumbnail: ${path.basename(outPath)}`)
      continue
    }

    tasks.push(createThumbnail(srcPath, outPath))
  }

  await Promise.all(tasks)
  console.log("Done. Thumbnails are in assets/images/thumbs/")
}

main().catch((err) => {
  console.error("Unexpected error while generating thumbnails:", err)
  process.exit(1)
})

