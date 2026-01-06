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
            <Skeleton className='h-6 w-10' />
            <Skeleton className='h-6 w-10' />
            <Skeleton className='h-6 w-10' />
          </div>
        </div>
      </div>

      <Skeleton className='size-9 rounded' />
    </div>

    <div className='mb-10 flex flex-col gap-6'>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index}>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-3'>
              <Skeleton className='size-12 rounded-full' />
              <div className='flex flex-col justify-between'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-3 w-20' />
              </div>
            </div>

            <Skeleton className='h-7 w-3/4' />

            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-11/12' />
              <Skeleton className='h-4 w-10/12' />
            </div>

            <div className='flex items-center gap-2'>
              <Skeleton className='h-6.5 w-14 rounded-full' />
              <Skeleton className='h-6.5 w-16 rounded-full' />
              <Skeleton className='h-6.5 w-16 rounded-full' />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ConferenceLoading;
