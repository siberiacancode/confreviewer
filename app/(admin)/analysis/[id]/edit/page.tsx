import { notFound } from 'next/navigation';

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
  const talk = talkResponse.data?.talk;

  if (!talk) notFound();

  return (
    <AdminEditProvider talk={{ initialTalk: talk }}>
      <EditTalkForm />
    </AdminEditProvider>
  );
};

export default AdminEditPage;
