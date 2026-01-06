'use server';

import { cookies } from 'next/headers';
import process from 'node:process';
import z from 'zod';

import { AUTH_COOKIE_EXPIRES, COOKIES } from '@/app/(constants)';
import { prisma } from '@/lib/prisma';
import { encryptPayload } from '@/lib/secure';

const loginInputSchema = z.object({
  user: z.object({
    id: z.number().describe('ID'),
    username: z.string().optional().describe('Username'),
    firstName: z.string().optional().describe('First name'),
    lastName: z.string().optional().describe('Last name'),
    photoUrl: z.string().optional().describe('Photo URL'),
    createdAt: z.number().describe('Created at')
  })
});

type LoginInput = z.infer<typeof loginInputSchema>;

export const login = async (input: LoginInput) => {
  const validation = loginInputSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { user } = validation.data;

  await prisma.user.upsert({
    where: { id: user.id },
    update: user,
    create: user
  });

  const cookieStore = await cookies();
  const encrypted = encryptPayload(user);

  cookieStore.set(COOKIES.AUTH, encrypted, {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(user.createdAt + AUTH_COOKIE_EXPIRES)
  });
};
