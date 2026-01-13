import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { talkReviewSchema } from '@/app/api/types';
import { authGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

export const reviewsParamsSchema = z.object({
  id: z.string().describe('Talk ID')
});

export const reviewsResponseSchema = z.object({
  success: z.boolean().describe('Success'),
  reviews: z.array(talkReviewSchema)
});

export const reviewsErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;
export type ReviewsError = z.infer<typeof reviewsErrorSchema>;

/**
 * Get reviews for a talk
 * @description Retrieves all reviews for a talk
 * @pathParams ReviewsParams
 * @response 200:ReviewsResponse
 * @add 400:ReviewsError
 * @add 404:ReviewsError
 * @add 500:ReviewsError
 * @openapi
 */
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ReviewsError | ReviewsResponse>> => {
  try {
    const { id } = await params;

    const validation = reviewsParamsSchema.safeParse({ id });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid talk ID',
          success: false
        },
        { status: 400 }
      );
    }

    const auth = await authGuard();

    if (!auth || !auth.metadata.isReviewer) {
      return NextResponse.json({ error: 'Unauthorized', success: false });
    }

    const talk = await prisma.talk.findUnique({
      where: { id }
    });

    if (!talk) {
      return NextResponse.json(
        {
          error: 'Talk not found',
          success: false
        },
        { status: 404 }
      );
    }

    const reviews = await prisma.talkReview.findMany({
      where: { talkId: id },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    const recommendedReactions = await prisma.talkReaction.findMany({
      where: {
        talkId: id,
        type: 'recommends'
      },
      select: {
        userId: true
      }
    });

    const recommendedUserIds = new Set(recommendedReactions.map((reaction) => reaction.userId));

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review) => ({
        id: review.id,
        talkId: review.talkId,
        userId: review.userId,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        user: {
          id: review.user.id,
          username: review.user.username ?? undefined,
          firstName: review.user.firstName ?? undefined,
          lastName: review.user.lastName ?? undefined,
          photoUrl: review.user.photoUrl ?? undefined,
          createdAt: review.user.createdAt
        },
        recommended: recommendedUserIds.has(review.userId)
      }))
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
};
