import type { TelegramAuthPayload } from '@/lib/telegram';

const BOT_ID = '8481240266';

export const login = (callback: (payload: TelegramAuthPayload) => void) => {
  (window as any).Telegram.Login.auth(
    {
      bot_id: BOT_ID,
      request_access: true
    },
    callback
  );
};

export const transformPayload = (payload: TelegramAuthPayload): AuthUser => ({
  id: payload.id,
  username: payload.username,
  firstName: payload.first_name,
  lastName: payload.last_name,
  photoUrl: payload.photo_url,
  createdAt: payload.auth_date
});

export const telegram = {
  login,
  transformPayload
};
