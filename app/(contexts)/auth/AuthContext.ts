"use client";

import { createContext } from "react";

export interface AuthContextValue {
  metadata: AuthMetadata;
  user: AuthUser | undefined;
  login: (user: AuthUser, payload: TelegramAuthPayload) => void;
  logout: () => void;
  setUser: (user: AuthUser | undefined) => void;
  authCallback: <Callback extends () => void>(
    callback: Callback
  ) => () => ReturnType<Callback> | void;
  authModal: {
    opened: boolean;
    open: () => void;
    close: () => void;
  };
}

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  metadata: {
    isAdmin: false,
    isReviewer: false,
  },
  setUser: () => {},
  logout: () => {},
  login: () => {},
  authCallback: () => () => {},
  authModal: {
    opened: false,
    open: () => {},
    close: () => {},
  },
});
