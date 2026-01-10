import { createContext } from 'react';

import type { Conference } from '@/app/api/types';

export interface ConferenceContextValue {
  conference: Conference;
}

export const ConferenceContext = createContext<ConferenceContextValue>({
  conference: {} as Conference
});
