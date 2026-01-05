'use client';

import type { ComponentProps, ReactNode } from 'react';

import { TalkProvider } from '@/app/analysis/[id]/(contexts)/talk';

interface AdminEditProviderProps {
  children: ReactNode;
  talk: Omit<ComponentProps<typeof TalkProvider>, 'children'>;
}

export const AdminEditProvider = ({ children, talk }: AdminEditProviderProps) => (
  <TalkProvider {...talk}>{children}</TalkProvider>
);
