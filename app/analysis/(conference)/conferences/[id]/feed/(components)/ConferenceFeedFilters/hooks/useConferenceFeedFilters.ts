'use client';

import { useDisclosure } from '@siberiacancode/reactuse';
import { useSearchParams } from 'next/navigation';

export const useConferenceFeedFilters = () => {
  const filtersModal = useDisclosure();
  const searchParams = useSearchParams();

  const filtered =
    Boolean(searchParams.get('search')) ||
    searchParams.has('popular') ||
    searchParams.has('demanded') ||
    searchParams.has('recommended');

  return {
    state: {
      filtered
    },
    features: {
      filtersModal
    }
  };
};
