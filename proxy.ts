import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import process from 'node:process';

import { checkAdminRoute } from '@/app/(constants)';
import { authGuard } from '@/lib/guards';
import { AUTH_COOKIE } from '@/lib/telegram';

export const config = {
  matcher: ['/((?!api|_vercel/insights|_next/static|_next/image|.*\\.png$).*)']
};

const adminIds = JSON.parse(process.env.TELEGRAM_ADMIN_IDS ?? '[]') as number[];

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  const authUser = await authGuard();
  const isAdminRoute = checkAdminRoute(pathname);
  const isUnAuthorized = !authUser;
  const isAdmin = !!authUser && adminIds.includes(authUser.id);

  if (isAdminRoute && (isUnAuthorized || !isAdmin)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  if (!authUser) {
    response.cookies.set({
      name: AUTH_COOKIE,
      value: '',
      path: '/',
      maxAge: 0
    });
  }

  return response;
};
