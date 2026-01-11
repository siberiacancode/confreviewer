'use server';

import { z } from 'zod';

import { authGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

const speakerInputSchema = z.object({
  name: z.string().min(1, 'Укажите имя спикера'),
  company: z.string().min(1, 'Укажите компанию'),
  avatar: z.string().trim().nullable().optional()
});

const talkInputSchema = z.object({
  title: z.string().min(1, 'Укажите название доклада'),
  description: z.string().min(1, 'Добавьте описание'),
  logo: z.string().trim().nullable().optional(),
  url: z.url('Укажите корректный URL доклада'),
  speakers: z.array(speakerInputSchema).min(1, 'Нужен хотя бы один спикер')
});

const conferenceInputSchema = z.object({
  id: z.string().trim().min(1, 'ID конференции обязателен'),
  name: z.string().min(1, 'Название конференции обязательно'),
  description: z.string().min(1, 'Описание конференции обязательно'),
  logo: z.string().trim().nullable().optional(),
  url: z.url('Укажите корректный URL конференции')
});

const insertConferenceInputSchema = z.object({
  conference: conferenceInputSchema,
  talks: z.array(talkInputSchema).min(1, 'Добавьте хотя бы один доклад')
});

type InsertConferenceInput = z.infer<typeof insertConferenceInputSchema>;

export const insertConference = async (input: InsertConferenceInput) => {
  const auth = await authGuard();

  if (!auth || !auth.metadata.isAdmin) throw new Error('Unauthorized');

  const validation = insertConferenceInputSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { conference, talks } = validation.data;

  const existingConference = await prisma.conference.findUnique({
    where: { id: conference.id }
  });

  if (existingConference) return { success: false, error: 'Conference already exists' };

  await prisma.$transaction(async (transaction) => {
    await transaction.conference.create({
      data: {
        id: conference.id,
        name: conference.name,
        description: conference.description,
        logo: conference.logo,
        url: conference.url
      }
    });

    for (const talk of talks) {
      await transaction.talk.create({
        data: {
          title: talk.title,
          description: talk.description,
          logo: talk.logo ?? conference.logo ?? null,
          url: talk.url,
          conferenceId: conference.id,
          speakers: {
            create: talk.speakers.map((speaker) => ({
              name: speaker.name,
              company: speaker.company,
              avatar: speaker.avatar ?? null
            }))
          }
        }
      });
    }
  });

  return {
    success: true,
    conferenceId: conference.id,
    createdTalks: talks.length
  };
};
