import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const SearchParams = z.object({
  search: z.string().describe('Search query'),
  limit: z.string().describe('Limit')
});

export const SearchResponse = z.object({
  count: z.number().describe('Count'),
  limit: z.number().describe('Limit'),
  query: z.string().describe('Query'),
  success: z.boolean().describe('Success'),
  talks: z
    .array(
      z.object({
        company: z.string().describe('Company'),
        createdAt: z.date().describe('Created at'),
        id: z.string().describe('ID'),
        speaker: z.string().describe('Speaker'),
        speakerAvatar: z.string().nullable().describe('Speaker avatar'),
        title: z.string().describe('Title'),
        updatedAt: z.date().describe('Updated at'),
        url: z.string().describe('URL')
      })
    )
    .describe('Talks')
});

const SearchError = z.object({
  error: z.string().describe('Error'),
  success: z.boolean().describe('Success')
});

export type SearchResponse = z.infer<typeof SearchResponse>;
export type SearchParams = z.infer<typeof SearchParams>;
export type SearchError = z.infer<typeof SearchError>;

/**
 * Search for talks
 * @description Searches for talks by title, speaker, company, url, and description
 * @pathParams SearchParams
 * @response 200:SearchResponse
 * @add 500:SearchError
 * @openapi
 */
export const GET = async (
  request: NextRequest
): Promise<NextResponse<SearchError | SearchResponse>> => {
  try {
    const { searchParams } = new URL(request.url);
    const validation = SearchParams.safeParse({
      search: searchParams.get('search'),
      limit: searchParams.get('limit')
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters',
          success: false
        },
        { status: 400 }
      );
    }

    const { search, limit } = validation.data;

    if (!search.trim()) {
      const talks = await prisma.talk.findMany({
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        talks,
        count: talks.length,
        query: search,
        limit: Number(limit)
      });
    }

    const talks = await prisma.talk.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            speaker: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            company: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            url: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: Number(limit)
    });

    return NextResponse.json({
      success: true,
      talks,
      count: talks.length,
      query: search,
      limit: Number(limit)
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
};
