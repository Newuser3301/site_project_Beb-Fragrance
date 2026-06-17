import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];
const PUBLIC_AUTH_ROUTES = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/error',
  '/admin/login',
]);

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;
  const userRole = request.auth?.user?.role;
  const pathname = nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/auth');
  const isProfileRoute = pathname.startsWith('/profile');

  if (PUBLIC_AUTH_ROUTES.has(pathname)) {
    if (pathname === '/admin/login' && isLoggedIn && userRole && ADMIN_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL('/admin', nextUrl));
    }

    return NextResponse.next();
  }

  if (isProfileRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', nextUrl);
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
  matcher: ['/admin/:path*', '/auth/:path*', '/profile/:path*'],
};
