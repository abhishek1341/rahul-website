import { NextResponse } from 'next/server';
import { CATEGORIES, type CategorySlug } from '@/data/portfolio';
import { requireAdmin } from '@/lib/admin/guard';
import { createId, MAX_VIDEO_BYTES, saveUpload, VIDEO_TYPES } from '@/lib/admin/uploads';
import { readSiteContent, updateSiteContent } from '@/lib/content/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORY_SLUGS = new Set(CATEGORIES.map((category) => category.slug));

function asCategory(value: string): CategorySlug | null {
  return CATEGORY_SLUGS.has(value as CategorySlug) ? (value as CategorySlug) : null;
}

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json(readSiteContent().videos);
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get('file');
  const title = String(form.get('title') ?? '').trim();
  const description = String(form.get('description') ?? '').trim();
  const category = asCategory(String(form.get('category') ?? ''));

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Choose an MP4 video' }, { status: 400 });
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: 'Video must be under 25 MB' }, { status: 400 });
  }
  if (file.type && !VIDEO_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Use an MP4 video' }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: 'Add a video name' }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: 'Choose a category' }, { status: 400 });
  }

  const id = createId('video');
  const src = await saveUpload(file, 'videos', id, '.mp4');

  const content = updateSiteContent((current) => ({
    ...current,
    videos: [...current.videos, { id, src, title, description, category }],
  }));

  return NextResponse.json(content.videos.at(-1), { status: 201 });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const body = (await request.json()) as { ids?: string[] };
  if (!Array.isArray(body.ids)) {
    return NextResponse.json({ error: 'ids required' }, { status: 400 });
  }

  const content = updateSiteContent((current) => {
    const byId = new Map(current.videos.map((video) => [video.id, video]));
    const next = body.ids!.flatMap((id) => {
      const video = byId.get(id);
      return video ? [video] : [];
    });
    const leftover = current.videos.filter((video) => !body.ids!.includes(video.id));
    return { ...current, videos: [...next, ...leftover] };
  });

  return NextResponse.json(content.videos);
}
