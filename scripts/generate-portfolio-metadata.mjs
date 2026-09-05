/**
 * One-off draft generator for data/portfolioVideos.ts — scans the portfolio
 * video folders and writes a starting point with placeholder titles (guessed
 * from the filename) for a human to correct. Re-running overwrites the file,
 * so only run this before hand-editing titles, never after.
 */
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUT_FILE = path.join(process.cwd(), 'data', 'portfolioVideos.ts');
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);

// Folder → category slug, exactly matching app/portfolio/page.tsx today.
const FOLDER_MAP = [
  { folder: 'Low mb videos/Coffee', category: 'coffee' },
  { folder: 'Low mb videos/Gym', category: 'gym' },
  { folder: 'Low mb videos/bts', category: 'bts' },
  { folder: 'Low mb videos/Influencer', category: 'influencer' },
  { folder: 'Low mb videos/Jewelery', category: 'jewelery' },
  { folder: 'Low mb videos/real estate', category: 'realestate' },
];

function collectVideoFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectVideoFiles(full));
    else if (VIDEO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) results.push(full);
  }
  return results;
}

function toPublicUrl(absolutePath) {
  const relative = path.relative(PUBLIC_DIR, absolutePath);
  return '/' + relative.split(path.sep).map(encodeURIComponent).join('/');
}

/** Placeholder title guess — title-cased filename, nothing smarter than that. */
function guessTitle(filePath) {
  return path.basename(filePath, path.extname(filePath))
    .replace(/[-_]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function slugId(category, filePath) {
  const base = path.basename(filePath, path.extname(filePath)).toLowerCase();
  return `${category}-${base}`;
}

const entries = [];
for (const { folder, category } of FOLDER_MAP) {
  const dir = path.join(PUBLIC_DIR, folder);
  for (const filePath of collectVideoFiles(dir)) {
    entries.push({
      id: slugId(category, filePath),
      src: toPublicUrl(filePath),
      title: guessTitle(filePath),
      category,
    });
  }
}

const lines = [];
lines.push("// AUTO-GENERATED DRAFT — titles are placeholder guesses from the filename.");
lines.push("// Replace every `title` below with a clean, human-written display title,");
lines.push("// then delete this comment block. Re-running scripts/generate-portfolio-metadata.mjs");
lines.push("// will overwrite this file, so do that BEFORE hand-editing, never after.");
lines.push("import type { CategorySlug } from './portfolio';");
lines.push('');
lines.push('export interface PortfolioVideoMeta {');
lines.push('  id: string;');
lines.push('  src: string;');
lines.push('  title: string;');
lines.push('  category: CategorySlug;');
lines.push('}');
lines.push('');
lines.push('export const PORTFOLIO_VIDEOS: PortfolioVideoMeta[] = [');
for (const entry of entries) {
  lines.push(`  { id: ${JSON.stringify(entry.id)}, src: ${JSON.stringify(entry.src)}, title: ${JSON.stringify(entry.title)}, category: ${JSON.stringify(entry.category)} },`);
}
lines.push('];');
lines.push('');

fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
console.log(`Wrote ${entries.length} entries to ${path.relative(process.cwd(), OUT_FILE)}`);

// Print a readable review table grouped by category.
const byCategory = new Map();
for (const entry of entries) {
  if (!byCategory.has(entry.category)) byCategory.set(entry.category, []);
  byCategory.get(entry.category).push(entry);
}
for (const [category, list] of byCategory) {
  console.log(`\n=== ${category} (${list.length}) ===`);
  for (const entry of list) {
    console.log(`  ${entry.id.padEnd(45)} "${entry.title}"`);
  }
}
