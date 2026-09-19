import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { resolveUploadFile, restoreUploads } from '@/lib/admin/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
};

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, context: RouteContext) {
  restoreUploads();
  const segments = (await context.params).path ?? [];
  if (segments.length === 0 || segments.some((part) => part.includes('\0') || part === '..')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const src = `/uploads/${segments.map(decodeURIComponent).join('/')}`;
  const absolute = resolveUploadFile(src);
  if (!absolute) return new NextResponse('Not found', { status: 404 });

  const body = fs.readFileSync(absolute);
  return new NextResponse(body, {
    headers: {
      'Content-Type': TYPES[path.extname(absolute).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
