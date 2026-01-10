'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useDropZone, useEventListener } from '@siberiacancode/reactuse';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import type { ModalProps } from '@/components/common';

import { bugReport } from '@/app/api/actions';

const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;

const bugReportSchema = z
  .object({
    title: z.string().min(1, 'Укажите проблему'),
    description: z.string().min(1),
    screenshot: z.custom<{ file: File; url: string }>().optional()
  })
  .refine((data) => !data.screenshot || data.screenshot.file.size <= MAX_SCREENSHOT_SIZE, {
    path: ['screenshot'],
    message: 'Скриншот не должен превышать 5 МБ'
  })
  .refine(
    (data) =>
      !data.screenshot ||
      (data.screenshot.file.type ? data.screenshot.file.type.startsWith('image/') : true),
    {
      path: ['screenshot'],
      message: 'Поддерживаются только изображения'
    }
  );

export type BugReportFormValues = z.infer<typeof bugReportSchema>;

export type UseBugReportModalParams = ModalProps;

export const useBugReportModal = (params: UseBugReportModalParams) => {
  const screenshotInput = useRef<HTMLInputElement>(null);

  const bugReportForm = useForm<BugReportFormValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  });

  const onScreenshotDrop = (file: File) =>
    bugReportForm.setValue('screenshot', { file, url: URL.createObjectURL(file) });
  const onScreenshotClear = () => bugReportForm.setValue('screenshot', undefined);
  const onDropZoneClick = () => screenshotInput.current?.click();

  const screenshotDropzone = useDropZone<HTMLDivElement>({
    dataTypes: ['image'],
    onDrop: (files) => {
      const file = files?.[0] ?? null;
      if (!file) return;
      onScreenshotDrop(file);
    }
  });

  useEventListener('paste', (event) => {
    const [pastedFile] = event.clipboardData?.files ?? [];
    if (!pastedFile) return;
    bugReportForm.setValue('screenshot', {
      file: pastedFile,
      url: URL.createObjectURL(pastedFile)
    });
  });

  const onSubmit = bugReportForm.handleSubmit(async (values) => {
    bugReportForm.reset(values);
    await bugReport({
      title: values.title,
      description: values.description,
      ...(values.screenshot && { screenshot: values.screenshot.file })
    });
    toast.success('Отчет о баге успешно отправлен');
    params.onOpenChange(false);
  });

  const screenshot = bugReportForm.watch('screenshot')?.url;

  return {
    refs: {
      screenshotInput
    },
    state: { screenshot },
    features: { screenshotDropzone },
    form: bugReportForm,
    functions: { onSubmit, onScreenshotDrop, onScreenshotClear, onDropZoneClick }
  };
};
