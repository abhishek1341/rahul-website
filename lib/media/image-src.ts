/**
 * Admin uploads live in `public/uploads` and are written after the production
 * build. Next.js Image Optimization (`/_next/image`) cannot see those files
 * and returns 400, so the public site must load them as raw URLs.
 */
export function shouldBypassImageOptimizer(src: string): boolean {
  const pathOnly = src.split('?')[0] ?? src;
  try {
    return decodeURIComponent(pathOnly).startsWith('/uploads/');
  } catch {
    return pathOnly.startsWith('/uploads/');
  }
}
