import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import process from 'node:process';
import { z } from 'zod';

import { authGuard } from '@/lib/guards';

import { userSchema } from '../types';

export const userResponseSchema = z.object({
  success: z.boolean().describe('Success'),
  user: userSchema.optional().describe('User'),
  metadata: z
    .object({
      isAdmin: z.boolean().describe('Is admin'),
      isReviewer: z.boolean().describe('Is reviewer')
    })
    .describe('User metadata')
});

export const userErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserError = z.infer<typeof userErrorSchema>;

/**
 * Get current user
 * @description Retrieves current user with metadata and reviews
 * @response 200:UserResponse
 * @add 500:UserError
 * @openapi
 */
export const GET = async (
  _request: NextRequest
): Promise<NextResponse<UserError | UserResponse>> => {
  try {
    const authUser = await authGuard();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      ...authUser
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
};
