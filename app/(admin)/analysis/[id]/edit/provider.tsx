'use client';

import type { ComponentProps, ReactNode } from 'react';

import { ConferenceProvider } from './(contexts)/conference';
import { TalkProvider } from './(contexts)/talk';

interface AdminEditProviderProps {
  children: ReactNode;
  conference: Omit<ComponentProps<typeof ConferenceProvider>, 'children'>;
  talk: Omit<ComponentProps<typeof TalkProvider>, 'children'>;
}

export const AdminEditProvider = ({ children, talk, conference }: AdminEditProviderProps) => (
  <TalkProvider {...talk}>
    <ConferenceProvider {...conference}>{children}</ConferenceProvider>
  </TalkProvider>
);
