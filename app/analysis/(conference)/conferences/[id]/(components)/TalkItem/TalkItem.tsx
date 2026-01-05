'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { CheckIcon, EyeIcon, ForwardIcon, HeartIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';
import ReactMarkdown from 'react-markdown';

import type { TalkWithReactions } from '@/app/api/types';

import { useAuth } from '@/app/(contexts)/auth';
import { actionTalk } from '@/app/analysis/(actions)/actionTalk';
import { REACTION_MAP } from '@/app/api/types';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

const DynamicBadge = dynamic(() => import('@/components/ui/badge').then((mod) => mod.Badge), {
  loading: () => <Skeleton className='h-6.5 w-10 rounded-full border-1' />,
  ssr: false
});

export type TalkActionType = 'likes' | 'wantsToWatch';

export interface TalkItemProps {
  talk: TalkWithReactions;
}

export const TalkItem = ({ talk }: TalkItemProps) => {
  const router = useRouter();
  const { copied, copy } = useCopy();
  const authContext = useAuth();

  const [optimisticTalk, optimisticTalkUpdate] = useOptimistic(
    talk,
    (talk, action: { type: TalkActionType; value: boolean }) => ({
      ...talk,
      [action.type]: talk[action.type] + (action.value ? 1 : -1),
      [REACTION_MAP[action.type]]: action.value
    })
  );

  const actionTalkOptimistic = async (type: TalkActionType, value: boolean) => {
    const action = { type, talkId: optimisticTalk.id, value };
    startTransition(async () => {
      optimisticTalkUpdate(action);
      await actionTalk(action);
      router.refresh();
    });
  };

  const onCopyClick = () => copy(window.location.href);

  const isLiked = optimisticTalk.liked ?? false;
  const isWantsToWatch = optimisticTalk.wantedToWatch ?? false;

  const [firstSpeaker, ...otherSpeakers] = talk.speakers;

  return (
    <div className='flex flex-col items-start justify-between gap-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-3'>
          {firstSpeaker.avatar && (
            <img
              alt={firstSpeaker.name}
              className='size-12 rounded-full object-cover'
              src={firstSpeaker.avatar}
            />
          )}
          <div className='flex flex-col justify-between'>
            <span>{firstSpeaker.name}</span>
            <p className='text-muted-foreground text-sm'>{firstSpeaker.company}</p>
          </div>
        </div>

        {!!otherSpeakers.length && (
          <div className='flex gap-3'>
            {otherSpeakers.map((speaker) => (
              <div key={speaker.name} className='flex items-center gap-2'>
                {speaker.avatar && (
                  <img
                    alt={speaker.name}
                    className='size-4.5 rounded-full object-cover'
                    src={speaker.avatar}
                  />
                )}
                <span className='text-muted-foreground text-sm'>{speaker.name}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <Link href={`/analysis/${talk.id}`} className='hover:opacity-70'>
            <h3 className='text-2xl leading-tight font-semibold'>{talk.title}</h3>
          </Link>

          <div className='prose prose-sm dark:prose-invert mt-6 max-w-none'>
            <ReactMarkdown>{talk.description}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <DynamicBadge
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

            actionTalkOptimistic('likes', !isLiked);
          }}
        >
          <HeartIcon className='size-4!' />

          {!!optimisticTalk.likes && <span className='text-medium'>{optimisticTalk.likes}</span>}
        </DynamicBadge>

        <DynamicBadge
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

            actionTalkOptimistic('wantsToWatch', !isWantsToWatch);
          }}
        >
          <EyeIcon className='size-4!' />
          {!!optimisticTalk.wantsToWatch && (
            <span className='text-medium'>{optimisticTalk.wantsToWatch}</span>
          )}
        </DynamicBadge>

        <DynamicBadge
          className={cn(
            'h-6.5 cursor-pointer px-3 py-1 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700/30 dark:hover:text-gray-300',
            copied && 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
          )}
          variant='outline'
          onClick={onCopyClick}
        >
          {copied && <CheckIcon className='size-4!' />}
          {!copied && <ForwardIcon className='size-4!' />}
        </DynamicBadge>
      </div>
    </div>
  );
};
