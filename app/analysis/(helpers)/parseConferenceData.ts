import type { ConferenceType } from "@/app/(constants)";
import { parseJugru } from "./parsers/jugru";

export interface TalkData {
  title: string;
  speaker: string;
  speakerAvatar?: string;
  company?: string;
  description: string;
  time?: string;
  venue?: string;
  tags?: string[];
  logo?: string;
}

const PARSERS = {
  jugru: parseJugru,
  onteko: parseJugru,
} satisfies Record<ConferenceType, typeof parseJugru>;

export const parseConferenceData = async (
  type: ConferenceType,
  html: string
): Promise<TalkData> => PARSERS[type](html);
