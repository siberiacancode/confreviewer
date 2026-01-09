'use client';

import { BoldIcon } from 'lucide-react';
import React from 'react';

import type { ButtonProps } from '@/components/ui';

import { Button } from '@/components/ui';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const BoldToolbar = ({
  ref,
  className,
  onClick,
  children,
  ...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useToolbar();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          className={cn('h-8 w-8', editor?.isActive('bold') && 'bg-accent', className)}
          disabled={!editor?.can().chain().focus().toggleBold().run()}
          size='icon'
          variant='ghost'
          onClick={(e) => {
            editor?.chain().focus().toggleBold().run();
            onClick?.(e);
          }}
          {...props}
        >
          {children || <BoldIcon className='h-4 w-4' />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Bold</span>
        <span className='text-gray-11 ml-1 text-xs'>(cmd + b)</span>
      </TooltipContent>
    </Tooltip>
  );
};

BoldToolbar.displayName = 'BoldToolbar';

export { BoldToolbar };
