'use client';

import {
  useClickOutside,
  useDebounceValue,
  useDisclosure,
  useField,
  useQuery
} from '@siberiacancode/reactuse';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

import type { SearchResponse } from '@/app/api/search/route';

import { ROUTES } from '@/app/(constants)';
import { analyzeConference } from '@/app/(main)/actions';
import { api } from '@/app/api/instance';
import { Input } from '@/components/ui';

export const SearchInput = () => {
  const selectMenu = useDisclosure();
  const inputRef = useClickOutside<HTMLFormElement>(() => selectMenu.close());
  const searchField = useField({ initialValue: '' });
  const search = searchField.watch();

  const debouncedSearch = useDebounceValue(search, 1000);
  const searchQuery = useQuery(
    () =>
      api.get<SearchResponse>('/search', {
        query: {
          search,
          limit: 3
        }
      }),
    {
      keys: [debouncedSearch]
    }
  );

  const [_analyzeConferenceState, analyzeConferenceAction, isPending] = useActionState(
    analyzeConference,
    {
      success: false,
      error: ''
    }
  );

  const talks = searchQuery.data?.data.talks ?? [];
  const loading = isPending || searchQuery.isFetching;

  return (
    <div className='relative mx-auto w-full max-w-xs'>
      <form ref={inputRef} action={analyzeConferenceAction}>
        <Input
          disabled={loading}
          onClick={selectMenu.open}
          {...searchField.register()}
          className='h-8 px-8'
          id='search'
          name='url'
          autoComplete='off'
          placeholder='Search...'
        />
        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50'>
          <SearchIcon className='size-4' />
        </div>

        {loading && (
          <div className='absolute inset-y-0 end-0 flex items-center justify-center pe-2'>
            <Loader2Icon className='text-muted-foreground size-4 animate-spin' />
          </div>
        )}
      </form>

      {!!talks.length && selectMenu.opened && (
        <div className='bg-background absolute top-10 z-10 w-full rounded-xl border border-gray-200 p-2 dark:border-white/10'>
          {talks.map((talk) => (
            <div key={talk.id} className='text-xs text-gray-600 dark:text-gray-400'>
              <Link href={ROUTES.TALK(talk.id)}>
                <div className='flex items-center gap-4 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10'>
                  <div className='size-7 flex-shrink-0'>
                    <img
                      alt={talk.speakers[0].name}
                      className='size-7 rounded-full object-cover'
                      src={talk.speakers[0].avatar!}
                    />
                  </div>

                  <div className='flex flex-col items-start justify-start gap-1 overflow-hidden'>
                    <div className='text-md w-full truncate font-medium dark:text-white'>
                      {talk.title}
                    </div>
                    <div className='text-xs'>{talk.speakers[0].name}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
