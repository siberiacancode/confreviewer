import { Skeleton } from '@/components/ui';

const EditTalkLoading = () => (
  <div className='mx-auto flex max-w-5xl flex-col gap-6 py-10'>
    <div className='flex justify-between'>
      <Skeleton className='h-10 w-28 rounded-full' />
      <Skeleton className='h-10 w-44 rounded-full' />
    </div>

    <div className='flex flex-col gap-2'>
      <Skeleton className='h-9 w-64' />
    </div>

    <div className='flex flex-col gap-2'>
      <Skeleton className='h-6 w-24' />
      <Skeleton className='h-9 w-full max-w-2xl' />
    </div>

    <div className='flex flex-col gap-2'>
      <Skeleton className='h-6 w-24' />
      <div className='border-muted bg-card flex min-h-[220px] flex-col gap-3 rounded-lg border p-4'>
        <Skeleton className='h-5 w-40' />
        <Skeleton className='h-5 w-5/6' />
        <Skeleton className='h-5 w-2/3' />
      </div>
    </div>

    <div className='flex items-stretch gap-3'>
      <div className='bg-card flex items-center gap-3 rounded-full border p-4'>
        <Skeleton className='size-12 rounded-full' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>

      <Skeleton className='w-44 self-stretch rounded-full border-2 border-dashed' />
    </div>
  </div>
);

export default EditTalkLoading;
