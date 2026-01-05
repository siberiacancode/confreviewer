import { Skeleton } from '@/components/ui';

const AnalysisLoading = () => (
  <div>
    <div className='flex gap-2'>
      <div className='flex w-full flex-col items-start justify-between gap-4'>
        <div className='flex w-full justify-between gap-2'>
          <div className='flex gap-3'>
            <Skeleton className='size-12 rounded-full' />
            <div className='flex flex-col justify-between'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>

          <div className='flex justify-between gap-2'>
            <Skeleton className='h-9 w-29' />
            <Skeleton className='size-9' />
          </div>
        </div>

        <Skeleton className='h-9 w-3/4' />

        <div className='flex w-full flex-col gap-2'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-5/6' />
          <Skeleton className='h-5 w-4/5' />
        </div>

        <div className='flex items-center gap-2'>
          <Skeleton className='h-6.5 w-14 rounded-full' />
          <Skeleton className='h-6.5 w-16 rounded-full' />
          <Skeleton className='h-6.5 w-16 rounded-full' />
        </div>

        <div className='mt-6 flex w-full items-center justify-between gap-4'>
          <Skeleton className='h-10 w-28' />
        </div>
      </div>
    </div>
  </div>
);

export default AnalysisLoading;
