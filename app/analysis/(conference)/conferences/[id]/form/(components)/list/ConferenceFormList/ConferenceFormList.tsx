import * as AccordionPrimitive from '@radix-ui/react-accordion';

import type { TalkWithReactions } from '@/app/api/types';

import { ConferenceFormTalkItem } from '../ConferenceFormTalkItem/ConferenceFormTalkItem';

interface ConferenceFormListProps {
  talks: TalkWithReactions[];
}

export const ConferenceFormList = ({ talks }: ConferenceFormListProps) => (
  <AccordionPrimitive.Accordion className='flex flex-col gap-6' type='single' collapsible>
    {talks.map((talk) => (
      <ConferenceFormTalkItem key={talk.id} talk={talk} />
    ))}
  </AccordionPrimitive.Accordion>
);
