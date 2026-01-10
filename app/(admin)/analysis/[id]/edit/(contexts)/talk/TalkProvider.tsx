'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { startTransition, useMemo, useOptimistic } from 'react';

import type { TalkWithReactions } from '@/app/api/types';

import { actionTalk } from '@/app/analysis/(actions)';
import { REACTION_MAP } from '@/app/api/types';

import type { TalkActionType } from './TalkContext';

import { TalkContext } from './TalkContext';

interface TalkProviderProps {
  children: ReactNode;
  initialTalk: TalkWithReactions;
}

export const TalkProvider = ({ children, initialTalk }: TalkProviderProps) => {
  const router = useRouter();

  const [optimisticTalk, optimisticTalkUpdate] = useOptimistic(
    initialTalk,
    (talk, action: { type: TalkActionType; value: boolean }) => ({
      ...talk,
      [action.type]: talk[action.type] + (action.value ? 1 : -1),
      [REACTION_MAP[action.type]]: action.value
    })
  );

  const actionTalkOptimistic = async (type: TalkActionType, value: boolean) => {
    const action = { type, talkId: optimisticTalk.id, value };
    startTransition(async () => {
      optimisticTalkUpdate(action);
      await actionTalk(action);
      router.refresh();
    });
  };

  const value = useMemo(
    () => ({
      talk: optimisticTalk,
      actionTalk: actionTalkOptimistic
    }),
    [optimisticTalk, actionTalkOptimistic]
  );

  return <TalkContext value={value}>{children}</TalkContext>;
};
