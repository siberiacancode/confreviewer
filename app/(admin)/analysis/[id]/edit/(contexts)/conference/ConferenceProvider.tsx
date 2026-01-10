'use client';

import type { ReactNode } from 'react';

import { useMemo } from 'react';

import type { Conference } from '@/app/api/types';

import { ConferenceContext } from './ConferenceContext';

interface ConferenceProviderProps {
  children: ReactNode;
  initialConference: Conference;
}

export const ConferenceProvider = ({ children, initialConference }: ConferenceProviderProps) => {
  const value = useMemo(
    () => ({
      conference: initialConference
    }),
    [initialConference]
  );

  return <ConferenceContext value={value}>{children}</ConferenceContext>;
};
