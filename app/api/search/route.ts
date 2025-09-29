import type { NextRequest} from 'next/server';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export interface SearchTalk {
  company: string;
  createdAt: Date;
  id: string;
  speaker: string;
  speakerAvatar: string | null;
  title: string;
  updatedAt: Date;
  url: string;
}

export interface SearchResponse {
  count: number;
  isRecent: boolean;
  limit: number;
  query: string;
  success: boolean;
  talks: SearchTalk[];
}

const searchSchema = z.object({
  search: z.string().optional().default(''),
  limit: z
    .string()
    .transform((val) => {
      const num = Number.parseInt(val, 10);
      return isNaN(num) ? 10 : Math.min(Math.max(num, 1), 50); // min 1, max 50, default 10
    })
    .default(10)
});

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const validation = searchSchema.safeParse({
      search: searchParams.get('search'),
      limit: searchParams.get('limit')
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters'
        },
        { status: 400 }
      );
    }

    const { search, limit } = validation.data;

    if (!search.trim()) {
      const talks = await prisma.talk.findMany({
        take: limit,
        orderBy: { updatedAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        talks,
        count: talks.length,
        query: search,
        limit
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
      take: limit
    });

    return NextResponse.json({
      success: true,
      talks,
      count: talks.length,
      query: search,
      limit
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
