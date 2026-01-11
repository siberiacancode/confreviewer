'use server';

import { z } from 'zod';

import { authGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

const actionReviewParamsSchema = z.object({
  talkId: z.string().min(1, 'Talk ID is required'),
  comment: z.string().min(1, 'Comment is required')
});

const actionReviewResponseSchema = z.object({
  success: z.boolean().describe('Success')
});

const actionReviewErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type ActionReviewResponse = z.infer<typeof actionReviewResponseSchema>;
export type ActionReviewError = z.infer<typeof actionReviewErrorSchema>;

export interface ActionReviewParams {
  comment: string;
  talkId: string;
}

export const actionReview = async (
  params: ActionReviewParams
): Promise<ActionReviewError | ActionReviewResponse> => {
  const validation = actionReviewParamsSchema.safeParse(params);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { talkId, comment } = validation.data;

  try {
    const auth = await authGuard();

    if (!auth || !auth.metadata.isReviewer) {
      return { success: false, error: 'Unauthorized - Only reviewers can create reviews' };
    }

    const talk = await prisma.talk.findUnique({
      where: { id: talkId }
    });

    if (!talk) {
      return { success: false, error: 'Talk not found' };
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await prisma.talkReview.upsert({
      where: {
        talkId_userId: {
          talkId,
          userId: auth.user.id
        }
      },
      create: {
        talkId,
        userId: auth.user.id,
        comment: comment.trim()
      },
      update: {
        comment: comment.trim(),
        updatedAt: new Date()
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving review:', error);
    return {
      success: false,
      error: 'Failed to save review'
    };
  }
};
