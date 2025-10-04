import {
  JUGRU_CONFERENCE_NAME,
  MOSCOWJS_CONFERENCE_NAME,
  ONTEKO_CONFERENCE_NAME
} from '@/app/(constants)';

export const getConferenceType = (url: string) => {
  if (JUGRU_CONFERENCE_NAME.some((domain) => url.includes(domain))) return 'jugru';
  if (ONTEKO_CONFERENCE_NAME.some((domain) => url.includes(domain))) return 'onteko';
  if (MOSCOWJS_CONFERENCE_NAME.some((domain) => url.includes(domain))) return 'moscowjs';

  throw new Error('Unknown conference type');
};
