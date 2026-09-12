import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/guard';
import { LOGO_TYPES, MAX_LOGO_BYTES, optimizeLogo, removeUpload } from '@/lib/admin/uploads';
import { updateSiteContent } from '@/lib/content/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const { id } = await context.params;
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const file = form.get('file');

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_LOGO_BYTES) {
      return NextResponse.json({ error: 'Logo must be under 4 MB' }, { status: 400 });
    }
    if (file.type && !LOGO_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Use a PNG, JPG, or WebP logo' }, { status: 400 });
    }
  }

  let nextSrc: string | null = null;
  if (file instanceof File && file.size > 0) {
    nextSrc = await optimizeLogo(file, id);
  }

  const content = updateSiteContent((current) => ({
    ...current,
    logos: current.logos.map((logo) => {
      if (logo.id !== id) return logo;
      if (nextSrc && nextSrc !== logo.src) removeUpload(logo.src);
      const brand = name || logo.name;
      return {
        ...logo,
        name: brand,
        alt: `${brand} logo`,
        src: nextSrc ?? logo.src,
      };
    }),
  }));

  const updated = content.logos.find((logo) => logo.id === id);
  if (!updated) return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const { id } = await context.params;
  let removedSrc: string | null = null;

  const content = updateSiteContent((current) => {
    const match = current.logos.find((logo) => logo.id === id);
    removedSrc = match?.src ?? null;
    return { ...current, logos: current.logos.filter((logo) => logo.id !== id) };
  });

  if (removedSrc) removeUpload(removedSrc);
  return NextResponse.json({ ok: true, logos: content.logos });
}
