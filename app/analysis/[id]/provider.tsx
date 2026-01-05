'use client';

import type { ComponentProps, ReactNode } from 'react';

import { TalkProvider } from './(contexts)/talk';

interface AnalysisProviderProps {
  children: ReactNode;
  talk: Omit<ComponentProps<typeof TalkProvider>, 'children'>;
}

export const AnalysisProvider = ({ children, talk }: AnalysisProviderProps) => (
  <TalkProvider {...talk}>{children}</TalkProvider>
);
