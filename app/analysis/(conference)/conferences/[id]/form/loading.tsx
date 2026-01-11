import { cookies } from 'next/headers';

import { COOKIES } from '@/app/(constants)';
import { Skeleton } from '@/components/ui';

import type { ConferenceFormMode } from './(contexts)/conferenceForm';

const getInitialMode = async () => {
  const cookiesStore = await cookies();
  return (cookiesStore.get(COOKIES.CONFERENCE_FORM_MODE)?.value ?? 'feed') as ConferenceFormMode;
};

const Loading = async () => {
  const initialMode = await getInitialMode();

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-6 w-20' />
        <Skeleton className='h-6 w-4' />
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-6 w-4' />
        <Skeleton className='h-6 w-32' />
      </div>

      <div className='flex items-start justify-between'>
        <div className='flex flex-col items-start gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-12 rounded-lg' />
            <Skeleton className='h-12 w-64' />
          </div>
          <Skeleton className='mt-2 h-4 w-96' />
        </div>
        <Skeleton className='size-10 rounded-md' />
      </div>

      <div className='mt-10'>
        {initialMode === 'list' && (
          <div className='flex flex-col gap-6'>
            {Array.from({ length: 5 }, (_, index) => `skeleton-list-${index}`).map((key) => (
              <div key={key} className='flex w-full items-center justify-between gap-4'>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-3'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='size-4.5 rounded-full' />
                      <Skeleton className='h-4 w-32' />
                    </div>
                  </div>
                  <Skeleton className='h-6 w-96' />
                </div>
                <div className='flex items-center gap-2'>
                  <Skeleton className='size-9 rounded-full' />
                  <Skeleton className='size-9 rounded-full' />
                  <Skeleton className='size-9 rounded-full' />
                </div>
              </div>
            ))}
          </div>
        )}

        {initialMode === 'feed' && (
          <div className='relative h-full w-full pb-28'>
            <div className='flex w-full flex-col items-start justify-between gap-6'>
              <div className='flex w-full gap-6'>
                <div className='flex flex-col gap-2'>
                  <Skeleton className='size-38 rounded-xl' />
                  <div className='flex flex-col justify-between'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='mt-1 h-4 w-24' />
                  </div>
                </div>

                <div className='flex flex-1 flex-col gap-2'>
                  <Skeleton className='h-8 w-full max-w-lg' />
                  <div className='mt-2 flex flex-col gap-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
