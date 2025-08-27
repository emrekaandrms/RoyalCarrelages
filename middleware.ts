import { NextRequest, NextResponse } from 'next/server';

function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let result = 0;
  for (let i = 0; i < len; i++) {
    const ca = a.charCodeAt(i) || 0;
    const cb = b.charCodeAt(i) || 0;
    result |= ca ^ cb;
  }
  return result === 0 && a.length === b.length;
}

function isBasicAuthValid(authorizationHeader: string | null): boolean {
  if (!authorizationHeader?.startsWith('Basic ')) return false;
  const base64Credentials = authorizationHeader.split(' ')[1];
  try {
    const decoded = typeof atob === 'function'
      ? atob(base64Credentials)
      : Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');
    const envUser = process.env.ADMIN_USER || '';
    const envPass = process.env.ADMIN_PASS || '';
    if (!envUser || !envPass) return false;
    return safeEqual(user, envUser) && safeEqual(pass, envPass);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method || 'GET';

  const needsAuth =
    pathname.startsWith('/admin') ||
    (pathname.startsWith('/api/products') && method !== 'GET') ||
    (pathname.startsWith('/api/settings') && method !== 'GET') ||
    (pathname.startsWith('/api/featured') && method !== 'GET') ||
    (pathname.startsWith('/api/banners') && method !== 'GET') ||
    (pathname.startsWith('/api/collections/meta') && method !== 'GET') ||
    (pathname.startsWith('/api/features') && method !== 'GET') ||
    (pathname.startsWith('/api/upload') && method !== 'GET');

  if (!needsAuth) {
    // Admin sayfaları ve API'ler için noindex header ekleyelim
    const res = NextResponse.next();
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    return res;
  }

  const authHeader = request.headers.get('authorization');
  if (!isBasicAuthValid(authHeader)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/products/:path*', '/api/settings/:path*', '/api/featured', '/api/banners', '/api/collections/meta', '/api/features', '/api/upload'],
};


