'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const talkIdSchema = z.object({
  talkId: z.string().min(1, 'Talk ID is required')
});

export interface WantToWatchTalkResult {
  error?: string;
  success: boolean;
  likes?: number;
  wantsToWatch?: number;
}

export const wantToWatchTalk = async (
  state: WantToWatchTalkResult,
  formData: FormData
): Promise<WantToWatchTalkResult> => {
  const talkId = formData.get('talkId') as string;
  const validation = talkIdSchema.safeParse({ talkId });

  if (!validation.success) {
    return { ...state, success: false, error: validation.error.message };
  }

  try {
    const updatedTalk = await prisma.talk.update({
      where: { id: talkId },
      data: {
        wantsToWatch: {
          increment: 1
        }
      },
      select: {
        likes: true,
        wantsToWatch: true
      }
    });

    revalidatePath('/analysis/conferences');
    revalidatePath(`/analysis/conferences/${talkId}`);

    return {
      ...state,
      success: true,
      likes: updatedTalk.likes,
      wantsToWatch: updatedTalk.wantsToWatch
    };
  } catch (error) {
    console.error('Error adding want to watch:', error);
    return {
      ...state,
      success: false,
      error: 'Failed to add want to watch'
    };
  }
};
