import type { ConferenceType } from "@/app/(constants)";

import { parseJugru, parseOntiko } from "./parsers";

const PARSERS = {
  jugru: parseJugru,
  onteko: parseOntiko,
} satisfies Record<ConferenceType, typeof parseJugru | typeof parseOntiko>;

export const parseConferenceData = async (
  type: ConferenceType,
  html: string,
  url: string
): Promise<any> => PARSERS[type](url, html);
