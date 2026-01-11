'use client';

import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';

import type { Conference } from '@/app/api/types';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Switch
} from '@/components/ui';

import { useConferenceForm } from '../../(contexts)/conferenceForm';

interface ConferenceFormBannerProps {
  conference: Conference;
}

export const ConferenceFormBanner = ({ conference }: ConferenceFormBannerProps) => {
  const conferenceForm = useConferenceForm();

  return (
    <div className='flex items-start justify-between'>
      <div className='flex flex-col items-start gap-2'>
        <div className='flex items-center gap-2'>
          {conference.logo && (
            <div className='bg-muted flex size-12 items-center justify-center overflow-hidden rounded-lg p-2'>
              <img
                alt={conference.name}
                className='size-full object-contain'
                src={conference.logo}
              />
            </div>
          )}

          <h1 className='text-3xl font-semibold'>{conference.name}</h1>
        </div>

        <div className='flex-1'>
          {conference.description && (
            <p className='text-muted-foreground mt-2 text-sm'>{conference.description}</p>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='secondary'>
            <EllipsisIcon className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem asChild>
            <Link href={conference.url} rel='noopener noreferrer' target='_blank'>
              Open conference
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={conferenceForm.switchMode}>
            <Switch checked={conferenceForm.mode === 'feed'} />
            Change mode
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
