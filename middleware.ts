import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, getAdminSecret, verifySessionToken } from '@/lib/admin/session';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/api/admin/login']);

function redirectWww(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  if (!host.startsWith('www.')) return null;

  const url = request.nextUrl.clone();
  url.protocol = 'https:';
  url.hostname = host.slice(4).split(':')[0];
  url.port = '';
  return NextResponse.redirect(url, 301);
}

export async function middleware(request: NextRequest) {
  const wwwRedirect = redirectWww(request);
  if (wwwRedirect) return wwwRedirect;

  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = getAdminSecret();
  const valid = Boolean(token && secret && (await verifySessionToken(token, secret)));

  if (valid) return NextResponse.next();

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const login = request.nextUrl.clone();
  login.pathname = '/admin/login';
  login.search = '';
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
