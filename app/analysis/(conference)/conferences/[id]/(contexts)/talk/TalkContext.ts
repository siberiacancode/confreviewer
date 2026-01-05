import { createContext } from 'react';

import type { TalkWithReactions } from '@/app/api/types';

export type TalkActionType = 'likes' | 'wantsToWatch';

export interface TalkContextValue {
  talk: TalkWithReactions;
  actionTalk: (type: TalkActionType, value: boolean) => Promise<void>;
}

export const TalkContext = createContext<TalkContextValue>({
  talk: {} as TalkWithReactions,
  actionTalk: async () => {}
});
