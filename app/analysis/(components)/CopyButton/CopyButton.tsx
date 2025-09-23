'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon, CopyIcon } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui';

import { htmlToMarkdown } from '../../(actions)';

interface CopyButtonProps {
  talk: any;
}

export const CopyButton = ({ talk }: CopyButtonProps) => {
  const { copied, copy } = useCopy();

  const onCopyClick = async () => {
    const description = await htmlToMarkdown(talk.description);
    copy(`**${talk.title} - ${talk.speaker}**\n\n${talk.url}\n\n${description}\n`);
  };

  const onGetOgImage = () => window.open(`/analysis/${talk.id}/opengraph-image`, '_blank');

  return (
    <div className='inline-flex w-fit rounded-md shadow-xs'>
      <Button
        className='cursor-pointer rounded-none rounded-s-md shadow-none focus-visible:z-10'
        variant='secondary'
        onClick={onCopyClick}
      >
        {copied ? (
          <>
            <CheckIcon className='size-4' />
            Copied
          </>
        ) : (
          <>
            <CopyIcon className='size-4' />
            Copy
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='rounded-none rounded-e-md shadow-none focus-visible:z-10'
            size='icon'
            variant='secondary'
          >
            <a href='#' rel='noopener noreferrer' target='_blank'>
              <ChevronDownIcon />
              <span className='sr-only'>External link</span>
            </a>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onGetOgImage}>Get og image</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
