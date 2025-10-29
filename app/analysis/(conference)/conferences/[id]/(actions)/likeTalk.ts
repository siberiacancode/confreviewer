'use server';

import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const likeTalkParamsSchema = z.object({
  like: z.boolean().default(true),
  talkId: z.string().min(1, 'Talk ID is required')
});

export interface LikeTalkParams {
  like: boolean;
  talkId: string;
}

export interface LikeTalkResult {
  error?: string;
  success: boolean;
}

export const likeTalk = async (params: LikeTalkParams): Promise<LikeTalkResult> => {
  const validation = likeTalkParamsSchema.safeParse(params);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { like, talkId } = validation.data;

  try {
    await prisma.talk.update({
      where: { id: talkId },
      data: { likes: like ? { increment: 1 } : { decrement: 1 } }
    });

    return { success: true };
  } catch (error) {
    console.error('Error liking talk:', error);
    return {
      success: false,
      error: 'Failed to like talk'
    };
  }
};
