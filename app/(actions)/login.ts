'use server';

import { cookies } from 'next/headers';
import process from 'node:process';

import type { TelegramAuthPayload } from '@/lib/telegram';

import { prisma } from '@/lib/prisma';
import { encryptPayload } from '@/lib/secure';
import { AUTH_COOKIE, TELEGRAM_MAX_AGE_MS } from '@/lib/telegram';

export const login = async (payload: TelegramAuthPayload) => {
  await prisma.user.upsert({
    where: { id: payload.id },
    update: {
      username: payload.username,
      firstName: payload.first_name,
      lastName: payload.last_name,
      photoUrl: payload.photo_url
    },
    create: {
      id: payload.id,
      username: payload.username,
      firstName: payload.first_name,
      lastName: payload.last_name,
      photoUrl: payload.photo_url
    }
  });

  const cookieStore = await cookies();
  const encrypted = encryptPayload(payload);

  cookieStore.set(AUTH_COOKIE, encrypted, {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(payload.auth_date * 1000 + TELEGRAM_MAX_AGE_MS)
  });
};
