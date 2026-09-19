import fs from 'fs';
import path from 'path';
import { uploadDirCandidates } from './paths';
import type { SiteContent, SiteLogo, SiteVideo } from './types';

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const VIDEO_EXT = new Set(['.mp4', '.mov']);

/** Names we already saw on production before a deploy wiped site-content.json. */
const KNOWN_UPLOAD_NAMES: Record<string, string> = {
  'logo-mu8cseyq-52zlss': 'sprite',
};

function humanize(filename: string): string {
  const known = KNOWN_UPLOAD_NAMES[filename];
  if (known) return known;
  return filename.replace(/^logo-/, '').replace(/[-_]+/g, ' ').trim() || filename;
}

function listFiles(dir: string, extensions: Set<string>): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);
}

export function recoverUploadedMedia(content: SiteContent): SiteContent {
  const knownLogoSrc = new Set(content.logos.map((logo) => logo.src));
  const knownVideoSrc = new Set(content.videos.map((video) => video.src));
  const logos: SiteLogo[] = [...content.logos];
  const videos: SiteVideo[] = [...content.videos];

  for (const root of uploadDirCandidates()) {
    for (const name of listFiles(path.join(root, 'logos'), IMAGE_EXT)) {
      const src = `/uploads/logos/${name}`;
      if (knownLogoSrc.has(src)) continue;
      knownLogoSrc.add(src);
      const id = path.basename(name, path.extname(name));
      const brand = humanize(id);
      logos.push({ id, src, name: brand, alt: `${brand} logo` });
    }

    for (const name of listFiles(path.join(root, 'videos'), VIDEO_EXT)) {
      const src = `/uploads/videos/${name}`;
      if (knownVideoSrc.has(src)) continue;
      knownVideoSrc.add(src);
      const id = path.basename(name, path.extname(name));
      const title = humanize(id);
      videos.push({ id, src, title, description: '', category: 'product' });
    }
  }

  return { ...content, logos, videos };
}
