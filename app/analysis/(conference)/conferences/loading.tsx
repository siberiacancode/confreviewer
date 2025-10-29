import { Skeleton } from '@/components/ui';

const ConferencesLoading = () => (
  <div className='flex flex-col gap-6'>
    <div>
      <Skeleton className='h-9 w-48' />
      <Skeleton className='mt-2 h-4 w-80' />
    </div>

    <div className='flex'>
      <div className='relative'>
        <Skeleton className='h-10 w-80 pl-10' />
        <div className='absolute inset-y-0 start-0 flex items-center justify-center ps-3'>
          <Skeleton className='size-4 rounded' />
        </div>
      </div>
    </div>

    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={`skeleton-${index}`}
          className='bg-card flex flex-col gap-4 rounded-lg border p-4'
        >
          <Skeleton className='h-18 w-full rounded-lg' />

          <div className='flex flex-col gap-2'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-3 w-16' />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ConferencesLoading;
