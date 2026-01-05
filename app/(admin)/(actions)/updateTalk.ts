'use server';

import { z } from 'zod';

import { adminGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

const updateTalkSchema = z.object({
  id: z.string().min(1, 'ID обязателен'),
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  speakers: z
    .array(
      z.object({
        name: z.string().min(1, 'Имя обязательно'),
        company: z.string().min(1, 'Компания обязательна'),
        avatar: z.string().nullable().optional().describe('Аватар')
      })
    )
    .describe('Спикеры')
});

export type UpdateTalkInput = z.infer<typeof updateTalkSchema>;

export const updateTalk = async (input: UpdateTalkInput) => {
  const admin = await adminGuard();

  if (!admin) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = updateTalkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  const { id, title, description, speakers } = parsed.data;

  try {
    const updated = await prisma.$transaction(async (transaction) => {
      await transaction.talk.update({
        where: { id },
        data: {
          title,
          description
        }
      });

      await transaction.talkSpeaker.deleteMany({ where: { talkId: id } });
      await transaction.talkSpeaker.createMany({
        data: speakers.map((speaker) => ({
          talkId: id,
          name: speaker.name,
          company: speaker.company,
          avatar: speaker.avatar ?? null
        }))
      });

      const withSpeakers = await transaction.talk.findUnique({
        where: { id },
        include: { speakers: true }
      });

      return withSpeakers;
    });

    return { success: true, talk: updated };
  } catch (error) {
    console.error('Failed to update talk', error);
    return { success: false, error: 'Internal server error' };
  }
};
