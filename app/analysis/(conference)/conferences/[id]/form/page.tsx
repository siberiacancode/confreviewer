import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { ConferenceResponse } from '@/app/api/conferences/[id]/route';
import type { TalksResponse } from '@/app/api/talks/route';

import { COOKIES, ROUTES } from '@/app/(constants)';
import { api } from '@/app/api/instance';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui';

import type { ConferenceFormMode } from './(contexts)/conferenceForm';

import {
  ConferenceFormBanner,
  ConferenceFormEmpty,
  ConferenceFormFeed,
  ConferenceFormList
} from './(components)';
import { ConferenceFormProvider } from './provider';

interface ConferenceFormPageProps {
  params: Promise<{ id: string }>;
}

const getInitialMode = async () => {
  const cookiesStore = await cookies();
  return (cookiesStore.get(COOKIES.CONFERENCE_FORM_MODE)?.value ?? 'feed') as ConferenceFormMode;
};

const ConferenceFormPage = async ({ params }: ConferenceFormPageProps) => {
  const { id } = await params;
  const conferenceResponse = await api.get<ConferenceResponse>(`/conferences/${id}`);

  if (!conferenceResponse.data) notFound();

  const { conference } = conferenceResponse.data;

  const talksResponse = await api.get<TalksResponse>(`/talks?conferenceId=${id}`);
  const talks = talksResponse.data.talks;

  const initialMode = await getInitialMode();

  return (
    <ConferenceFormProvider conferenceForm={{ initialMode }}>
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
              <BreadcrumbLink asChild>
                <Link href={ROUTES.CONFERENCE_FEED(id)}>{conference.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Опрос</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {!!talks.length && <ConferenceFormBanner conference={conference} />}

        {initialMode === 'list' && !!talks.length && (
          <div className='mt-10'>
            <ConferenceFormList talks={talks} />
          </div>
        )}
        {initialMode === 'feed' && !!talks.length && (
          <div className='mt-10'>
            <ConferenceFormFeed
              talks={talks.filter((talk) => !talk.wantedToWatch && !talk.liked)}
            />
          </div>
        )}
        {!talks.length && <ConferenceFormEmpty conference={conference} />}
      </div>
    </ConferenceFormProvider>
  );
};

export default ConferenceFormPage;
