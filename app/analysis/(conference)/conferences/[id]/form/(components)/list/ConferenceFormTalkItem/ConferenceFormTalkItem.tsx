'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon, EyeIcon, HeartIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';
import ReactMarkdown from 'react-markdown';

import type { TalkWithReactions } from '@/app/api/types';

import { ROUTES } from '@/app/(constants)';
import { useAuth } from '@/app/(contexts)/auth';
import { actionTalk } from '@/app/analysis/(actions)/actionTalk';
import { REACTION_MAP } from '@/app/api/types';
import { Badge, Skeleton, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { cn } from '@/lib/utils';

const DynamicBadge = dynamic(() => import('@/components/ui/badge').then((mod) => mod.Badge), {
  loading: () => <Skeleton className='h-6.5 w-10 rounded-full border-1' />,
  ssr: false
});

export type TalkActionType = 'likes' | 'wantsToWatch';

export interface ConferenceFormTalkItemProps {
  talk: TalkWithReactions;
}

export const ConferenceFormTalkItem = ({ talk }: ConferenceFormTalkItemProps) => {
  const router = useRouter();
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

  const isLiked = optimisticTalk.liked ?? false;
  const isWantsToWatch = optimisticTalk.wantedToWatch ?? false;

  const [firstSpeaker, ...otherSpeakers] = talk.speakers;

  return (
    <AccordionPrimitive.AccordionItem value={talk.id}>
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-3'>
            <div key={firstSpeaker.name} className='flex items-center gap-2'>
              {firstSpeaker.avatar && (
                <img
                  alt={firstSpeaker.name}
                  className='size-4.5 rounded-full object-cover'
                  src={firstSpeaker.avatar}
                />
              )}
              <span className='text-muted-foreground text-sm'>{firstSpeaker.name}</span>
            </div>
          </div>

          <Link href={ROUTES.TALK(talk.id)} className='hover:opacity-70'>
            <h3 className='text-lg leading-tight font-semibold'>{talk.title}</h3>
          </Link>
        </div>

        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <DynamicBadge
                className={cn(
                  isLiked && 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
                  'cursor-pointer p-2 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400'
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
              </DynamicBadge>
            </TooltipTrigger>
            <TooltipContent>Мне нравится</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DynamicBadge
                className={cn(
                  isWantsToWatch &&
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                  'cursor-pointer p-2 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
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
              </DynamicBadge>
            </TooltipTrigger>
            <TooltipContent>Хочу посмотреть</TooltipContent>
          </Tooltip>

          <AccordionPrimitive.Trigger className='[&[data-state=open]>span>svg]:rotate-180'>
            <Badge
              className='hover:bg-secondary-100 dark:hover:bg-secondary cursor-pointer p-2'
              variant='outline'
            >
              <ChevronDownIcon className='size-4 transition-transform' />
            </Badge>
          </AccordionPrimitive.Trigger>
        </div>
      </div>

      <AccordionPrimitive.Content className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down mt-2 mt-5 flex flex-col gap-2 overflow-hidden text-sm'>
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

        <div className='prose prose-sm dark:prose-invert max-w-none'>
          <ReactMarkdown>{talk.description}</ReactMarkdown>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.AccordionItem>
  );
};
