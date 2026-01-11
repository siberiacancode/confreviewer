import { z } from 'zod';

export const REACTION_MAP = {
  likes: 'liked',
  wantsToWatch: 'wantedToWatch',
  recommends: 'recommended'
} as const;

export const talkSpeakerSchema = z
  .object({
    id: z.string().describe('ID'),
    name: z.string().describe('Name'),
    company: z.string().describe('Company'),
    avatar: z.string().nullable().optional().describe('Avatar')
  })
  .describe('TalkSpeaker');

export const userSchema = z
  .object({
    id: z.number().describe('ID'),
    username: z.string().optional().describe('Username'),
    firstName: z.string().optional().describe('First name'),
    lastName: z.string().optional().describe('Last name'),
    photoUrl: z.string().optional().describe('Photo URL'),
    createdAt: z.number().describe('Created at')
  })
  .describe('User');

export const talkSchema = z
  .object({
    id: z.string().describe('ID'),
    title: z.string().describe('Title'),
    description: z.string().describe('Description'),
    logo: z.string().nullable().describe('Logo'),
    url: z.string().describe('URL'),
    createdAt: z.date().describe('Created at'),
    updatedAt: z.date().describe('Updated at'),
    conferenceId: z.string().describe('Conference ID'),
    speakers: z.array(talkSpeakerSchema).describe('Speakers')
  })
  .describe('Talk');

export const talkReviewSchema = z
  .object({
    id: z.string().describe('ID'),
    talkId: z.string().describe('Talk ID'),
    userId: z.number().describe('User ID'),
    comment: z.string().describe('Comment'),
    createdAt: z.date().describe('Created at'),
    updatedAt: z.date().describe('Updated at'),
    user: userSchema.describe('User'),
    recommended: z.boolean().describe('Is recommended')
  })
  .describe('TalkReview');

export const talkWithReactionsSchema = talkSchema.extend({
  likes: z.number().describe('Likes count'),
  wantsToWatch: z.number().describe('Wants to watch count'),
  recommends: z.number().describe('Recommended count'),
  liked: z.boolean().describe('Liked'),
  wantedToWatch: z.boolean().describe('Wanted to watch'),
  recommended: z.boolean().describe('Recommended')
});

export const talkReactionSchema = z
  .object({
    talkId: z.string().describe('Talk ID'),
    userId: z.number().describe('User ID'),
    type: z.enum(['likes', 'wantsToWatch', 'recommends']).describe('Type'),
    createdAt: z.date().describe('Created at')
  })
  .describe('TalkReaction');

export const conferenceSchema = z
  .object({
    id: z.string().describe('ID'),
    name: z.string().describe('Name'),
    description: z.string().describe('Description'),
    logo: z.string().nullable().describe('Logo'),
    url: z.string().describe('URL'),
    createdAt: z.date().describe('Created at'),
    updatedAt: z.date().describe('Updated at')
  })
  .describe('Conference');

export type User = z.infer<typeof userSchema>;
export type Talk = z.infer<typeof talkSchema>;
export type TalkWithReactions = z.infer<typeof talkWithReactionsSchema>;
export type Conference = z.infer<typeof conferenceSchema>;
export type TalkSpeaker = z.infer<typeof talkSpeakerSchema>;
export type TalkReview = z.infer<typeof talkReviewSchema>;
