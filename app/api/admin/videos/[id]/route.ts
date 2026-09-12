import { NextResponse } from 'next/server';
import { CATEGORIES, type CategorySlug } from '@/data/portfolio';
import { requireAdmin } from '@/lib/admin/guard';
import { MAX_VIDEO_BYTES, removeUpload, saveUpload, VIDEO_TYPES } from '@/lib/admin/uploads';
import { updateSiteContent } from '@/lib/content/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORY_SLUGS = new Set(CATEGORIES.map((category) => category.slug));

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const { id } = await context.params;
  const form = await request.formData();
  const title = String(form.get('title') ?? '').trim();
  const description = String(form.get('description') ?? '').trim();
  const categoryValue = String(form.get('category') ?? '');
  const category = CATEGORY_SLUGS.has(categoryValue as CategorySlug)
    ? (categoryValue as CategorySlug)
    : null;
  const file = form.get('file');

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: 'Video must be under 25 MB' }, { status: 400 });
    }
    if (file.type && !VIDEO_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Use an MP4 video' }, { status: 400 });
    }
  }

  let nextSrc: string | null = null;
  if (file instanceof File && file.size > 0) {
    nextSrc = await saveUpload(file, 'videos', id, '.mp4');
  }

  const content = updateSiteContent((current) => ({
    ...current,
    videos: current.videos.map((video) => {
      if (video.id !== id) return video;
      if (nextSrc && nextSrc !== video.src) removeUpload(video.src);
      return {
        ...video,
        title: title || video.title,
        description,
        category: category ?? video.category,
        src: nextSrc ?? video.src,
      };
    }),
  }));

  const updated = content.videos.find((video) => video.id === id);
  if (!updated) return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const { id } = await context.params;
  let removedSrc: string | null = null;

  const content = updateSiteContent((current) => {
    const match = current.videos.find((video) => video.id === id);
    removedSrc = match?.src ?? null;
    return { ...current, videos: current.videos.filter((video) => video.id !== id) };
  });

  if (removedSrc) removeUpload(removedSrc);
  return NextResponse.json({ ok: true, videos: content.videos });
}
