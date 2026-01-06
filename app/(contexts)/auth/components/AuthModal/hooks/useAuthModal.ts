import { toast } from 'sonner';

import { telegram } from '../../../telegram';
import { useAuth } from '../../../useAuth';

export const useAuthModal = () => {
  const auth = useAuth();

  const onLogin = () =>
    telegram.login((payload) => {
      if (!payload) return toast.error('Failed to authenticate');
      const user = telegram.transformPayload(payload);
      auth.login(user);
    });

  return {
    state: {
      opened: auth.authModal.opened
    },
    functions: {
      onOpen: auth.authModal.open,
      onClose: auth.authModal.close,
      onLogin
    }
  };
};
