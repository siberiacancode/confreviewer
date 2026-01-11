import { createContext } from 'react';

import type { TalkReview } from '@/app/api/types';

export interface ReviewContextValue {
  reviews: TalkReview[];
}

export const ReviewContext = createContext<ReviewContextValue>({
  reviews: []
});
