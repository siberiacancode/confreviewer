'use client';

import type { ComponentProps, ReactNode } from 'react';

import { AuthProvider } from './(contexts)/auth';
import { ThemeProvider } from './(contexts)/theme';

interface ProviderProps {
  auth: Omit<ComponentProps<typeof AuthProvider>, 'children'>;
  children: ReactNode;
}

export const Provider = async ({ children, auth }: ProviderProps) => (
  <ThemeProvider>
    <AuthProvider {...auth}>{children}</AuthProvider>
  </ThemeProvider>
);
