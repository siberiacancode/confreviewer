export type ConferenceType = "jugru" | "onteko";
export const JUGRU_CONFERENCE_NAME = ["holyjs.ru", "heisenbug.ru"] as const;
export const ONTEKO_CONFERENCE_NAME = ["frontendconf.ru"] as const;

export const CONFERENCE_NAME = [
  ...JUGRU_CONFERENCE_NAME,
  ...ONTEKO_CONFERENCE_NAME,
] as const;
