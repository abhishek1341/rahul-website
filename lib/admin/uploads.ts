import fs from 'fs';
import path from 'path';

export const MAX_LOGO_BYTES = 4 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const LOGO_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif']);
export const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime']);

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function extensionFor(file: File, fallback: string): string {
  const fromName = path.extname(file.name).toLowerCase();
  if (fromName && fromName.length <= 6) return fromName;
  return fallback;
}

export function isUploadUrl(src: string): boolean {
  return decodeURIComponent(src).startsWith('/uploads/');
}

export function publicUrlToAbsolute(src: string): string {
  const segments = src.replace(/^\/+/, '').split('/').map(decodeURIComponent);
  return path.join(process.cwd(), 'public', ...segments);
}

export function removeUpload(src: string): void {
  if (!isUploadUrl(src)) return;
  const absolute = publicUrlToAbsolute(src);
  const root = path.resolve(UPLOAD_ROOT);
  if (!path.resolve(absolute).startsWith(root)) return;
  if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
}

export async function saveUpload(
  file: File,
  folder: 'logos' | 'videos',
  id: string,
  fallbackExt: string,
): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, folder);
  fs.mkdirSync(dir, { recursive: true });
  const ext = extensionFor(file, fallbackExt);
  const filename = `${id}${ext}`;
  const absolute = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(absolute, buffer);
  return `/uploads/${folder}/${filename}`;
}

export async function optimizeLogo(file: File, id: string): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, 'logos');
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${id}.png`;
  const absolute = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const sharp = (await import('sharp')).default;
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
  } catch {
    fs.writeFileSync(absolute, buffer);
  }

  return `/uploads/logos/${filename}`;
}
