'use client';

import type { ReactNode } from 'react';

import { useMemo } from 'react';

import type { TalkReview } from '@/app/api/types';

import { ReviewContext } from './ReviewContext';

interface ReviewProviderProps {
  children: ReactNode;
  initialReviews: TalkReview[];
}

export const ReviewProvider = ({ children, initialReviews }: ReviewProviderProps) => {
  const value = useMemo(
    () => ({
      reviews: initialReviews
    }),
    [initialReviews]
  );

  return <ReviewContext value={value}>{children}</ReviewContext>;
};
