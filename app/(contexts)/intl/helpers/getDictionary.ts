import 'server-only';

import type ruMessage from '@/public/locales/ru.json';

type Message = typeof ruMessage;

const dictionaries = {
  ru: () => import('@/public/locales/ru.json').then((module) => module.default)
} as unknown as Record<string, () => Promise<Message>>;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
