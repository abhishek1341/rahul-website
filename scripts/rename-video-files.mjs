/**
 * Renames every video file under public/ whose name contains a space,
 * parenthesis, or uppercase letter to a clean lowercase-hyphenated name.
 * Folder names are left untouched — only the video files themselves.
 *
 * No source file hardcodes these filenames (lib/portfolio-videos.ts scans
 * folders dynamically), except data/heroStories.ts, which is updated
 * separately by hand to match this script's mapping.
 *
 * Usage:
 *   node scripts/rename-video-files.mjs            # dry run — prints the mapping only
 *   node scripts/rename-video-files.mjs --apply     # actually renames the files on disk
 */
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);
const APPLY = process.argv.includes('--apply');

function collectVideoFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectVideoFiles(full));
    else if (VIDEO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) results.push(full);
  }
  return results;
}

function needsRename(basename) {
  return /[ ()]/.test(basename) || /[A-Z]/.test(basename);
}

function slugify(nameWithoutExt) {
  return nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// Instagram-download-tool artifacts (SaveClip.App_... / Saveclip.App ...) carry
// no real information — a raw slugify turns them into 100+ char hash strings,
// which isn't "clean" no matter the casing. These get a short, sequential
// name instead, scoped per folder for stable, collision-free numbering.
function isDownloadArtifact(basename) {
  return /^saveclip\.app/i.test(basename);
}

const files = collectVideoFiles(PUBLIC_DIR).sort((a, b) => a.localeCompare(b, 'en'));

const byFolder = new Map();
for (const filePath of files) {
  const dir = path.dirname(filePath);
  if (!byFolder.has(dir)) byFolder.set(dir, []);
  byFolder.get(dir).push(filePath);
}

const mapping = [];

for (const [dir, folderFiles] of byFolder) {
  const folderSlugBase = slugify(path.basename(dir)) || 'clip';
  const usedNames = new Set();
  let artifactIndex = 0;

  for (const filePath of folderFiles) {
    const base = path.basename(filePath, path.extname(filePath));
    if (!needsRename(path.basename(filePath))) usedNames.add(base.toLowerCase());
  }

  for (const filePath of folderFiles) {
    const ext = path.extname(filePath).toLowerCase();
    const base = path.basename(filePath, path.extname(filePath));
    const originalBasename = path.basename(filePath);

    if (!needsRename(originalBasename)) continue;

    let slug;
    if (isDownloadArtifact(base)) {
      artifactIndex++;
      slug = `${folderSlugBase}-clip-${String(artifactIndex).padStart(2, '0')}`;
    } else {
      slug = slugify(base) || `${folderSlugBase}-clip`;
    }

    let finalSlug = slug;
    let n = 2;
    while (usedNames.has(finalSlug)) {
      finalSlug = `${slug}-${n}`;
      n++;
    }
    usedNames.add(finalSlug);

    mapping.push({ dir, from: filePath, to: path.join(dir, `${finalSlug}${ext}`) });
  }
}

for (const { from, to } of mapping) {
  const relFrom = path.relative(PUBLIC_DIR, from);
  const relTo = path.relative(PUBLIC_DIR, to);
  console.log(`${relFrom}\n  -> ${relTo}`);

  if (APPLY) {
    fs.renameSync(from, to);

    // Carry the cached ffprobe dimensions sidecar along, if present, so the
    // aspect-ratio probe doesn't need to re-run ffprobe after the rename.
    const dimsFrom = `${from}.dims.json`;
    const dimsTo = `${to}.dims.json`;
    if (fs.existsSync(dimsFrom)) fs.renameSync(dimsFrom, dimsTo);
  }
}

console.log(`\n${APPLY ? 'Renamed' : 'Would rename'} ${mapping.length} files.`);
if (!APPLY) console.log('Re-run with --apply to actually rename these files.');
