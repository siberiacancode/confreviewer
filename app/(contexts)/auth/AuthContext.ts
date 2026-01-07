'use client';

import { createContext } from 'react';

export interface AuthContextValue {
  metadata: AuthMetadata;
  user: AuthUser | undefined;
  login: (user: AuthUser, payload: TelegramAuthPayload) => Promise<void> | void;
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
  metadata: {
    isAdmin: false
  },
  setUser: () => {},
  logout: () => {},
  login: () => {},
  authModal: {
    opened: false,
    open: () => {},
    close: () => {}
  }
});
