"use client";

import { useCopy } from "@siberiacancode/reactuse";
import {
  CheckIcon,
  EyeIcon,
  ForwardIcon,
  HeartIcon,
  StarIcon,
} from "lucide-react";
// import dynamic from 'next/dynamic';

import { useAuth } from "@/app/(contexts)/auth";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

import { useReview } from "../../(contexts)/review";
import { useTalk } from "../../(contexts)/talk";

// const Badge = dynamic(() => import('@/components/ui/badge').then((mod) => mod.Badge), {
//   loading: () => <Skeleton className='h-6.5 w-14 rounded-full' />,
//   ssr: false
// });

export const ActionPanel = () => {
  const talkContext = useTalk();
  const authContext = useAuth();
  const reviewContext = useReview();

  const talk = talkContext.talk!;

  const { copied, copy } = useCopy();

  const isLiked = talk.liked;
  const isWantsToWatch = talk.wantedToWatch;
  const isRecommended = talk.recommended;

  const isReviewer = authContext.metadata.isReviewer;
  const userHasReview = reviewContext.reviews.some(
    (review) => review.userId === authContext.user?.id
  );

  const onCopyClick = () => copy(window.location.href);

  const onLike = authContext.authCallback(() => {
    talkContext.actionTalk("likes", !isLiked);
  });

  const onWantToWatch = authContext.authCallback(() => {
    talkContext.actionTalk("wantsToWatch", !isWantsToWatch);
  });

  const onRecommend = authContext.authCallback(() => {
    talkContext.actionTalk("recommends", !isRecommended);
  });

  return (
    <div className="flex items-center gap-2">
      {isReviewer && userHasReview && (
        <Badge
          className={cn(
            isRecommended &&
              "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
            "h-6.5 cursor-pointer px-3 py-1 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-400"
          )}
          variant="outline"
          onClick={onRecommend}
        >
          <StarIcon className="size-4!" />
        </Badge>
      )}

      <Badge
        className={cn(
          isLiked &&
            "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
          "h-6.5 cursor-pointer px-3 py-1 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400"
        )}
        variant="outline"
        onClick={onLike}
      >
        <HeartIcon className="size-4!" />

        {!!talk.likes && <span className="text-medium">{talk.likes}</span>}
      </Badge>

      <Badge
        className={cn(
          isWantsToWatch &&
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          "h-6.5 cursor-pointer px-3 py-1 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
        )}
        variant="outline"
        onClick={onWantToWatch}
      >
        <EyeIcon className="size-4!" />
        {!!talk.wantsToWatch && (
          <span className="text-medium">{talk.wantsToWatch}</span>
        )}
      </Badge>

      <Badge
        className={cn(
          "h-6.5 cursor-pointer px-3 py-1 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700/30 dark:hover:text-gray-300",
          copied &&
            "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        )}
        variant="outline"
        onClick={onCopyClick}
      >
        {copied && <CheckIcon className="size-4!" />}
        {!copied && <ForwardIcon className="size-4!" />}
      </Badge>
    </div>
  );
};
