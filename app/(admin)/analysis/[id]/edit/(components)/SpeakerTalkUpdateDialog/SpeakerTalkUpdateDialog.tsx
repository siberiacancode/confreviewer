'use client';

import type { DialogProps } from '@radix-ui/react-dialog';

import type { TalkSpeaker } from '@/app/api/types';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@/components/ui';

import type { TalkUpdateFormValues } from './hooks';

import { useSpeakerTalkUpdateDialog } from './hooks';

type SpeakerTalkUpdateDialogProps = DialogProps & {
  speaker?: TalkSpeaker;
  onDelete?: (speakerId: string) => void;
  onSubmit?: (values: TalkUpdateFormValues) => void;
};

export const SpeakerTalkUpdateDialog = (props: SpeakerTalkUpdateDialogProps) => {
  const { state, functions, form } = useSpeakerTalkUpdateDialog(props);

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование спикера</DialogTitle>
        </DialogHeader>

        <form className='flex flex-col gap-4' onSubmit={functions.onSubmit}>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='flex flex-1 flex-col gap-2'>
              <label className='text-sm font-medium' htmlFor='name'>
                Имя
              </label>
              <Input
                aria-invalid={!!form.formState.errors.name}
                id='name'
                placeholder='Название доклада'
                {...form.register('name')}
              />
              {form.formState.errors.name?.message && (
                <p className='text-destructive text-sm'>{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className='flex flex-1 flex-col gap-2'>
              <label className='text-sm font-medium' htmlFor='company'>
                Компания
              </label>
              <Input
                aria-invalid={!!form.formState.errors.company}
                id='company'
                placeholder='Название компании'
                {...form.register('company')}
              />
              {form.formState.errors.company?.message && (
                <p className='text-destructive text-sm'>{form.formState.errors.company.message}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium' htmlFor='avatar'>
              Аватар
            </label>
            <Input
              aria-invalid={!!form.formState.errors.avatar}
              id='avatar'
              placeholder='Ссылка на аватар'
              {...form.register('avatar')}
            />
            {form.formState.errors.avatar?.message && (
              <p className='text-destructive text-sm'>{form.formState.errors.avatar.message}</p>
            )}
          </div>

          <div className='flex justify-end gap-2'>
            {props.speaker && (
              <Button
                className='rounded-full'
                disabled={state.loading}
                type='button'
                variant='outline'
                onClick={() => props.onDelete?.(props.speaker!.id)}
              >
                Удалить
              </Button>
            )}
            <Button className='rounded-full' disabled={state.loading} type='submit'>
              Сохранить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
