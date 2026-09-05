/**
 * Normalises raw client logo artwork into the folder the site actually reads.
 *
 *   public/Logo for website/  (raw drops)  ->  public/client-logos/  (served)
 *
 * The raw files are 1500x1500 canvases in which the artwork fills anywhere from
 * 6% to 78% of the frame, so rendering them directly makes some brands look
 * tiny next to others no matter what the CSS does. Trimming to the real
 * bounding box lets the marquee's `object-fit: contain` give every logo the
 * same optical height.
 *
 * Run after adding or replacing artwork:  node scripts/prepare-client-logos.mjs
 *
 * Uses the `sharp` that ships with Next's image optimiser, so there's no extra
 * runtime dependency — nothing in the app imports this script.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = path.join(process.cwd(), 'public', 'Logo for website');
const OUT_DIR = path.join(process.cwd(), 'public', 'client-logos');

// Displayed at ~150px wide, so 600px covers 2x retina with room to spare.
const MAX_EDGE = 600;
// Tolerance for "blank" edge pixels; nudged off 0 to absorb anti-aliased
// halos and near-white JPEG fringing.
const TRIM_THRESHOLD = 6;

const RASTER = /\.(png|jpe?g|webp|avif)$/i;
const PASSTHROUGH = /\.svg$/i;

fs.mkdirSync(OUT_DIR, { recursive: true });

const sources = fs
  .readdirSync(SOURCE_DIR, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      !entry.name.startsWith('._') &&
      (RASTER.test(entry.name) || PASSTHROUGH.test(entry.name)),
  )
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

// Drop stale output so a removed source logo can't linger on the site.
for (const stale of fs.readdirSync(OUT_DIR)) {
  const stillSourced = sources.some(
    (name) => path.parse(name).name === path.parse(stale).name,
  );
  if (!stillSourced) {
    fs.unlinkSync(path.join(OUT_DIR, stale));
    console.log(`removed stale  ${stale}`);
  }
}

let written = 0;

for (const name of sources) {
  const src = path.join(SOURCE_DIR, name);

  if (PASSTHROUGH.test(name)) {
    fs.copyFileSync(src, path.join(OUT_DIR, name));
    console.log(`copied         ${name} (vector, no trim)`);
    written++;
    continue;
  }

  const out = path.join(OUT_DIR, `${path.parse(name).name}.png`);
  const before = await sharp(src).metadata();

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .trim({ threshold: TRIM_THRESHOLD })
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer({ resolveWithObject: true });

  fs.writeFileSync(out, data);
  written++;

  const savedKb = Math.round((fs.statSync(src).size - data.length) / 1024);
  console.log(
    `trimmed        ${name.padEnd(9)} ${before.width}x${before.height} -> ` +
      `${String(info.width).padStart(4)}x${String(info.height).padStart(4)}` +
      `  (-${savedKb}KB)`,
  );
}

console.log(`\n${written} logo(s) written to public/client-logos/`);
