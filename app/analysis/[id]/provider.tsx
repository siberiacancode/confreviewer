'use client';

import type { ComponentProps, ReactNode } from 'react';

import { ReviewProvider } from './(contexts)/review';
import { TalkProvider } from './(contexts)/talk';

interface AnalysisProviderProps {
  children: ReactNode;
  reviews: Omit<ComponentProps<typeof ReviewProvider>, 'children'>;
  talk: Omit<ComponentProps<typeof TalkProvider>, 'children'>;
}

export const AnalysisProvider = ({ children, talk, reviews }: AnalysisProviderProps) => (
  <TalkProvider {...talk}>
    <ReviewProvider {...reviews}>{children}</ReviewProvider>
  </TalkProvider>
);
