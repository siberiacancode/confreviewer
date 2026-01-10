'use client';

import { SlidersHorizontalIcon } from 'lucide-react';

import { IntlText } from '@/app/(contexts)/intl';
import { Button } from '@/components/ui';

import { ConferenceFeedFiltersModal } from './components/ConferenceFeedFiltersModal/ConferenceFeedFiltersModal';
import { useConferenceFeedFilters } from './hooks/useConferenceFeedFilters';

export const ConferenceFeedFilters = () => {
  const { state, features } = useConferenceFeedFilters();

  return (
    <>
      <div className='relative inline-block'>
        <Button className='rounded-full' variant='secondary' onClick={features.filtersModal.open}>
          <SlidersHorizontalIcon className='size-4' />
          <IntlText path='button.filters' />
        </Button>

        {state.filtered && (
          <span
            aria-hidden='true'
            className='bg-primary absolute top-0 right-0 block size-2 rounded-full'
          />
        )}
      </div>

      {features.filtersModal.opened && (
        <ConferenceFeedFiltersModal onOpenChange={features.filtersModal.toggle} />
      )}
    </>
  );
};
