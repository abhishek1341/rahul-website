import fs from 'fs';
import path from 'path';
import { PORTFOLIO_VIDEOS } from '@/data/portfolioVideos';
import type { SiteContent, SiteLogo } from './types';

const LOGO_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);

function toPublicUrl(absolutePath: string): string {
  const publicDir = path.join(process.cwd(), 'public');
  const relative = path.relative(publicDir, absolutePath);
  return `/${relative.split(path.sep).map(encodeURIComponent).join('/')}`;
}

function nameFromFilename(filename: string): string {
  const base = path
    .basename(filename, path.extname(filename))
    .replace(/^logo\s*[-_]?\s*/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  return /^\d+$/.test(base) ? `Brand ${base}` : base;
}

function scanLogos(): SiteLogo[] {
  const dir = path.join(process.cwd(), 'public', 'client-logos');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        !entry.name.startsWith('._') &&
        LOGO_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((name, index) => {
      const brand = nameFromFilename(name);
      return {
        id: `logo-seed-${index + 1}`,
        src: toPublicUrl(path.join(dir, name)),
        name: brand,
        alt: `${brand} logo`,
      };
    });
}

export function createSeedContent(): SiteContent {
  return {
    logos: scanLogos(),
    videos: PORTFOLIO_VIDEOS.map((video) => ({
      id: video.id,
      src: video.src,
      title: video.title,
      description: '',
      category: video.category,
    })),
    stats: {
      portfolio: [
        { id: 'videos-delivered', value: 500, suffix: '+', label: 'Videos Delivered', visible: true },
        { id: 'total-views', value: 120, suffix: 'M+', label: 'Total Views', visible: true },
        { id: 'brands-served', value: 60, suffix: '+', label: 'Brands Served', visible: true },
      ],
      cases: [
        {
          id: 'glowhaus',
          metrics: [
            { id: 'reel-views', value: 128, suffix: 'K', label: 'Reel Views', subtext: 'In the first 30 days', visible: true },
            { id: 'engagement', value: 245, suffix: '%', label: 'Engagement', subtext: 'Compared to previous month', visible: true },
          ],
        },
        {
          id: 'theo',
          metrics: [
            { id: 'followers', value: 18, suffix: 'K', label: 'Followers', subtext: 'In six weeks', visible: true },
            { id: 'engagement', value: 156, suffix: '%', label: 'Engagement', subtext: 'Compared to previous month', visible: true },
          ],
        },
      ],
    },
  };
}
