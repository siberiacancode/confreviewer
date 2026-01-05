import { toast } from 'sonner';

import type { TelegramAuthPayload } from '@/lib/telegram';

import { useAuth } from '../../../useAuth';

const BOT_ID = '8481240266';

export const useAuthModal = () => {
  const auth = useAuth();

  const login = () => {
    (window as any).Telegram.Login.auth(
      {
        bot_id: BOT_ID,
        request_access: true
      },
      (payload: TelegramAuthPayload) => {
        if (!payload) return toast.error('Failed to authenticate');
        auth.login(payload);
      }
    );
  };

  return {
    state: {
      opened: auth.authModal.opened
    },
    functions: {
      open: auth.authModal.open,
      close: auth.authModal.close,
      login
    }
  };
};
