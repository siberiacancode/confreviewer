'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { bugReport } from '@/app/api/actions';

const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;

const bugReportSchema = z
  .object({
    title: z.string().min(1, 'Укажите проблему'),
    description: z.string().min(0),
    screenshot: z.custom<File>().optional()
  })
  .refine((data) => !data.screenshot || data.screenshot.size <= MAX_SCREENSHOT_SIZE, {
    path: ['screenshot'],
    message: 'Скриншот не должен превышать 5 МБ'
  })
  .refine(
    (data) =>
      !data.screenshot || (data.screenshot.type ? data.screenshot.type.startsWith('image/') : true),
    {
      path: ['screenshot'],
      message: 'Поддерживаются только изображения'
    }
  );

export type BugReportFormValues = z.infer<typeof bugReportSchema>;

export const useBugReportModal = () => {
  const bugReportForm = useForm<BugReportFormValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: '',
      description: '',
      screenshot: undefined
    }
  });

  const onSubmit = bugReportForm.handleSubmit((values) => {
    bugReportForm.reset(values);
    bugReport(values);
  });

  return { form: bugReportForm, functions: { onSubmit } };
};
