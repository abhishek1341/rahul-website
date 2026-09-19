import fs from 'fs';
import path from 'path';
import { shouldBypassImageOptimizer } from '@/lib/media/image-src';
import { persistentUploadsRoot, publicUploadsRoot, uploadDirCandidates } from '@/lib/content/paths';

export const MAX_LOGO_BYTES = 4 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const LOGO_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif']);
export const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime']);

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function extensionFor(file: File, fallback: string): string {
  const fromName = path.extname(file.name).toLowerCase();
  if (fromName && fromName.length <= 6) return fromName;
  return fallback;
}

export function isUploadUrl(src: string): boolean {
  return shouldBypassImageOptimizer(src);
}

export function publicUrlToAbsolute(src: string): string {
  const segments = src.replace(/^\/+/, '').split('/').map(decodeURIComponent);
  return path.join(process.cwd(), 'public', ...segments);
}

function uploadAbsolutePaths(src: string): string[] {
  if (!isUploadUrl(src)) return [];
  const relative = src.replace(/^\/uploads\//, '').split('/').map(decodeURIComponent);
  if (relative.some((part) => part === '..')) return [];
  return uploadDirCandidates().map((root) => path.join(root, ...relative));
}

function writeToUploadRoots(folder: 'logos' | 'videos', filename: string, buffer: Buffer): void {
  for (const root of uploadDirCandidates()) {
    const dir = path.join(root, folder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);
  }
}

export function restoreUploads(): void {
  if (process.env.SUNTRIX_SKIP_UPLOAD_MIRROR === '1') return;
  const publicRoot = publicUploadsRoot();
  const persistentRoot = persistentUploadsRoot();
  if (publicRoot === persistentRoot) return;

  for (const folder of ['logos', 'videos'] as const) {
    const fromPersistent = path.join(persistentRoot, folder);
    const fromPublic = path.join(publicRoot, folder);
    fs.mkdirSync(fromPersistent, { recursive: true });
    fs.mkdirSync(fromPublic, { recursive: true });

    copyMissing(fromPersistent, fromPublic);
    copyMissing(fromPublic, fromPersistent);
  }
}

function copyMissing(sourceDir: string, destDir: string): void {
  if (!fs.existsSync(sourceDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(sourceDir)) {
    const source = path.join(sourceDir, name);
    const dest = path.join(destDir, name);
    if (!fs.statSync(source).isFile() || fs.existsSync(dest)) continue;
    fs.copyFileSync(source, dest);
  }
}

export function resolveUploadFile(src: string): string | null {
  if (!isUploadUrl(src)) return null;
  const relative = decodeURIComponent(src).replace(/^\/uploads\//, '');
  const parts = relative.split('/').filter(Boolean);
  if (parts.some((part) => part === '..' || part.includes('\0'))) return null;

  for (const root of uploadDirCandidates()) {
    const absolute = path.resolve(path.join(root, ...parts));
    if (!absolute.startsWith(path.resolve(root))) continue;
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) return absolute;
  }
  return null;
}

export function removeUpload(src: string): void {
  for (const absolute of uploadAbsolutePaths(src)) {
    if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
  }
}

export async function saveUpload(
  file: File,
  folder: 'logos' | 'videos',
  id: string,
  fallbackExt: string,
): Promise<string> {
  const ext = extensionFor(file, fallbackExt);
  const filename = `${id}${ext}`;
  writeToUploadRoots(folder, filename, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${filename}`;
}

export async function optimizeLogo(file: File, id: string): Promise<string> {
  const filename = `${id}.png`;
  const buffer = Buffer.from(await file.arrayBuffer());
  let output = buffer;

  try {
    const sharp = (await import('sharp')).default;
    const dir = path.join(publicUploadsRoot(), 'logos');
    fs.mkdirSync(dir, { recursive: true });
    const absolute = path.join(dir, filename);
    await sharp(buffer)
      .ensureAlpha()
      .trim({ threshold: 6 })
      .resize({
        width: 600,
        height: 600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png({ compressionLevel: 8 })
      .toFile(absolute);
    output = fs.readFileSync(absolute);
  } catch {
    output = buffer;
  }

  writeToUploadRoots('logos', filename, output);
  return `/uploads/logos/${filename}`;
}
