import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_PAGES = ['/login', '/register'];
const ADMIN_PREFIX = '/admin';

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Signed-in users don't need the login/register screens.
  if (AUTH_PAGES.includes(pathname)) {
    return token ? NextResponse.redirect(new URL('/gallery', req.url)) : NextResponse.next();
  }

  if (!token) {
    const login = new URL('/login', req.url);
    login.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/gallery', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/gallery/:path*', '/chart/:path*', '/new/:path*', '/templates/:path*', '/admin/:path*'],
};
