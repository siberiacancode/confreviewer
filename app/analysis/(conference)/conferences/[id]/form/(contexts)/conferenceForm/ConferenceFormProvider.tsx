'use client';

import type { ReactNode } from 'react';

import { setCookie } from '@siberiacancode/reactuse';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { COOKIES } from '@/app/(constants)';

import type { ConferenceFormMode } from './ConferenceFormContext';

import { ConferenceFormContext } from './ConferenceFormContext';

interface ConferenceFormProviderProps {
  children: ReactNode;
  initialMode: ConferenceFormMode;
}

export const ConferenceFormProvider = ({ children, initialMode }: ConferenceFormProviderProps) => {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);

  const switchMode = () => {
    const newMode = mode === 'feed' ? 'list' : 'feed';
    setMode(newMode);
    setCookie(COOKIES.CONFERENCE_FORM_MODE, newMode);
    router.refresh();
  };

  const value = useMemo(
    () => ({
      mode,
      switchMode
    }),
    [mode, switchMode]
  );

  return <ConferenceFormContext value={value}>{children}</ConferenceFormContext>;
};
