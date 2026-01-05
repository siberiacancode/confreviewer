import { cookies } from 'next/headers';
import process from 'node:process';

import type { TelegramAuthPayload } from '../telegram';

import { decryptPayload } from '../secure';
import {
  AUTH_COOKIE,
  checkTelegramAuthorization,
  TELEGRAM_MAX_AGE_MS,
  toAuthUser
} from '../telegram';

export const authGuard = async () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set');

  const cookieStore = await cookies();
  const rawAuth = cookieStore.get(AUTH_COOKIE)?.value;
  if (!rawAuth) return;

  const payload = decryptPayload<TelegramAuthPayload>(rawAuth);
  if (!payload) return;

  const expired = Date.now() > payload.auth_date * 1000 + TELEGRAM_MAX_AGE_MS;
  if (expired) return;

  const { valid } = await checkTelegramAuthorization(payload, botToken);
  if (!valid) return;

  const user = toAuthUser(payload);
  return user;
};
