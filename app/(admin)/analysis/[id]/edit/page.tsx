import { notFound } from 'next/navigation';

import type { ConferenceResponse } from '@/app/api/conferences/[id]/route';
import type { TalkResponse } from '@/app/api/talks/[id]/route';

import { api } from '@/app/api/instance';

import { EditTalkForm } from './(components)';
import { AdminEditProvider } from './provider';

interface AdminEditPageProps {
  params: Promise<{ id: string }>;
}

const AdminEditPage = async ({ params }: AdminEditPageProps) => {
  const { id } = await params;
  const talkResponse = await api.get<TalkResponse>(`/talks/${id}`);

  if (!talkResponse.data) notFound();

  const talk = talkResponse.data.talk;

  const conferenceResponse = await api.get<ConferenceResponse>(`/conferences/${talk.conferenceId}`);

  if (!conferenceResponse.data) notFound();

  const conference = conferenceResponse.data.conference;

  return (
    <AdminEditProvider talk={{ initialTalk: talk }} conference={{ initialConference: conference }}>
      <EditTalkForm />
    </AdminEditProvider>
  );
};

export default AdminEditPage;
