import { NextResponse } from 'next/server';
import { expiredSessionCookie } from '@/lib/admin/session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.headers.set('Set-Cookie', expiredSessionCookie());
  return response;
}
