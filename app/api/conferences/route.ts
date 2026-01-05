import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { conferenceSchema } from '../types';

export const conferencesResponseSchema = z.object({
  success: z.boolean().describe('Success'),
  conferences: z.array(conferenceSchema)
});

export const conferencesErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type ConferencesResponse = z.infer<typeof conferencesResponseSchema>;
export type ConferencesError = z.infer<typeof conferencesErrorSchema>;

/**
 * Get all conferences
 * @description Retrieves all conferences
 * @response 200:ConferencesResponse
 * @add 500:ConferencesError
 * @openapi
 */
export const GET = async (
  _request: NextRequest
): Promise<NextResponse<ConferencesError | ConferencesResponse>> => {
  try {
    const conferences = await prisma.conference.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      conferences
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
};
