'use server';

import { z } from 'zod';

import type { Talk } from '@/app/api/types';

import { talkSchema } from '@/app/api/types';
import { authGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

const actionTalkParamsSchema = z.object({
  value: z.boolean().default(true),
  talkId: z.string().min(1, 'Talk ID is required'),
  type: z.enum(['likes', 'wantsToWatch']).default('likes')
});

const actionTalkResponseSchema = z.object({
  success: z.boolean().describe('Success'),
  talk: talkSchema.describe('Talk')
});

const actionTalkErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type ActionTalkResponse = z.infer<typeof actionTalkResponseSchema>;
export type ActionTalkError = z.infer<typeof actionTalkErrorSchema>;

export interface ActionTalkParams {
  talkId: string;
  type: 'likes' | 'wantsToWatch';
  value: boolean;
}

export interface ActionTalkResult {
  success: boolean;
  talk: Talk;
}

export const actionTalk = async (
  params: ActionTalkParams
): Promise<ActionTalkError | ActionTalkResponse> => {
  const validation = actionTalkParamsSchema.safeParse(params);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }
  console.log('validation', validation);

  const { value, talkId, type } = validation.data;

  try {
    const authUser = await authGuard();

    if (!authUser) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const updatedTalk = await prisma.$transaction(async (transaction) => {
      const talk = await transaction.talk.findUnique({
        where: { id: talkId },
        include: { speakers: true }
      });
      if (!talk) throw new Error('Talk not found');

      const talkReaction = await transaction.talkReaction.findUnique({
        where: { talkId_userId_type: { talkId, userId: user.id, type } }
      });

      if (value && !talkReaction) {
        await transaction.talkReaction.create({
          data: { talkId, userId: user.id, type }
        });
      }

      if (!value && talkReaction) {
        await transaction.talkReaction.delete({
          where: { talkId_userId_type: { talkId, userId: user.id, type } }
        });
      }

      return talk;
    });

    return { success: true, talk: updatedTalk };
  } catch (error) {
    console.error('Error performing action on talk:', error);
    return {
      success: false,
      error: 'Failed to perform talk action'
    };
  }
};
