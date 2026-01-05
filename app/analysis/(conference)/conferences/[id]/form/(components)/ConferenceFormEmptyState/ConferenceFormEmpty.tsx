import Link from 'next/link';

import type { ConferenceResponse } from '@/app/api/conferences/[id]/route';

import { Button } from '@/components/ui';

type Conference = ConferenceResponse['conference'];

interface ConferenceFormEmptyProps {
  conference: Conference;
}

export const ConferenceFormEmpty = ({ conference }: ConferenceFormEmptyProps) => (
  <div className='flex flex-col justify-start'>
    {conference.logo && (
      <div className='bg-muted flex size-16 items-center justify-center overflow-hidden rounded-lg p-2'>
        <img alt={conference.name} className='size-full object-contain' src={conference.logo} />
      </div>
    )}
    <h2 className='mt-4 text-4xl font-semibold'>Нет докладов {conference.name}</h2>
    <p className='text-muted-foreground mt-2 text-lg'>
      На данный момент данная конференция не имеет доступных докладов для опроса.
    </p>
    <Button asChild className='mt-6 w-fit rounded-full'>
      <Link href={`/analysis/conferences/${conference.id}`}>Вернуться</Link>
    </Button>
  </div>
);
