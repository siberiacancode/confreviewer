import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { authGuard } from '@/lib/guards';
import { prisma } from '@/lib/prisma';

import { REACTION_MAP, talkWithReactionsSchema } from '../types';

export const talksQuerySchema = z.object({
  conferenceId: z.string().optional().describe('Conference ID filter'),
  search: z
    .string()
    .optional()
    .describe('Search term for title, speaker, or description')
    .default(''),
  popular: z.coerce.boolean().optional().describe('Popular filter').default(false),
  demanded: z.coerce.boolean().optional().describe('Demanded filter').default(false),
  sort: z.enum(['asc', 'desc']).optional().describe('Sort order').default('asc'),
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe('Number of talks to return (1-100)')
    .default(20),
  offset: z.coerce.number().min(0).optional().describe('Number of talks to skip').default(0)
});

export const talksResponseSchema = z.object({
  success: z.boolean().describe('Success'),
  talks: z.array(talkWithReactionsSchema),
  total: z.number().describe('Total number of talks'),
  limit: z.number().describe('Limit applied'),
  offset: z.number().describe('Offset applied')
});

export const talksErrorSchema = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type TalksQuery = z.infer<typeof talksQuerySchema>;
export type TalksResponse = z.infer<typeof talksResponseSchema>;
export type TalksError = z.infer<typeof talksErrorSchema>;

/**
 * Get talks with query parameters
 * @description Retrieves talks with optional filtering, searching, and sorting
 * @queryParams TalksQuery
 * @response 200:TalksResponse
 * @add 400:TalksError
 * @add 500:TalksError
 * @openapi
 */
export const GET = async (
  request: NextRequest
): Promise<NextResponse<TalksError | TalksResponse>> => {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = talksQuerySchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          success: false
        },
        { status: 400 }
      );
    }

    const { conferenceId, search, limit, offset } = validation.data;

    const where = {} as any;

    if (conferenceId) {
      where.conferenceId = conferenceId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        {
          speakers: {
            some: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } }
              ]
            }
          }
        }
      ];
    }

    const total = await prisma.talk.count({ where });

    const talks = await prisma.talk.findMany({
      where,
      take: limit,
      skip: offset,
      include: { speakers: true }
    });

    const talksWithReactions = await Promise.all(
      talks.map(async (talk) => {
        const reactions = await prisma.talkReaction.groupBy({
          by: ['type'],
          where: { talkId: talk.id },
          _count: true
        });

        const likesCount = reactions.find((reaction) => reaction.type === 'likes')?._count ?? 0;
        const wantsToWatchCount =
          reactions.find((reaction) => reaction.type === 'wantsToWatch')?._count ?? 0;
        const recommendsCount =
          reactions.find((reaction) => reaction.type === 'recommends')?._count ?? 0;
        return {
          ...talk,
          likes: likesCount,
          wantsToWatch: wantsToWatchCount,
          recommends: recommendsCount,
          liked: false,
          wantedToWatch: false,
          recommended: false
        };
      })
    );

    const auth = await authGuard();
    if (auth) {
      for (const talk of talksWithReactions) {
        const talkReactions = await prisma.talkReaction.findMany({
          where: { talkId: talk.id, userId: auth.user.id }
        });

        for (const reaction of talkReactions) {
          talk[REACTION_MAP[reaction.type]] = true;
        }
      }
    }

    return NextResponse.json({
      success: true,
      talks: talksWithReactions,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
};
