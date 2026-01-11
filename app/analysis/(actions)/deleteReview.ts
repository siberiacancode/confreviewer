'use server';

import { z } from 'zod';

import { authGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

const DeleteReviewParamsSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required')
});

const deleteReviewResponseSchema = z.object({
  success: z.boolean().describe('Success')
});

const deleteReviewErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type DeleteReviewResponse = z.infer<typeof deleteReviewResponseSchema>;
export type DeleteReviewError = z.infer<typeof deleteReviewErrorSchema>;

export interface DeleteReviewParams {
  reviewId: string;
}

export const deleteReview = async (
  params: DeleteReviewParams
): Promise<DeleteReviewError | DeleteReviewResponse> => {
  const validation = DeleteReviewParamsSchema.safeParse(params);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { reviewId } = validation.data;

  try {
    const auth = await authGuard();

    if (!auth || !auth.metadata.isReviewer) {
      return { success: false, error: 'Unauthorized - Only reviewers can delete reviews' };
    }

    const review = await prisma.talkReview.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    if (review.userId !== auth.user.id) {
      return { success: false, error: 'Unauthorized - You can only delete your own reviews' };
    }

    await prisma.talkReview.delete({
      where: { id: reviewId }
    });

    await prisma.talkReaction.delete({
      where: {
        talkId_userId_type: { talkId: review.talkId, userId: auth.user.id, type: 'recommends' }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return {
      success: false,
      error: 'Failed to delete review'
    };
  }
};
