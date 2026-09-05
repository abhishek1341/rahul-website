/**
 * Server-only utility — runs at build / request time in Server Components.
 * Reads client logo images straight out of a `public/` folder so adding or
 * removing a brand is a file drop, never a code change.
 */
import fs from 'fs';
import path from 'path';

const LOGO_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);

/**
 * Trimmed, web-sized output of `scripts/prepare-client-logos.mjs`, whose
 * source of truth is the raw drops in `public/Logo for website/`. Rerun that
 * script after adding artwork. (`public/Client Logos/` is unrelated leftover
 * template artwork and is deliberately not used.)
 */
export const CLIENT_LOGO_FOLDER = 'client-logos';

export interface ClientLogo {
  src: string;
  alt: string;
}

/** Convert an absolute path inside `public/` to a browser-safe URL. */
function toPublicUrl(absolutePath: string): string {
  const publicDir = path.join(process.cwd(), 'public');
  const relative = path.relative(publicDir, absolutePath);
  return '/' + relative.split(path.sep).map(encodeURIComponent).join('/');
}

/**
 * Best-effort brand name from a filename. Files named purely by index
 * ("7.png") carry no meaning, so they get an empty alt and lean on the
 * marquee's own region label instead of announcing "7" to a screen reader.
 */
function altFromFilename(filename: string): string {
  const base = path
    .basename(filename, path.extname(filename))
    .replace(/^logo\s*[-_]?\s*/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  return /^\d+$/.test(base) ? '' : `${base} logo`;
}

export function loadClientLogos(
  folderRelativeToPublic: string = CLIENT_LOGO_FOLDER,
): ClientLogo[] {
  const dir = path.join(process.cwd(), 'public', folderRelativeToPublic);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        // AppleDouble sidecars that ride along in macOS-made zips.
        !entry.name.startsWith('._') &&
        LOGO_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => entry.name)
    // Numeric collation so 2.png sorts before 10.png.
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((name) => ({
      src: toPublicUrl(path.join(dir, name)),
      alt: altFromFilename(name),
    }));
}
