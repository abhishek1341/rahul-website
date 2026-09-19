import fs from 'fs';
import path from 'path';
import {
  backupsDir,
  contentFilePaths,
  isProductionBuild,
} from './paths';
import { restoreUploads } from '@/lib/admin/uploads';
import { recoverUploadedMedia } from './recover';
import { createSeedContent } from './seed';
import type { SiteContent } from './types';

const MAX_BACKUPS = 30;

function isContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false;
  const record = value as SiteContent;
  return Array.isArray(record.logos) && Array.isArray(record.videos) && Boolean(record.stats);
}

function readFile(file: string): { content: SiteContent; mtime: number } | null {
  if (!fs.existsSync(file)) return null;
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!isContent(parsed)) return null;
    return { content: parsed, mtime: fs.statSync(file).mtimeMs };
  } catch {
    return null;
  }
}

function adminScore(content: SiteContent): number {
  const uploadedLogos = content.logos.filter((logo) => logo.src.includes('/uploads/')).length;
  const described = content.videos.filter((video) => video.description.trim()).length;
  const customTitles = content.videos.filter((video) => !video.id.startsWith('coffee-') && video.title.trim()).length;
  return uploadedLogos * 20 + described * 10 + customTitles + content.logos.length + content.videos.length;
}

function writeFile(file: string, content: SiteContent): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
}

function writeBackup(content: SiteContent): void {
  const dir = backupsDir();
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFile(path.join(dir, `site-content-${stamp}.json`), content);

  const backups = fs
    .readdirSync(dir)
    .filter((name) => name.startsWith('site-content-') && name.endsWith('.json'))
    .sort();
  for (const extra of backups.slice(0, Math.max(0, backups.length - MAX_BACKUPS))) {
    fs.unlinkSync(path.join(dir, extra));
  }
}

function persist(content: SiteContent, backup: boolean): void {
  if (isProductionBuild()) return;
  for (const file of contentFilePaths()) writeFile(file, content);
  if (backup) writeBackup(content);
}

export function readSiteContent(): SiteContent {
  restoreUploads();

  const candidates = contentFilePaths()
    .map(readFile)
    .flatMap((entry) => (entry ? [entry] : []));

  candidates.sort((a, b) => adminScore(b.content) - adminScore(a.content) || b.mtime - a.mtime);

  const chosen = candidates[0]?.content ?? createSeedContent();
  const recovered = recoverUploadedMedia(chosen);
  const changed = JSON.stringify(recovered) !== JSON.stringify(chosen);
  const missingCopy = contentFilePaths().some((file) => !fs.existsSync(file));

  if (!isProductionBuild() && (changed || missingCopy || candidates.length === 0)) {
    persist(recovered, changed && candidates.length > 0);
  }
  return recovered;
}

export function writeSiteContent(content: SiteContent): SiteContent {
  persist(content, true);
  return content;
}

export function updateSiteContent(updater: (current: SiteContent) => SiteContent): SiteContent {
  return writeSiteContent(updater(readSiteContent()));
}
