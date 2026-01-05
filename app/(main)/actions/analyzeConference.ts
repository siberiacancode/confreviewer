'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { CONFERENCE_NAME } from '@/app/(constants)';
import { getConferenceType, parseConferenceData } from '@/app/analysis/(helpers)';
import { prisma } from '@/lib/prisma';

const conferenceUrlSchema = z.object({
  url: z
    .url('Enter a valid url')
    .refine(
      (url) => CONFERENCE_NAME.some((domain) => url.includes(domain)),
      'Url should be a valid conference url'
    )
});

export interface AnalyzeConferenceResult {
  error?: string;
  success: boolean;
}

export const analyzeConference = async (
  state: AnalyzeConferenceResult,
  formData: FormData
): Promise<AnalyzeConferenceResult> => {
  const url = formData.get('url') as string;
  const validation = conferenceUrlSchema.safeParse({ url });

  if (!validation.success) {
    return { ...state, success: false, error: validation.error.message };
  }

  const conferenceData = await fetch(url);
  const conferenceType = getConferenceType(url);
  const result = await parseConferenceData(conferenceType, await conferenceData.text(), url);

  const existingConference = await prisma.conference.findUnique({
    where: {
      id: result.conference.id
    }
  });

  if (!existingConference) {
    await prisma.conference.create({
      data: {
        id: result.conference.id,
        name: result.conference.name,
        description: result.conference.description,
        logo: result.conference.logo,
        url
      }
    });
  }

  const existingTalk = await prisma.talk.findUnique({
    where: {
      title_conferenceId: {
        title: result.talk.title,
        conferenceId: result.conference.id
      }
    }
  });

  if (existingTalk) redirect(`/analysis/${existingTalk.id}`);

  const newTalk = await prisma.talk.create({
    data: {
      title: result.talk.title,
      speakers: {
        create: result.speakers
      },
      description: result.talk.description,
      logo: result.conference.logo,
      url,
      conferenceId: result.conference.id
    }
  });

  redirect(`/analysis/${newTalk.id}`);
};
