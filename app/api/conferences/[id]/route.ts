import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { conferenceSchema } from '../../types';

export const conferenceParamsSchema = z.object({
  id: z.string().describe('Conference ID')
});

export const conferenceResponseSchema = z.object({
  success: z.boolean().describe('Success'),
  conference: conferenceSchema
});

export const conferenceErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type ConferenceResponse = z.infer<typeof conferenceResponseSchema>;
export type ConferenceParams = z.infer<typeof conferenceParamsSchema>;
export type ConferenceError = z.infer<typeof conferenceErrorSchema>;

/**
 * Get conference by ID
 * @description Retrieves a conference by its ID
 * @pathParams ConferenceParams
 * @response 200:ConferenceResponse
 * @add 404:ConferenceError
 * @add 500:ConferenceError
 * @openapi
 */
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ConferenceError | ConferenceResponse>> => {
  try {
    const { id } = await params;

    const validation = conferenceParamsSchema.safeParse({ id });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid conference ID',
          success: false
        },
        { status: 400 }
      );
    }

    const conference = await prisma.conference.findUnique({
      where: { id }
    });

    if (!conference) {
      return NextResponse.json(
        {
          error: 'Conference not found',
          success: false
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      conference
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
};
