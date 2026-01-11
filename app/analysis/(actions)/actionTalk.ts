'use server';

import { z } from 'zod';

import type { Talk } from '@/app/api/types';

import { talkSchema } from '@/app/api/types';
import { authGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

const actionTalkParamsSchema = z.object({
  value: z.boolean().default(true),
  talkId: z.string().min(1, 'Talk ID is required'),
  type: z.enum(['likes', 'wantsToWatch', 'recommends']).default('likes')
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
  type: 'likes' | 'recommends' | 'wantsToWatch';
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

  const { value, talkId, type } = validation.data;

  try {
    const auth = await authGuard();

    if (!auth || !auth.metadata.isReviewer) {
      return { success: false, error: 'Unauthorized' };
    }

    if (type === 'recommends') {
      const review = await prisma.talkReview.findUnique({
        where: {
          talkId_userId: {
            talkId,
            userId: auth.user.id
          }
        }
      });

      if (!review) {
        return {
          success: false,
          error: 'You can only recommend a talk after leaving a comment'
        };
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id }
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
