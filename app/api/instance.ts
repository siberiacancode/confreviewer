import fetches from '@siberiacancode/fetches';
import process from 'node:process';

export const api = fetches.create({
  baseURL: process.env.API_URL ?? '/api'
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') return config;
  const cookieStore = await import('next/headers').then(({ cookies }) => cookies());

  config.headers!.cookie = cookieStore
    .getAll()
    .map((cookie) => `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}`)
    .join('; ');
  return config;
});

api.interceptors.response.use(undefined, (response) => {
  console.log('response intercepted', response.cause);
  return response;
});
