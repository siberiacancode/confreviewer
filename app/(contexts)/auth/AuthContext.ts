'use client';

import { createContext } from 'react';

import type { AuthUser, TelegramAuthPayload } from '@/lib/telegram';

export interface AuthContextValue {
  user: AuthUser | undefined;
  login: (payload: TelegramAuthPayload) => Promise<void> | void;
  logout: () => Promise<void> | void;
  setUser: (user: AuthUser | undefined) => void;
  authModal: {
    opened: boolean;
    open: () => void;
    close: () => void;
  };
}

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  setUser: () => {},
  logout: () => {},
  login: () => {},
  authModal: {
    opened: false,
    open: () => {},
    close: () => {}
  }
});
