import { NextResponse } from 'next/server';
import { assertSameOrigin, hasValidAdminSession } from './session';

export async function requireAdmin(
  request: Request,
  options: { mutate?: boolean } = {},
): Promise<NextResponse | null> {
  if (options.mutate && !assertSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  if (!(await hasValidAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
