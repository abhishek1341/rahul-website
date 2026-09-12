import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/guard';
import { updateSiteContent } from '@/lib/content/store';
import type { SiteContent } from '@/lib/content/types';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const denied = await requireAdmin(request, { mutate: true });
  if (denied) return denied;

  const body = (await request.json()) as SiteContent['stats'];
  if (!body || !Array.isArray(body.portfolio) || !Array.isArray(body.cases)) {
    return NextResponse.json({ error: 'Invalid stats payload' }, { status: 400 });
  }

  const content = updateSiteContent((current) => ({
    ...current,
    stats: {
      portfolio: body.portfolio.map((stat) => ({
        ...stat,
        value: Number(stat.value) || 0,
        suffix: String(stat.suffix ?? ''),
        label: String(stat.label ?? '').trim() || stat.id,
        subtext: stat.subtext ? String(stat.subtext) : '',
        visible: Boolean(stat.visible),
      })),
      cases: body.cases.map((entry) => ({
        id: entry.id,
        metrics: entry.metrics.map((stat) => ({
          ...stat,
          value: Number(stat.value) || 0,
          suffix: String(stat.suffix ?? ''),
          label: String(stat.label ?? '').trim() || stat.id,
          subtext: stat.subtext ? String(stat.subtext) : '',
          visible: Boolean(stat.visible),
        })),
      })),
    },
  }));

  return NextResponse.json(content.stats);
}
