'use client';

import { EyeIcon, HeartIcon } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';

import { Button, Card } from '@/components/ui';
import type { ConferenceTalk } from '@/app/api/types';

import { useTalkActions } from './useTalkActions';

interface TalkCardProps {
  talk: ConferenceTalk & {
    id: string;
    likes: number;
    wantsToWatch: number;
  };
  index: number;
}

export const TalkCard = ({ talk, index }: TalkCardProps) => {
  const [isPending, startTransition] = useTransition();
  const { handleLike, handleWantToWatch } = useTalkActions();

  const [optimisticTalk, addOptimisticTalk] = useOptimistic(
    talk,
    (state, { action, value }: { action: 'like' | 'wantToWatch'; value: number }) => {
      if (action === 'like') {
        return { ...state, likes: state.likes + value };
      }
      if (action === 'wantToWatch') {
        return { ...state, wantsToWatch: state.wantsToWatch + value };
      }
      return state;
    }
  );

  const handleLikeClick = () => {
    startTransition(() => {
      addOptimisticTalk({ action: 'like', value: 1 });
      handleLike(talk.id);
    });
  };

  const handleWantToWatchClick = () => {
    startTransition(() => {
      addOptimisticTalk({ action: 'wantToWatch', value: 1 });
      handleWantToWatch(talk.id);
    });
  };

  const talkKey = `${talk.name}-${talk.talk_title}-${index}`;

  return (
    <Card key={talkKey} className='rounded-2xl p-4'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-1 gap-4'>
          {talk.avatar_url && (
            <div className='flex-shrink-0'>
              <img
                alt={talk.name}
                className='size-12 rounded-full object-cover'
                src={talk.avatar_url}
              />
            </div>
          )}

          <div className='min-w-0 flex-1'>
            <h3 className='text-lg leading-tight font-semibold'>
              {talk.talk_title ?? talk.name}
            </h3>
            <div className='mt-2 h-5 overflow-hidden'>
              {talk.talk_description && (
                <p className='text-muted-foreground line-clamp-2 text-sm'>
                  {talk.talk_description}
                </p>
              )}
            </div>
            {talk.job_title && (
              <p className='text-muted-foreground mt-1 text-sm'>{talk.job_title}</p>
            )}
          </div>
        </div>

        <div className='flex flex-shrink-0 items-center gap-2'>
          <Button
            className='size-9 rounded-full hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400'
            disabled={isPending}
            size='icon'
            title={`${optimisticTalk.likes} лайков`}
            variant='ghost'
            onClick={handleLikeClick}
          >
            <HeartIcon aria-label={`${optimisticTalk.likes} лайков`} className='size-4' />
          </Button>
          <Button
            className='size-9 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
            disabled={isPending}
            size='icon'
            title={`${optimisticTalk.wantsToWatch} хотят посмотреть`}
            variant='ghost'
            onClick={handleWantToWatchClick}
          >
            <EyeIcon
              aria-label={`${optimisticTalk.wantsToWatch} хотят посмотреть`}
              className='size-4'
            />
          </Button>
        </div>
      </div>
    </Card>
  );
};
