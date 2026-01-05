'use client';

import { useDisclosure } from '@siberiacancode/reactuse';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import type { AuthUser, TelegramAuthPayload } from '@/lib/telegram';

import { login, logout } from '@/app/(actions)';
import { toAuthUser } from '@/lib/telegram';

import { AuthContext } from './AuthContext';
import { AuthModal } from './components';

interface AuthProviderProps {
  children: React.ReactNode;
  initialAuth?: AuthUser;
}

export const AuthProvider = ({ children, initialAuth }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState(initialAuth);
  const authModal = useDisclosure();

  const onLogin = async (payload: TelegramAuthPayload) => {
    await login(payload);
    setUser(toAuthUser(payload));
    authModal.close();
    router.refresh();
  };

  const onLogout = async () => {
    await logout();
    setUser(undefined);
    router.refresh();
  };

  const value = useMemo(
    () => ({
      user,
      authModal,
      isAuthenticated: Boolean(user),
      setUser,
      logout: onLogout,
      login: onLogin
    }),
    [authModal.opened]
  );

  return (
    <AuthContext value={value}>
      {children}
      <AuthModal />
    </AuthContext>
  );
};
