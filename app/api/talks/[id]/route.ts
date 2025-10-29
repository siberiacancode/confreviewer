import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { talkSchema } from '../../types';

export const talkParamsSchema = z.object({
  id: z.string().describe('Talk ID')
});

export const talkResponseSchema = z.object({
  success: z.boolean().describe('Success'),
  talk: talkSchema
});

export const talkErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type TalkResponse = z.infer<typeof talkResponseSchema>;
export type TalkParams = z.infer<typeof talkParamsSchema>;
export type TalkError = z.infer<typeof talkErrorSchema>;

/**
 * Get talk by ID
 * @description Retrieves a talk by its ID
 * @pathParams TalkParams
 * @response 200:TalkResponse
 * @add 404:TalkError
 * @add 500:TalkError
 * @openapi
 */
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<TalkError | TalkResponse>> => {
  try {
    const { id } = await params;

    const validation = talkParamsSchema.safeParse({ id });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid talk ID',
          success: false
        },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      talk
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
};
