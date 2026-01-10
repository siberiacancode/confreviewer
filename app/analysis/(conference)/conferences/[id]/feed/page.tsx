import type { Metadata } from 'next';

import { ExternalLinkIcon, EyeIcon, FileTextIcon, HeartIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import z from 'zod';

import type { ConferenceResponse } from '@/app/api/conferences/[id]/route';
import type { TalksResponse } from '@/app/api/talks/route';

import { ROUTES } from '@/app/(constants)';
import { IntlText } from '@/app/(contexts)/intl';
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

import { ConferenceFeedFilters } from './(components)/ConferenceFeedFilters/ConferenceFeedFilters';
import { TalkItem } from './(components)/TalkItem/TalkItem';

interface ConferenceFeedParams {
  id: string;
}

const conferenceFeedSearchParamsSchema = z.object({
  search: z.string().optional().default(''),
  popular: z.boolean().optional().default(false),
  demanded: z.boolean().optional().default(false),
  sort: z.enum(['asc', 'desc']).optional().default('asc')
});

export type ConferenceFeedSearchParams = z.infer<typeof conferenceFeedSearchParamsSchema>;

interface ConferencePageProps {
  params: Promise<ConferenceFeedParams>;
  searchParams?: Promise<ConferenceFeedSearchParams>;
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

const ConferencePage = async ({ params, searchParams }: ConferencePageProps) => {
  const { id } = await params;

  const conferenceResponse = await api.get<ConferenceResponse>(`/conferences/${id}`);

  if (!conferenceResponse.data) notFound();

  const { conference } = conferenceResponse.data;

  const queryParams = await searchParams;
  const validatedParams = conferenceFeedSearchParamsSchema.safeParse(queryParams);

  const talksQuery = {
    conferenceId: id,
    search: validatedParams.data!.search,
    popular: validatedParams.data!.popular,
    demanded: validatedParams.data!.demanded,
    sortBy: validatedParams.data!.sort
  };

  const talksResponse = await api.get<TalksResponse>('/talks', { query: talksQuery });
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

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-start justify-between gap-4'>
            {conference.logo && (
              <div className='bg-muted flex size-16 items-center justify-center overflow-hidden rounded-lg p-3'>
                <img
                  alt={conference.name}
                  className='size-full object-contain'
                  src={conference.logo}
                />
              </div>
            )}

            <ButtonGroup>
              <Button asChild size='sm' title='Опрос' variant='secondary'>
                <Link href={ROUTES.CONFERENCE_FORM(conference.id)} target='_blank'>
                  <StarIcon className='size-4' />
                  <IntlText path='button.survey' />
                </Link>
              </Button>
              <Button asChild size='icon' title='Перейти к докладам' variant='secondary'>
                <a href={conference.url} rel='noopener noreferrer' target='_blank'>
                  <ExternalLinkIcon aria-label='Перейти к докладам' className='size-4' />
                </a>
              </Button>
            </ButtonGroup>
          </div>

          <div className='flex flex-1 gap-4'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl font-semibold'>{conference.name}</h1>
              {conference.description && (
                <p className='text-muted-foreground'>{conference.description}</p>
              )}
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            {!!totalLikes && (
              <div className='flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1.5 text-sm text-pink-800 dark:bg-pink-500/15 dark:text-pink-100'>
                <HeartIcon aria-label='Лайки' className='size-4' />
                <span className='font-semibold'>{totalLikes}</span>
              </div>
            )}
            {!!totalWantsToWatch && (
              <div className='flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm text-blue-800 dark:bg-blue-500/15 dark:text-blue-100'>
                <EyeIcon aria-label='Просмотры' className='size-4' />
                <span className='font-semibold'>{totalWantsToWatch}</span>
              </div>
            )}
            <div className='flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-800 dark:bg-slate-500/15 dark:text-slate-100'>
              <FileTextIcon aria-label='Доклады' className='size-4' />
              <span className='font-semibold'>{talks.length}</span>
            </div>

            <ConferenceFeedFilters />
          </div>
        </div>
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
