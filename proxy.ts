import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { checkAdminRoute, COOKIES } from '@/app/(constants)';
import { authGuard } from '@/lib/guards';

export const config = {
  matcher: ['/((?!api|_vercel/insights|_next/static|_next/image|.*\\.png$).*)']
};

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  const auth = await authGuard();
  const isAdminRoute = checkAdminRoute(pathname);
  const isUnAuthorized = !auth;
  const isAdmin = !!auth && auth.metadata.isAdmin;

  if (isAdminRoute && (isUnAuthorized || !isAdmin)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  if (!auth) {
    response.cookies.set({
      name: COOKIES.AUTH,
      value: '',
      path: '/',
      maxAge: 0
    });
  }

  return response;
};
