'use client';

import { ChevronLeftIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/app/(constants)';
import { IntlText } from '@/app/(contexts)/intl';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Input,
  Tiptap
} from '@/components/ui';

import { SpeakerTalkUpdateDialog } from '../SpeakerTalkUpdateDialog/SpeakerTalkUpdateDialog';
import { useEditTalkForm } from './hooks';

export const EditTalkForm = () => {
  const { form, features, state, functions } = useEditTalkForm();

  return (
    <>
      <form className='mx-auto flex max-w-5xl flex-col gap-6 py-10' onSubmit={functions.onSubmit}>
        <div className='flex justify-between'>
          <Button asChild className='rounded-full' variant='ghost'>
            <Link href={ROUTES.TALK(state.talk.id)} className='flex items-center gap-2 font-medium'>
              <ChevronLeftIcon className='size-4' />
              <IntlText path='button.back' />
            </Link>
          </Button>

          <Button className='rounded-full' disabled={state.loading || !state.isDirty} type='submit'>
            <IntlText path='button.saveChanges' />
          </Button>
        </div>

        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-semibold'>Редактирование доклада</h1>
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-md font-medium'>Название</p>
          <Input
            aria-invalid={!!form.formState.errors.title}
            defaultValue={state.talk.title}
            placeholder='Название доклада'
            {...form.register('title', { required: 'Укажите название' })}
          />
          {form.formState.errors.title?.message && (
            <p className='text-destructive text-sm'>{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-md font-medium'>Описание</p>
          <Tiptap
            content={form.getValues('description')}
            onUpdate={({ editor }) =>
              form.setValue('description', editor.getMarkdown(), { shouldDirty: true })
            }
          />
        </div>

        <div className='flex justify-start gap-2'>
          <ContextMenu modal={false}>
            <ContextMenuTrigger asChild>
              <button
                className='bg-card hover:border-primary/50 flex items-center gap-3 rounded-full border p-4 text-left transition'
                type='button'
              >
                <div className='bg-muted flex size-12 items-center justify-center overflow-hidden rounded-lg p-2'>
                  {state.conference.logo && (
                    <img
                      alt={state.conference.name}
                      className='size-full object-contain'
                      src={state.conference.logo}
                    />
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{state.conference.name}</span>
                  {/* <span className='text-muted-foreground text-sm'>{state.conference.description}</span> */}
                </div>
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <IntlText path='button.edit' />
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          {state.speakers.map((speaker) => (
            <ContextMenu key={speaker.id} modal={false}>
              <ContextMenuTrigger asChild>
                <button
                  className='bg-card hover:border-primary/50 flex items-center gap-3 rounded-full border p-4 text-left transition'
                  type='button'
                  onClick={() => functions.onSpeakerEdit(speaker)}
                >
                  <Avatar className='size-12'>
                    {speaker.avatar && <AvatarImage alt={speaker.name} src={speaker.avatar} />}
                    <AvatarFallback>{speaker.name?.[0] ?? '?'}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col gap-1'>
                    <span className='font-semibold'>{speaker.name}</span>
                    <span className='text-muted-foreground text-sm'>{speaker.company}</span>
                  </div>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => functions.onSpeakerEdit(speaker)}>
                  <IntlText path='button.edit' />
                </ContextMenuItem>
                <ContextMenuItem
                  className='text-destructive'
                  onClick={() => functions.onSpeakerDelete(speaker.id)}
                >
                  <IntlText path='button.delete' />
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}

          <button
            className='border-muted-foreground/40 text-muted-foreground hover:border-primary/60 hover:text-primary flex w-42 items-center justify-center gap-2 rounded-full border-2 border-dashed p-4 transition'
            type='button'
            onClick={functions.onSpeakerAdd}
          >
            <PlusIcon className='size-6' />
          </button>
        </div>
      </form>

      {features.speakerDialogDisclosure.opened && (
        <SpeakerTalkUpdateDialog
          speaker={state.selectedSpeaker}
          onDelete={functions.onSpeakerDelete}
          onOpenChange={functions.onSpeakerDialogClose}
          onSubmit={functions.onSpeakerSubmit}
          open={features.speakerDialogDisclosure.opened}
        />
      )}
    </>
  );
};
