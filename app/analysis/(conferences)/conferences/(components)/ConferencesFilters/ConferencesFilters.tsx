'use client';

import { SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui';

import { useConferenceFilters } from './hooks/useConferenceFilters';

export const ConferencesFilters = () => {
  const { state, functions } = useConferenceFilters();

  return (
    <div className='flex'>
      <div className='relative'>
        <Input
          {...state.searchField.register()}
          className='pr-4 pl-10'
          onChange={functions.onSearchChange}
          placeholder='Search conferences'
        />
        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3'>
          <SearchIcon size={18} />
        </div>
      </div>
    </div>
  );
};
