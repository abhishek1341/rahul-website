import { NextResponse } from 'next/server';
import {
  assertSameOrigin,
  createSessionToken,
  getAdminSecret,
  isAdminConfigured,
  sessionCookie,
} from '@/lib/admin/session';

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Set ADMIN_PASSWORD on the server before using admin.' },
      { status: 503 },
    );
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const token = await createSessionToken(getAdminSecret());
  const response = NextResponse.json({ ok: true });
  response.headers.set('Set-Cookie', sessionCookie(token));
  return response;
}
