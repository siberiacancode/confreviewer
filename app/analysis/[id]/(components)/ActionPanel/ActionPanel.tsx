'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { CheckIcon, EyeIcon, ForwardIcon, HeartIcon } from 'lucide-react';
// import dynamic from 'next/dynamic';

import { useAuth } from '@/app/(contexts)/auth';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

import { useTalk } from '../../(contexts)/talk';

// const Badge = dynamic(() => import('@/components/ui/badge').then((mod) => mod.Badge), {
//   loading: () => <Skeleton className='h-6.5 w-14 rounded-full' />,
//   ssr: false
// });

export const ActionPanel = () => {
  const talkContext = useTalk();
  const authContext = useAuth();

  const talk = talkContext.talk!;

  const { copied, copy } = useCopy();

  const onCopyClick = () => copy(window.location.href);

  const isLiked = talk.liked ?? false;
  const isWantsToWatch = talk.wantedToWatch ?? false;

  return (
    <div className='flex items-center gap-2'>
      <Badge
        className={cn(
          isLiked && 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
          'h-6.5 cursor-pointer px-3 py-1 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400'
        )}
        variant='outline'
        onClick={() => {
          if (!authContext.user) {
            authContext.authModal.open();
            return;
          }

          talkContext.actionTalk('likes', !isLiked);
        }}
      >
        <HeartIcon className='size-4!' />

        {!!talk.likes && <span className='text-medium'>{talk.likes}</span>}
      </Badge>

      <Badge
        className={cn(
          isWantsToWatch && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
          'h-6.5 cursor-pointer px-3 py-1 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
        )}
        variant='outline'
        onClick={() => {
          if (!authContext.user) {
            authContext.authModal.open();
            return;
          }

          talkContext.actionTalk('wantsToWatch', !isWantsToWatch);
        }}
      >
        <EyeIcon className='size-4!' />
        {!!talk.wantsToWatch && <span className='text-medium'>{talk.wantsToWatch}</span>}
      </Badge>

      <Badge
        className={cn(
          'h-6.5 cursor-pointer px-3 py-1 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700/30 dark:hover:text-gray-300',
          copied && 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
        )}
        variant='outline'
        onClick={onCopyClick}
      >
        {copied && <CheckIcon className='size-4!' />}
        {!copied && <ForwardIcon className='size-4!' />}
      </Badge>
    </div>
  );
};
