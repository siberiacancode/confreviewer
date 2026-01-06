'use server';

import { cookies } from 'next/headers';

import { COOKIES } from '@/app/(constants)';

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIES.AUTH,
    value: '',
    path: '/',
    maxAge: 0
  });
};
