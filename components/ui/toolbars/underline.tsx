'use client';

import { UnderlineIcon } from 'lucide-react';
import React from 'react';

import type {ButtonProps} from '@/components/ui/button';

import { Button  } from '@/components/ui/button';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const UnderlineToolbar = ({ ref, className, onClick, children, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            className={cn('h-8 w-8', editor?.isActive('underline') && 'bg-accent', className)}
            disabled={!editor?.can().chain().focus().toggleUnderline().run()}
            size='icon'
            variant='ghost'
            onClick={(e) => {
              editor?.chain().focus().toggleUnderline().run();
              onClick?.(e);
            }}
            {...props}
          >
            {children || <UnderlineIcon className='h-4 w-4' />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Underline</span>
          <span className='text-gray-11 ml-1 text-xs'>(cmd + u)</span>
        </TooltipContent>
      </Tooltip>
    );
  };

UnderlineToolbar.displayName = 'UnderlineToolbar';

export { UnderlineToolbar };
