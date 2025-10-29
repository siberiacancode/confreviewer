import type { Metadata } from 'next';

import { ExternalLinkIcon, EyeIcon, FileTextIcon, HeartIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card
} from '@/components/ui';

import { getConferenceById } from '../../helpers/getConferences';

interface ConferencePageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: ConferencePageProps): Promise<Metadata> => {
  const { id } = await params;
  const conference = await getConferenceById(id);

  if (!conference) {
    return {
      title: 'Conference not found - ConfReviewer'
    };
  }

  return {
    title: `${conference.name} - ConfReviewer`,
    description: conference.description
  };
};

const ConferencePage = async ({ params }: ConferencePageProps) => {
  const { id } = await params;
  const conference = await getConferenceById(id);

  if (!conference) notFound();

  const totalLikes = Math.floor(Math.random() * 100) + 10;
  const totalWantsToWatch = Math.floor(Math.random() * 50) + 5;

  return (
    <div className='flex flex-col gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/analysis/conferences'>Конференции</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{conference.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex items-start justify-between gap-6'>
        <div className='flex items-start gap-4'>
          {conference.logo && (
            <div className='bg-muted flex size-16 items-center justify-center overflow-hidden rounded-lg p-3'>
              <img
                alt={conference.name}
                className='size-full object-contain'
                src={conference.logo}
              />
            </div>
          )}

          <div className='flex-1'>
            <h1 className='text-3xl font-semibold'>{conference.name}</h1>
            {conference.description && (
              <p className='text-muted-foreground mt-2'>{conference.description}</p>
            )}
            <div className='mt-3 flex items-center gap-3'>
              <div className='flex items-center gap-1 text-sm font-medium text-pink-500 dark:text-pink-400'>
                <HeartIcon aria-label='Лайки' className='size-4' />
                {totalLikes}
              </div>
              <div className='flex items-center gap-1 text-sm font-medium text-blue-500 dark:text-blue-400'>
                <EyeIcon aria-label='Просмотры' className='size-4' />
                {totalWantsToWatch}
              </div>
              <div className='flex items-center gap-1 text-sm font-medium text-black dark:text-white'>
                <FileTextIcon aria-label='Доклады' className='size-4' />
                {conference.talks.length}
              </div>
            </div>
          </div>
        </div>

        <Button asChild size='icon' title='Перейти к докладам' variant='secondary'>
          <a href={`/analysis/${id}`}>
            <ExternalLinkIcon aria-label='Перейти к докладам' className='size-4' />
          </a>
        </Button>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3'>
          {conference.talks.map((talk, index) => {
            const talkKey = `${talk.name}-${talk.talk_title}-${index}`;
            const talkLikes = Math.floor(Math.random() * 20) + 1;
            const talkWantsToWatch = Math.floor(Math.random() * 10) + 1;

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
                      size='icon'
                      title={`${talkLikes} лайков`}
                      variant='ghost'
                    >
                      <HeartIcon aria-label={`${talkLikes} лайков`} className='size-4' />
                    </Button>
                    <Button
                      className='size-9 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
                      size='icon'
                      title={`${talkWantsToWatch} хотят посмотреть`}
                      variant='ghost'
                    >
                      <EyeIcon
                        aria-label={`${talkWantsToWatch} хотят посмотреть`}
                        className='size-4'
                      />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;
