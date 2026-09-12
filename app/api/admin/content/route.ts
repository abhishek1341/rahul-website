import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/guard';
import { readSiteContent } from '@/lib/content/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json(readSiteContent());
}
