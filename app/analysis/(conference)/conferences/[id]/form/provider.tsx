'use client';

import type { ComponentProps, ReactNode } from 'react';

import { ConferenceFormProvider as ConferenceFormModeProvider } from './(contexts)';

interface ConferenceFormProviderProps {
  children: ReactNode;
  conferenceForm: Omit<ComponentProps<typeof ConferenceFormModeProvider>, 'children'>;
}

export const ConferenceFormProvider = ({
  children,
  conferenceForm
}: ConferenceFormProviderProps) => (
  <ConferenceFormModeProvider {...conferenceForm}>{children}</ConferenceFormModeProvider>
);
