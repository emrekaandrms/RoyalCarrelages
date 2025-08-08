import { NextRequest, NextResponse } from 'next/server';

function isBasicAuthValid(authorizationHeader: string | null): boolean {
  if (!authorizationHeader?.startsWith('Basic ')) return false;
  const base64Credentials = authorizationHeader.split(' ')[1];
  try {
    const decoded = typeof atob === 'function'
      ? atob(base64Credentials)
      : Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');
    return (
      !!user &&
      !!pass &&
      user === process.env.ADMIN_USER &&
      pass === process.env.ADMIN_PASS
    );
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method || 'GET';

  const needsAuth =
    pathname.startsWith('/admin') ||
    (pathname.startsWith('/api/products') && method !== 'GET');

  if (!needsAuth) {
    return NextResponse.next();
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
  matcher: ['/admin/:path*', '/api/products/:path*'],
};


