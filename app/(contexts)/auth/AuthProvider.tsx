'use client';

import type { ReactNode } from 'react';

import { useDisclosure } from '@siberiacancode/reactuse';
import { useMemo, useState } from 'react';

import { login, logout } from '@/app/api/actions';

import { AuthContext } from './AuthContext';
import { AuthModal } from './components';

interface AuthProviderProps {
  children: ReactNode;
  initialMetadata?: AuthMetadata;
  initialUser?: AuthUser;
}

const DEFAULT_METADATA: AuthMetadata = { isAdmin: false, isReviewer: false };

export const AuthProvider = ({ children, initialUser, initialMetadata }: AuthProviderProps) => {
  const authModal = useDisclosure();
  const [user, setUser] = useState(initialUser);

  const onLogin = async (user: AuthUser, payload: TelegramAuthPayload) => {
    await login({ user, payload });
    setUser(user);
    authModal.close();
  };

  const onLogout = async () => {
    await logout();
    setUser(undefined);
  };

  const value = useMemo(
    () => ({
      user,
      metadata: { ...DEFAULT_METADATA, ...initialMetadata },
      authModal,
      setUser,
      logout: onLogout,
      login: onLogin
    }),
    [user, authModal.opened]
  );

  return (
    <AuthContext value={value}>
      {children}
      {authModal.opened && <AuthModal />}
    </AuthContext>
  );
};
