import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];
const PUBLIC_AUTH_ROUTES = new Set(['/auth/login', '/auth/error']);

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;
  const userRole = request.auth?.user?.role;
  const pathname = nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/auth');

  if (PUBLIC_AUTH_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    const loginUrl = new URL('/auth/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!userRole || !ADMIN_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  if (isAuthRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};
