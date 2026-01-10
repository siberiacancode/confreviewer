import { use } from 'react';

import { ConferenceContext } from './ConferenceContext';

export const useConference = () => use(ConferenceContext);

