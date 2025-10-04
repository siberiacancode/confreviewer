import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const TalkParams = z.object({
  id: z.string().describe('Talk ID')
});

export const TalkResponse = z.object({
  success: z.boolean().describe('Success'),
  talk: z
    .object({
      company: z.string().describe('Company'),
      createdAt: z.date().describe('Created at'),
      description: z.string().describe('Description'),
      id: z.string().describe('ID'),
      logo: z.string().nullable().describe('Logo'),
      speaker: z.string().describe('Speaker'),
      speakerAvatar: z.string().nullable().describe('Speaker avatar'),
      title: z.string().describe('Title'),
      updatedAt: z.date().describe('Updated at'),
      url: z.string().describe('URL')
    })
    .describe('Talk')
});

const TalkError = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type TalkResponse = z.infer<typeof TalkResponse>;
export type TalkParams = z.infer<typeof TalkParams>;
export type TalkError = z.infer<typeof TalkError>;

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

    const validation = TalkParams.safeParse({ id });

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
