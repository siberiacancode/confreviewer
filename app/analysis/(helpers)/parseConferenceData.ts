import type { ConferenceType } from "@/app/(constants)";

import { parseJugru } from "./parsers/jugru";

const PARSERS = {
  jugru: parseJugru,
  onteko: parseJugru,
} satisfies Record<ConferenceType, typeof parseJugru>;

export const parseConferenceData = async (
  type: ConferenceType,
  html: string
): Promise<any> => PARSERS[type](html);
