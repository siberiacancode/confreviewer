'use client';

import { ChevronRightIcon, EyeIcon, HeartIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';

import type { TalkWithReactions } from '@/app/api/types';

import { ROUTES } from '@/app/(constants)';
import { useAuth } from '@/app/(contexts)/auth';
import { IntlText } from '@/app/(contexts)/intl';
import { actionTalk } from '@/app/analysis/(actions)/actionTalk';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type ConferenceFormTalkActionType = 'likes' | 'skip' | 'wantsToWatch';

interface ConferenceFormFeedProps {
  talks: TalkWithReactions[];
}

export const ConferenceFormFeed = ({ talks }: ConferenceFormFeedProps) => {
  const authContext = useAuth();
  const [isPending, startTransition] = useTransition();

  const [selectedTalkIndex, setSelectedTalkIndex] = useState(0);
  const talk = talks[selectedTalkIndex];
  const conferenceId = talks[0]?.conferenceId ?? '1';

  const formEnded = selectedTalkIndex === talks.length;

  const onAnswer = async (type: ConferenceFormTalkActionType) => {
    if (!authContext.user) {
      authContext.authModal.open();
      return;
    }
    const nextTalkIndex = selectedTalkIndex + 1;

    if (type === 'skip') {
      setSelectedTalkIndex(nextTalkIndex);
      return;
    }

    const action = { type, talkId: talk.id, value: true };
    startTransition(async () => {
      await actionTalk(action);
      setSelectedTalkIndex(nextTalkIndex);
    });
  };

  if (formEnded) {
    return (
      <div>
        <div className='flex flex-col items-center justify-center gap-4 text-center'>
          <h2 className='text-2xl font-semibold'>Спасибо, что заполнили опрос</h2>

          <Button asChild className='rounded-full'>
            <Link href={ROUTES.CONFERENCE_FEED(conferenceId)}>
              <IntlText path='button.return' />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const [firstSpeaker, ...otherSpeakers] = talk.speakers;

  return (
    <div className='relative h-full w-full pb-28'>
      <div className='flex w-full flex-col items-start justify-between gap-6'>
        <div className='flex w-full gap-6'>
          <div className='flex flex-col gap-2'>
            {firstSpeaker.avatar && (
              <img
                alt={firstSpeaker.name}
                className='size-38 rounded-xl object-cover'
                src={firstSpeaker.avatar}
              />
            )}
            <div className='flex flex-col justify-between'>
              <span>{firstSpeaker.name}</span>
              <p className='text-muted-foreground text-sm'>{firstSpeaker.company}</p>
            </div>
          </div>

          <div className='flex flex-1 flex-col gap-2'>
            <Link
              href={ROUTES.TALK(talk.id)}
              className='hover:opacity-70'
              rel='noopener noreferrer'
              target='_blank'
            >
              <h3 className='text-2xl leading-tight font-semibold'>{talk.title}</h3>
            </Link>

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
            <div className='prose prose-sm dark:prose-invert text-muted-foreground mt-2 max-w-none'>
              <ReactMarkdown>{talk.description}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className='mt-30 flex w-full justify-center'>
          <div className='bg-background/90 text-foreground border-border flex items-center justify-center gap-2 rounded-full border px-4 py-3 shadow-sm backdrop-blur'>
            <Button
              className={cn(
                'cursor-pointer rounded-full hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400'
              )}
              disabled={isPending}
              size='lg'
              onClick={() => onAnswer('likes')}
            >
              <HeartIcon className='size-4!' /> <IntlText path='button.like' />
            </Button>

            <Button
              className={cn(
                'cursor-pointer rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
              )}
              disabled={isPending}
              size='lg'
              onClick={() => onAnswer('wantsToWatch')}
            >
              <EyeIcon className='size-4!' /> <IntlText path='button.wantToWatch' />
            </Button>

            <Button
              className={cn(
                'hover:blue-green-100 cursor-pointer rounded-full hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400'
              )}
              disabled={isPending}
              size='lg'
              onClick={() => onAnswer('skip')}
            >
              <IntlText path='button.skip' /> <ChevronRightIcon className='size-4!' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
