'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const EditModeTogglePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={`${!isEditable ? 'Unlock' : 'Lock'} read-only mode`}
          className='p-2'
          size={'sm'}
          title='Read-Only Mode'
          variant={'ghost'}
          onClick={() => {
            editor.setEditable(!editor.isEditable());
            setIsEditable(editor.isEditable());
          }}
        >
          {isEditable ? <LockIcon className='size-4' /> : <UnlockIcon className='size-4' />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isEditable ? 'View Only Mode' : 'Edit Mode'}</TooltipContent>
    </Tooltip>
  );
};
