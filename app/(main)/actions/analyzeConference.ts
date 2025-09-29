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

  const existingTalk = await prisma.talk.findUnique({
    where: {
      title_speaker: {
        title: result.title,
        speaker: result.speaker
      }
    }
  });

  if (existingTalk) redirect(`/analysis/${existingTalk.id}`);

  const newTalk = await prisma.talk.create({
    data: {
      title: result.title,
      speaker: result.speaker,
      speakerAvatar: result.speakerAvatar,
      company: result.company,
      description: result.description,
      logo: result.logo,
      url
    }
  });

  redirect(`/analysis/${newTalk.id}`);
};
