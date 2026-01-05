'use server';

import { cookies } from 'next/headers';

import { AUTH_COOKIE } from '@/lib/telegram';

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE,
    value: '',
    path: '/',
    maxAge: 0
  });
};
