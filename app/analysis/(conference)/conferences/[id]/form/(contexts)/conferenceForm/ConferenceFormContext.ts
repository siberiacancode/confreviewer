import { createContext } from 'react';

export type ConferenceFormMode = 'feed' | 'list';
export interface ConferenceFormContextValue {
  mode: ConferenceFormMode;
  switchMode: () => void;
}

export const ConferenceFormContext = createContext<ConferenceFormContextValue>({
  mode: 'feed',
  switchMode: () => {}
});
