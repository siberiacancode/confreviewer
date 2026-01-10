import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type DropzoneProps = React.ComponentProps<'div'>;

const Dropzone = ({ className, ...props }: DropzoneProps) => (
  <div
    className={cn(
      'bg-background/60 focus-visible:ring-ring dark:bg-input/30 relative mt-1 flex h-[200px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border transition focus-visible:ring-2 focus-visible:outline-none',
      className
    )}
    {...props}
  />
);

type DropzonePreviewProps = React.ComponentProps<'div'>;

const DropzonePreview = ({ className, ...props }: DropzonePreviewProps) => (
  <div
    className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
    {...props}
  />
);

const dropzonePreviewMediaVariants = cva(
  'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

type DropzonePreviewMediaProps = React.ComponentProps<'div'> &
  VariantProps<typeof dropzonePreviewMediaVariants>;

const DropzonePreviewMedia = ({
  className,
  variant = 'default',
  ...props
}: DropzonePreviewMediaProps) => (
  <div className={cn(dropzonePreviewMediaVariants({ variant, className }))} {...props} />
);

type DropzonePreviewTitleProps = React.ComponentProps<'div'>;

const DropzonePreviewTitle = ({ className, ...props }: DropzonePreviewTitleProps) => (
  <div className={cn('text-md font-medium tracking-tight', className)} {...props} />
);

type DropzonePreviewDescriptionProps = React.ComponentProps<'p'>;

const DropzonePreviewDescription = ({ className, ...props }: DropzonePreviewDescriptionProps) => (
  <p className={cn('text-muted-foreground text-xs', className)} {...props} />
);

type DropzoneContentProps = React.ComponentProps<'div'>;

const DropzoneContent = ({ className, ...props }: DropzoneContentProps) => (
  <div
    className={cn(
      'flex h-full w-full flex-col items-center justify-center gap-2 text-center',
      className
    )}
    {...props}
  />
);

type DropzoneContentImageProps = React.ComponentProps<'img'>;

const DropzoneContentImage = ({ className, alt = '', ...props }: DropzoneContentImageProps) => (
  <div>
    <>
      <img
        alt={alt}
        className='absolute inset-0 h-full w-full scale-110 object-cover blur-md'
        src={props.src}
      />
      <div className='bg-background/10 absolute inset-0' />
    </>

    <div className='relative z-10 flex items-center justify-center'>
      <img alt={alt} className='max-h-[160px] max-w-full rounded-md object-contain' {...props} />
    </div>
  </div>
);

type DropzoneContentCancelProps = React.ComponentProps<'button'>;

const DropzoneContentCancel = ({ className, ...props }: DropzoneContentCancelProps) => (
  <button
    className={cn(
      'bg-background/80 text-foreground hover:bg-background ring-border focus-visible:ring-ring absolute top-3 right-3 z-20 inline-flex size-9 items-center justify-center rounded-full shadow-sm ring-1 backdrop-blur transition focus-visible:ring-2 focus-visible:outline-none',
      className
    )}
    type='button'
    {...props}
  >
    <XIcon className='size-4' />
  </button>
);

export {
  Dropzone,
  DropzoneContent,
  DropzoneContentCancel,
  DropzoneContentImage,
  DropzonePreview,
  DropzonePreviewDescription,
  DropzonePreviewMedia,
  DropzonePreviewTitle
};
