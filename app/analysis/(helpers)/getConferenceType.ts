import {
  JUGRU_CONFERENCE_NAME,
  ONTEKO_CONFERENCE_NAME,
} from "@/app/(constants)";

export const getConferenceType = (url: string) => {
  console.log("@", url);
  if (JUGRU_CONFERENCE_NAME.some((domain) => url.includes(domain)))
    return "jugru";
  if (ONTEKO_CONFERENCE_NAME.some((domain) => url.includes(domain)))
    return "onteko";

  throw new Error("Unknown conference type");
};
