import fetches from '@siberiacancode/fetches';
import process from 'node:process';

export const api = fetches.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'
});
