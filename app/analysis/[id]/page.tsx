import type { Metadata } from 'next';

import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

import type { TalkResponse } from '@/app/api/talks/[id]/route';

import { ROUTES } from '@/app/(constants)';
import { api } from '@/app/api/instance';
import { Button } from '@/components/ui';

import { ActionPanel, CopyButton } from './(components)';
import { AnalysisProvider } from './provider';

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: AnalysisPageProps): Promise<Metadata> => {
  const { id } = await params;

  const talkResponse = await api.get<TalkResponse>(`/talks/${id}`);

  const talk = talkResponse.data.talk;

  const title = talk.title;
  const description = talk.description;

  return {
    title: `${title} - confreviewer`,
    description
  };
};

const AnalysisPage = async ({ params }: AnalysisPageProps) => {
  const { id } = await params;

  const talkResponse = await api.get<TalkResponse>(`/talks/${id}`);

  if (!talkResponse.data) notFound();

  const { talk } = talkResponse.data;

  const [firstSpeaker, ...otherSpeakers] = talk.speakers;

  return (
    <AnalysisProvider talk={{ initialTalk: talk }}>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <div className='flex flex-col items-start justify-between gap-4'>
            <div className='flex w-full justify-between gap-2'>
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

              <div className='flex justify-between gap-2'>
                <CopyButton />
                <Button asChild size='icon' variant='secondary'>
                  <a href={talk.url} rel='noopener noreferrer' target='_blank'>
                    <ExternalLinkIcon className='size-4' />
                  </a>
                </Button>
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

            <h1 className='text-3xl font-medium'>{talk.title}</h1>

            <div className='prose prose-sm dark:prose-invert max-w-none'>
              <ReactMarkdown>{talk.description}</ReactMarkdown>
            </div>
          </div>
        </div>

        <ActionPanel />

        <div className='mt-6 flex items-center justify-between gap-4'>
          {talk.logo && (
            <Link
              href={ROUTES.CONFERENCE_FEED(talk.conferenceId)}
              rel='noopener noreferrer'
              target='_blank'
            >
              <img alt={`${talk.title} logo`} className='h-10 object-cover' src={talk.logo} />
            </Link>
          )}
        </div>
      </div>
    </AnalysisProvider>
  );
};

export default AnalysisPage;
