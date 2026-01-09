'use client';

import { useDropZone } from '@siberiacancode/reactuse';
import { FileIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { ModalProps } from '@/components/common';

import { Modal } from '@/components/common';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

import { useBugReportModal } from './hooks';

export type BugReportModalProps = ModalProps;

export const BugReportModal = (props: BugReportModalProps) => {
  const { form, functions } = useBugReportModal();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setScreenshot = (file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    const nextPreview = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = nextPreview;
    setPreviewUrl(nextPreview);
    form.setValue('screenshot', file ?? undefined, { shouldValidate: true, shouldDirty: true });
  };

  const dropzone = useDropZone<HTMLDivElement>({
    multiple: false,
    dataTypes: ['image/*'],
    onDrop: (files) => {
      const file = files?.[0] ?? null;
      setScreenshot(file);
    }
  });

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    []
  );

  const onOpenFileDialog = () => fileInputRef.current?.click();

  const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenFileDialog();
    }
  };

  const screenshot = form.watch('screenshot');
  const hasPreview = Boolean(previewUrl || screenshot);

  return (
    <Modal {...props}>
      <form className='flex flex-col gap-3' onSubmit={functions.onSubmit}>
        <label className='text-muted-foreground text-sm' htmlFor='bug-report-title'>
          Проблема
          <Input
            className='mt-1'
            id='bug-report-title'
            placeholder='Что пошло не так?'
            {...form.register('title')}
          />
        </label>

        <label className='text-muted-foreground text-sm' htmlFor='bug-report-description'>
          Описание
          <textarea
            className='bg-background focus:ring-primary mt-1 w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2'
            id='bug-report-description'
            placeholder='Подробности, шаги воспроизведения...'
            rows={4}
            {...form.register('description')}
          />
        </label>

        <label className='text-muted-foreground text-sm' htmlFor='bug-report-file'>
          Скриншот
          <div
            ref={dropzone.ref}
            className={cn(
              'focus-visible:ring-primary/40 relative mt-1 flex min-h-[200px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border transition outline-none focus-visible:ring-2',
              hasPreview ? 'border-border' : 'border-border hover:border-primary/70 border-dashed',
              dropzone.overed && 'border-primary bg-primary/5'
            )}
            tabIndex={0}
            onKeyDown={onKeyPress}
            role='button'
          >
            {hasPreview ? (
              <>
                {previewUrl && (
                  <>
                    <img
                      alt={screenshot?.name ?? 'Превью файла'}
                      className='absolute inset-0 h-full w-full scale-110 object-cover blur-md'
                      src={previewUrl}
                    />
                    <div className='bg-background/40 absolute inset-0' />
                  </>
                )}
                <div className='relative z-10 flex h-full w-full items-center justify-center p-3'>
                  {previewUrl ? (
                    <img
                      alt={screenshot?.name ?? 'Превью файла'}
                      className='max-h-[200px] max-w-full rounded-md object-contain shadow-md'
                      src={previewUrl}
                    />
                  ) : (
                    <div className='text-muted-foreground text-sm'>Файл выбран</div>
                  )}
                </div>
                <button
                  aria-label='Очистить файл'
                  className='bg-background/80 text-foreground hover:bg-background ring-border absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full shadow-sm ring-1 backdrop-blur transition'
                  type='button'
                  onClick={(event) => {
                    event.stopPropagation();
                    setScreenshot(null);
                  }}
                >
                  <XIcon className='size-4' />
                </button>
              </>
            ) : (
              <div className='flex flex-col items-center gap-2 text-center'>
                <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full'>
                  <FileIcon className='size-4' />
                </div>
                <div className='space-y-1'>
                  <div className='text-sm font-medium'>Добавьте скриншот</div>
                  <div className='text-muted-foreground text-xs'>
                    Перетащите или нажмите для выбора файла (до 5 МБ)
                  </div>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            accept='image/*'
            className='sr-only'
            id='bug-report-file'
            type='file'
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setScreenshot(file);
            }}
          />
        </label>

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='ghost' onClick={() => props.onOpenChange(false)}>
            Отмена
          </Button>
          <Button type='submit'>Отправить</Button>
        </div>
      </form>
    </Modal>
  );
};
