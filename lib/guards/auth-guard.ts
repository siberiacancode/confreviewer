import { cookies } from 'next/headers';
import process from 'node:process';

import { AUTH_COOKIE_EXPIRES, COOKIES } from '@/app/(constants)';

import type { TelegramAuthPayload } from '../telegram';

import { decryptPayload } from '../secure';
import { checkTelegramAuthorization, toAuthUser } from '../telegram';

export const authGuard = async () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set');

  const cookieStore = await cookies();
  const rawAuth = cookieStore.get(COOKIES.AUTH)?.value;
  if (!rawAuth) return;

  const decrypted = decryptPayload<{ payload: TelegramAuthPayload }>(rawAuth);
  if (!decrypted) return;

  const { payload } = decrypted;

  const expired = Date.now() > payload.auth_date * 1000 + AUTH_COOKIE_EXPIRES;
  if (expired) return;

  const { valid } = await checkTelegramAuthorization(payload, botToken);
  if (!valid) return;

  const user = toAuthUser(payload);

  const adminIds = JSON.parse(process.env.TELEGRAM_ADMIN_IDS ?? '[]') as number[];
  const reviewerIds = JSON.parse(process.env.TELEGRAM_REVIEWER_IDS ?? '[]') as number[];

  const isAdmin = adminIds.includes(user.id);
  const isReviewer = reviewerIds.includes(user.id);

  return {
    user,
    metadata: {
      isAdmin,
      isReviewer
    }
  };
};
