import type { Metadata } from 'next';

import { ExternalLinkIcon, EyeIcon, FileTextIcon, HeartIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { ConferenceResponse } from '@/app/api/conferences/[id]/route';
import type { TalksResponse } from '@/app/api/talks/route';

import { ROUTES } from '@/app/(constants)';
import { api } from '@/app/api/instance';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup
} from '@/components/ui';

import { TalkItem } from './(components)/TalkItem/TalkItem';

interface ConferencePageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: ConferencePageProps): Promise<Metadata> => {
  const { id } = await params;

  const conferenceResponse = await api.get<ConferenceResponse>(`/conferences/${id}`);
  const conference = conferenceResponse.data.conference;

  return {
    title: `${conference.name}`,
    description: conference.description
  };
};

const ConferencePage = async ({ params }: ConferencePageProps) => {
  const { id } = await params;
  const conferenceResponse = await api.get<ConferenceResponse>(`/conferences/${id}`);

  if (!conferenceResponse.data) notFound();

  const { conference } = conferenceResponse.data;

  const talksResponse = await api.get<TalksResponse>(`/talks?conferenceId=${id}`);
  const talks = talksResponse.data.talks;

  const totalLikes = talks.reduce((acc, talk) => acc + talk.likes, 0);
  const totalWantsToWatch = talks.reduce((acc, talk) => acc + talk.wantsToWatch, 0);

  return (
    <div className='flex flex-col gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={ROUTES.CONFERENCES}>Конференции</Link>
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
              {!!totalLikes && (
                <div className='flex items-center gap-1 text-sm font-medium text-pink-500 dark:text-pink-400'>
                  <HeartIcon aria-label='Лайки' className='size-4' />
                  {totalLikes}
                </div>
              )}
              {!!totalWantsToWatch && (
                <div className='flex items-center gap-1 text-sm font-medium text-blue-500 dark:text-blue-400'>
                  <EyeIcon aria-label='Просмотры' className='size-4' />
                  {totalWantsToWatch}
                </div>
              )}
              <div className='flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
                <FileTextIcon aria-label='Доклады' className='size-4' />
                {talks.length}
              </div>
            </div>
          </div>
        </div>

        <ButtonGroup>
          <Button asChild size='sm' title='Опрос' variant='secondary'>
            <Link href={ROUTES.CONFERENCE_FORM(conference.id)} target='_blank'>
              <PencilIcon className='size-4' />
              Опрос
            </Link>
          </Button>
          <Button asChild size='icon' title='Перейти к докладам' variant='secondary'>
            <a href={conference.url} rel='noopener noreferrer' target='_blank'>
              <ExternalLinkIcon aria-label='Перейти к докладам' className='size-4' />
            </a>
          </Button>
        </ButtonGroup>
      </div>

      <ul className='mb-10 flex flex-col gap-6'>
        {talks.map((talk) => (
          <li key={talk.id}>
            <TalkItem talk={talk} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConferencePage;
