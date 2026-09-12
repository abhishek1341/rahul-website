/**
 * Server-only utility — runs at build / request time in Server Components.
 * Converts the admin content store (titles, descriptions, categories) into
 * PortfolioItem objects, adding only the one thing that can't be hand-authored:
 * each clip's source aspect ratio, probed from the actual file so the grid
 * knows whether it needs the letterboxed (blurred-backdrop + contain) treatment.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import type { CategorySlug, PortfolioItem } from '@/data/portfolio';
import { readSiteContent } from '@/lib/content/store';

const ALL_TAB_FEATURED: CategorySlug[] = ['coffee', 'bts', 'gym', 'influencer'];

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * All-tab order: one Coffee, one BTS, one Gym, one Influencer on top, then
 * every remaining clip (all categories) in a fresh random mix — so the grid
 * never opens as a wall of a single brand.
 */
export function orderForAllTab(items: PortfolioItem[]): PortfolioItem[] {
  const used = new Set<string>();
  const featured: PortfolioItem[] = [];

  for (const slug of ALL_TAB_FEATURED) {
    const pool = items.filter((item) => item.category === slug);
    if (pool.length === 0) continue;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    featured.push(pick);
    used.add(pick.id);
  }

  return [...featured, ...shuffle(items.filter((item) => !used.has(item.id)))];
}

/**
 * Source width/height via ffprobe, cached next to the video so repeat builds
 * don't re-invoke ffprobe for files that haven't changed. Returns null if
 * ffprobe is unavailable or the file can't be read — callers fall back to
 * the plain cover crop in that case, same as before this existed.
 */
function probeAspectRatio(videoAbsPath: string): number | null {
  const cachePath = `${videoAbsPath}.dims.json`;

  if (fs.existsSync(cachePath)) {
    try {
      const { width, height } = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      if (width > 0 && height > 0) return width / height;
    } catch {
      // Corrupt cache — fall through and re-probe.
    }
  }

  try {
    const out = execFileSync(
      'ffprobe',
      [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height',
        '-of', 'csv=p=0',
        videoAbsPath,
      ],
      { encoding: 'utf8' },
    ).trim();

    const [width, height] = out.split(',').map(Number);
    if (!(width > 0) || !(height > 0)) return null;

    fs.writeFileSync(cachePath, JSON.stringify({ width, height }));
    return width / height;
  } catch {
    return null;
  }
}

/** Convert a metadata `src` (URL-encoded, e.g. "/Low%20mb%20videos/...") back
 * into a real filesystem path under `public/` for ffprobe to read. */
function publicUrlToAbsolutePath(src: string): string {
  const segments = src.replace(/^\/+/, '').split('/').map(decodeURIComponent);
  return path.join(process.cwd(), 'public', ...segments);
}

/**
 * Build every PortfolioItem from the admin content store — titles,
 * descriptions and categories are never inferred from a filename or folder.
 */
export function loadPortfolioItems(client = 'Suntrix Media'): PortfolioItem[] {
  return readSiteContent().videos.flatMap((meta) => {
    const absPath = publicUrlToAbsolutePath(meta.src);
    if (!fs.existsSync(absPath)) return [];

    const sourceAspect = probeAspectRatio(absPath) ?? undefined;

    return [{
      id: meta.id,
      title: meta.title,
      description: meta.description,
      client,
      category: meta.category,
      previewSrc: meta.src, // doubles as the grid preview loop
      fullSrc: meta.src,
      durationSec: 0, // unknown without video parsing
      sourceAspect,
    }];
  });
}
