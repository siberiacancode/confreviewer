import { useOptimistic } from '@siberiacancode/reactuse';

import { likeTalk, wantToWatchTalk } from '../../../(actions)';

export const useTalkCard = () => {
  const [optimisticLike, updateOptimisticLike] = useOptimistic(likeTalk, () => {});
  const [optimisticWantToWatch, updateOptimisticWantToWatch] = useOptimistic(
    wantToWatchTalk,
    () => {}
  );

  const onLike = (like: boolean) => updateOptimisticLike({ like, talkId });
  const onWantToWatch = (wantToWatch: boolean) =>
    updateOptimisticWantToWatch({ wantToWatch, talkId });

  return {
    state: {
      optimisticLike,
      optimisticWantToWatch
    },
    functions: {
      onLike,
      onWantToWatch
    }
  };
};
