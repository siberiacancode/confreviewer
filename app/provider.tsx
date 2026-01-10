'use client';

import type { ComponentProps, ReactNode } from 'react';

import { AuthProvider } from './(contexts)/auth';
import { IntlProvider } from './(contexts)/intl';
import { ThemeProvider } from './(contexts)/theme';

interface ProviderProps {
  auth: Omit<ComponentProps<typeof AuthProvider>, 'children'>;
  children: ReactNode;
  intl: Omit<ComponentProps<typeof IntlProvider>, 'children'>;
}

export const Provider = async ({ children, auth, intl }: ProviderProps) => (
  <IntlProvider {...intl}>
    <ThemeProvider>
      <AuthProvider {...auth}>{children}</AuthProvider>
    </ThemeProvider>
  </IntlProvider>
);
