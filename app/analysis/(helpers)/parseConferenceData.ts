import type { ConferenceType } from '@/app/(constants)';

import { parseJugru, parseMoscowjs, parseOntiko } from './parsers';

const PARSERS = {
  jugru: parseJugru,
  onteko: parseOntiko,
  moscowjs: parseMoscowjs
} satisfies Record<ConferenceType, typeof parseJugru | typeof parseMoscowjs | typeof parseOntiko>;

export const parseConferenceData = async (
  type: ConferenceType,
  html: string,
  url: string
): Promise<any> => PARSERS[type](url, html);
