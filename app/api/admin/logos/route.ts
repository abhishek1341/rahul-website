import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/guard';
import { createId, LOGO_TYPES, MAX_LOGO_BYTES, optimizeLogo } from '@/lib/admin/uploads';
import { readSiteContent, updateSiteContent } from '@/lib/content/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json(readSiteContent().logos);
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get('file');
  const name = String(form.get('name') ?? '').trim();

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Choose a logo image' }, { status: 400 });
  }
  if (file.size > MAX_LOGO_BYTES) {
    return NextResponse.json({ error: 'Logo must be under 4 MB' }, { status: 400 });
  }
  if (file.type && !LOGO_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Use a PNG, JPG, or WebP logo' }, { status: 400 });
  }

  const id = createId('logo');
  const brand = name || file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Brand';
  const src = await optimizeLogo(file, id);

  const content = updateSiteContent((current) => ({
    ...current,
    logos: [...current.logos, { id, src, name: brand, alt: `${brand} logo` }],
  }));

  return NextResponse.json(content.logos.at(-1), { status: 201 });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const body = (await request.json()) as { ids?: string[] };
  if (!Array.isArray(body.ids)) {
    return NextResponse.json({ error: 'ids required' }, { status: 400 });
  }

  const content = updateSiteContent((current) => {
    const byId = new Map(current.logos.map((logo) => [logo.id, logo]));
    const next = body.ids!.flatMap((id) => {
      const logo = byId.get(id);
      return logo ? [logo] : [];
    });
    const leftover = current.logos.filter((logo) => !body.ids!.includes(logo.id));
    return { ...current, logos: [...next, ...leftover] };
  });

  return NextResponse.json(content.logos);
}
