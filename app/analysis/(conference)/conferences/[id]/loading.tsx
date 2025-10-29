import { Skeleton } from '@/components/ui';

const ConferenceLoading = () => (
  <div className='flex flex-col gap-6'>
    <div className='flex items-center gap-2'>
      <Skeleton className='h-6 w-20' />
      <Skeleton className='h-6 w-4' />
      <Skeleton className='h-6 w-32' />
    </div>

    <div className='flex items-start justify-between gap-6'>
      <div className='flex items-start gap-4'>
        <Skeleton className='size-16 rounded-lg' />

        <div className='flex-1'>
          <Skeleton className='h-9 w-80' />
          <Skeleton className='mt-2 h-4 w-96' />
          <div className='mt-3 flex items-center gap-2'>
            <Skeleton className='h-6 w-16' />
            <Skeleton className='h-6 w-16' />
            <Skeleton className='h-6 w-16' />
          </div>
        </div>
      </div>

      <Skeleton className='size-9 rounded' />
    </div>

    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 8 }, (_, index) => (
          <div key={`talk-skeleton-${index}`} className='bg-card rounded-lg border p-4'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex flex-1 gap-4'>
                <Skeleton className='size-12 rounded-full' />

                <div className='min-w-0 flex-1'>
                  <Skeleton className='h-6 w-3/4' />
                  <Skeleton className='mt-2 h-4 w-1/2' />
                  <Skeleton className='mt-2 h-4 w-full' />
                  <Skeleton className='mt-1 h-4 w-2/3' />
                </div>
              </div>

              <div className='flex flex-shrink-0 items-center gap-2'>
                <Skeleton className='size-9 rounded' />
                <Skeleton className='size-9 rounded' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ConferenceLoading;
