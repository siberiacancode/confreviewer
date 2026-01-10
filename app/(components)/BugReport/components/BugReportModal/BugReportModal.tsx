'use client';

import { FileIcon } from 'lucide-react';

import type { ModalProps } from '@/components/common';

import { IntlText } from '@/app/(contexts)/intl';
import { Modal } from '@/components/common';
import {
  Button,
  Dropzone,
  DropzoneContent,
  DropzoneContentCancel,
  DropzoneContentImage,
  DropzonePreview,
  DropzonePreviewDescription,
  DropzonePreviewMedia,
  DropzonePreviewTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  Input,
  Textarea
} from '@/components/ui';

import { useBugReportModal } from './hooks';

export type BugReportModalProps = ModalProps;

export const BugReportModal = (props: BugReportModalProps) => {
  const { refs, features, form, state, functions } = useBugReportModal(props);

  return (
    <Modal {...props} title='Отчет о баге' description='Пожалуйста, опишите проблему подробно'>
      <form onSubmit={functions.onSubmit}>
        <FieldSet disabled={form.formState.isSubmitting}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='bug-report-title'>Проблема</FieldLabel>
              <Input
                {...form.register('title')}
                id='bug-report-title'
                autoComplete='off'
                placeholder='Что пошло не так?'
              />
              {form.formState.errors.title && (
                <FieldError>{form.formState.errors.title.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor='bug-report-description'>Описание</FieldLabel>
              <Textarea
                {...form.register('description')}
                id='bug-report-description'
                autoComplete='off'
                placeholder='Подробности, шаги воспроизведения...'
              />
              {form.formState.errors.description && (
                <FieldError>{form.formState.errors.description.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor='bug-report-file'>Скриншот</FieldLabel>

              <Dropzone ref={features.screenshotDropzone.ref} onClick={functions.onDropZoneClick}>
                {state.screenshot ? (
                  <DropzoneContent>
                    <DropzoneContentImage
                      alt='Предпросмотр скриншота'
                      src={state.screenshot}
                      onLoad={() => URL.revokeObjectURL(state.screenshot!)}
                    />

                    <DropzoneContentCancel
                      aria-label='Очистить файл'
                      onClick={(event) => {
                        event.stopPropagation();
                        functions.onScreenshotClear();
                      }}
                    />
                  </DropzoneContent>
                ) : (
                  <DropzonePreview>
                    <DropzonePreviewMedia variant='icon'>
                      <FileIcon className='size-5' />
                    </DropzonePreviewMedia>
                    <DropzonePreviewTitle>Добавьте скриншот</DropzonePreviewTitle>
                    <DropzonePreviewDescription>
                      Перетащите или нажмите для выбора файла (до 5 МБ)
                    </DropzonePreviewDescription>
                  </DropzonePreview>
                )}
              </Dropzone>

              <input
                ref={refs.screenshotInput}
                accept='image/*'
                className='sr-only'
                id='bug-report-file'
                type='file'
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  functions.onScreenshotDrop(file);
                }}
              />
              {form.formState.errors.screenshot && (
                <FieldError>{form.formState.errors.screenshot.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <div className='flex justify-end'>
            <Button className='rounded-full' type='submit'>
              <IntlText path='button.submit' />
            </Button>
          </div>
        </FieldSet>
      </form>
    </Modal>
  );
};
