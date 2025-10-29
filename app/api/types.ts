import { z } from 'zod';

export const talkSchema = z
  .object({
    company: z.string().describe('Company'),
    createdAt: z.date().describe('Created at'),
    description: z.string().describe('Description'),
    id: z.string().describe('ID'),
    likes: z.number().describe('Likes count'),
    logo: z.string().nullable().describe('Logo'),
    speaker: z.string().describe('Speaker'),
    speakerAvatar: z.string().nullable().describe('Speaker avatar'),
    title: z.string().describe('Title'),
    updatedAt: z.date().describe('Updated at'),
    url: z.string().describe('URL'),
    wantsToWatch: z.number().describe('Wants to watch count')
  })
  .describe('Talk');

export type Talk = z.infer<typeof talkSchema>;
