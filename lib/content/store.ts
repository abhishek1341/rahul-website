import fs from 'fs';
import path from 'path';
import { createSeedContent } from './seed';
import type { SiteContent } from './types';

const CONTENT_PATH = path.join(process.cwd(), 'data', 'site-content.json');

function isContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false;
  const record = value as SiteContent;
  return Array.isArray(record.logos) && Array.isArray(record.videos) && Boolean(record.stats);
}

export function readSiteContent(): SiteContent {
  if (!fs.existsSync(CONTENT_PATH)) {
    const seeded = createSeedContent();
    writeSiteContent(seeded);
    return seeded;
  }

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
    if (isContent(parsed)) return parsed;
  } catch {
    // Fall through and re-seed rather than crash the public site.
  }

  const seeded = createSeedContent();
  writeSiteContent(seeded);
  return seeded;
}

export function writeSiteContent(content: SiteContent): SiteContent {
  fs.mkdirSync(path.dirname(CONTENT_PATH), { recursive: true });
  fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  return content;
}

export function updateSiteContent(updater: (current: SiteContent) => SiteContent): SiteContent {
  return writeSiteContent(updater(readSiteContent()));
}
