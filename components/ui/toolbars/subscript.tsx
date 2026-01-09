'use client';

import { Subscript } from 'lucide-react';
import React from 'react';

import type { ButtonProps } from '@/components/ui/button';

import { Button } from '@/components/ui/button';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const SubscriptToolbar = ({
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
          className={cn('h-8 w-8', editor?.isActive('subscript') && 'bg-accent', className)}
          disabled={!editor?.can().chain().focus().toggleSubscript().run()}
          size='icon'
          variant='ghost'
          onClick={(e) => {
            editor?.chain().focus().toggleSubscript().run();
            onClick?.(e);
          }}
          {...props}
        >
          {children || <Subscript className='h-4 w-4' />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Subscript</span>
      </TooltipContent>
    </Tooltip>
  );
};

SubscriptToolbar.displayName = 'SubscriptToolbar';

export { SubscriptToolbar };
