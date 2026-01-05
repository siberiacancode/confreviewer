import process from 'node:process';

import { authGuard } from './auth-guard';

export const adminGuard = async () => {
  const adminIds = JSON.parse(process.env.TELEGRAM_ADMIN_IDS ?? '[]') as number[];
  const user = await authGuard();
  if (!user) return;

  if (adminIds.includes(user.id)) return user;
};
