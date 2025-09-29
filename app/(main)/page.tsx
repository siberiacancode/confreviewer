'use client';

import {
  useClickOutside,
  useDebounceValue,
  useDisclosure,
  useField,
  useQuery
} from '@siberiacancode/reactuse';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

import { Button, ShineBorder } from '@/components/ui';

import type { SearchResponse } from '../api/search/route';

import { api } from '../api/instance';
import { analyzeConference } from './actions';

const Home = () => {
  const selectMenu = useDisclosure();
  const selectRef = useClickOutside<HTMLDivElement>(() => selectMenu.close());
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
  const loading = isPending || searchQuery.isLoading;

  return (
    <div>
      <div className='mx-auto max-w-3xl space-y-12 text-center'>
        <div ref={selectRef} className='relative mx-auto max-w-lg' onClick={selectMenu.open}>
          <form className='space-y-4' action={analyzeConferenceAction}>
            <div className='bg-secondary/70 relative flex gap-2 rounded-3xl px-3 py-2 shadow-xl shadow-white/10'>
              <ShineBorder borderWidth={3} shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />

              <input
                {...searchField.register()}
                className='w-full border-none bg-transparent px-2 py-1 outline-none placeholder:text-neutral-400'
                disabled={loading}
                name='url'
                type='url'
                autoComplete='off'
                placeholder='Paste link to talk'
              />

              <Button
                className='cursor-pointer rounded-full'
                disabled={loading}
                size='icon'
                type='submit'
              >
                {loading ? (
                  <Loader2Icon className='size-4 animate-spin' />
                ) : (
                  <ArrowUpIcon className='size-4' />
                )}
              </Button>
            </div>
          </form>

          {!!talks.length && selectMenu.opened && (
            <div className='bg-background absolute top-15 w-full rounded-3xl border border-gray-200 p-2 dark:border-white/10'>
              {talks.map((talk) => (
                <div key={talk.id} className='text-xs text-gray-600 dark:text-gray-400'>
                  <Link href={`/analysis/${talk.id}`}>
                    <div className='flex items-center gap-4 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10'>
                      <div className='size-9 flex-shrink-0'>
                        <img
                          alt={talk.speaker}
                          className='size-9 rounded-full object-cover'
                          src={talk.speakerAvatar!}
                        />
                      </div>

                      <div className='flex flex-col items-start justify-start gap-1 overflow-hidden'>
                        <div className='w-full truncate text-base font-medium dark:text-white'>
                          {talk.title}
                        </div>
                        <div className='text-sm'>{talk.speaker}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
