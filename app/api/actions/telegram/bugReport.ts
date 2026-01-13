'use server';

import process from 'node:process';
import z from 'zod';

import { EXTERNAL_LINKS } from '@/app/(constants)';

const bugReportInputSchema = z.object({
  title: z.string().describe('Title'),
  description: z.string().describe('Description'),
  screenshot: z.instanceof(File).optional().describe('Screenshot')
});

type BugReportInput = z.infer<typeof bugReportInputSchema>;

export const bugReport = async (input: BugReportInput) => {
  const validation = bugReportInputSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }
  console.error(validation.data);
  const { title, description, screenshot } = validation.data;

  const url = `${EXTERNAL_LINKS.TELEGRAM.API_BASE}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;

  const formData = new FormData();
  formData.append('chat_id', '441147044');
  formData.append('caption', `🐛 Bug Report\n\n${title}\n\n${description}\n\n`);
  formData.append('photo', screenshot as Blob, 'image.png');

  await fetch(url, {
    method: 'POST',
    body: formData
  });
};
