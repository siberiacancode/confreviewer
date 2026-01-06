'use client';

import type { SerializedEditorState } from 'lexical';

import { ChevronLeftIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/app/(constants)';
import { Editor } from '@/components/blocks/editor-00/editor';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Input
} from '@/components/ui';

import { SpeakerTalkUpdateDialog } from '../SpeakerTalkUpdateDialog/SpeakerTalkUpdateDialog';
import { useEditTalkForm } from './hooks';

const serializeDescription = (description: string): SerializedEditorState =>
  ({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: description,
              type: 'text',
              version: 1
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1
        }
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1
    }
  }) as unknown as SerializedEditorState;

export const EditTalkForm = () => {
  const { form, features, state, functions } = useEditTalkForm();

  return (
    <>
      <form className='mx-auto flex max-w-5xl flex-col gap-6 py-10' onSubmit={functions.onSubmit}>
        <div className='flex justify-between'>
          <Button asChild className='rounded-full' variant='ghost'>
            <Link href={ROUTES.TALK(state.talk.id)} className='flex items-center gap-2 font-medium'>
              <ChevronLeftIcon className='size-4' />
              Назад
            </Link>
          </Button>

          <Button className='rounded-full' disabled={state.loading || !state.isDirty} type='submit'>
            Сохранить изменения
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
          <Editor
            editorSerializedState={serializeDescription(form.getValues('description'))}
            onSerializedChange={(value) =>
              form.setValue('description', JSON.stringify(value), { shouldDirty: true })
            }
          />
        </div>

        <div className='flex justify-start gap-2'>
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
                  Edit
                </ContextMenuItem>
                <ContextMenuItem
                  className='text-destructive'
                  onClick={() => functions.onSpeakerDelete(speaker.id)}
                >
                  Delete
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
