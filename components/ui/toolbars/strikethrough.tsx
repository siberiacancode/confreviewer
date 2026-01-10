'use client';

import { Strikethrough } from 'lucide-react';
import React from 'react';

import type {ButtonProps} from '@/components/ui/button';

import { Button  } from '@/components/ui/button';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const StrikeThroughToolbar = ({ ref, className, onClick, children, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            className={cn('h-8 w-8', editor?.isActive('strike') && 'bg-accent', className)}
            disabled={!editor?.can().chain().focus().toggleStrike().run()}
            size='icon'
            variant='ghost'
            onClick={(e) => {
              editor?.chain().focus().toggleStrike().run();
              onClick?.(e);
            }}
            {...props}
          >
            {children || <Strikethrough className='h-4 w-4' />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Strikethrough</span>
          <span className='text-gray-11 ml-1 text-xs'>(cmd + shift + x)</span>
        </TooltipContent>
      </Tooltip>
    );
  };

StrikeThroughToolbar.displayName = 'StrikeThroughToolbar';

export { StrikeThroughToolbar };
