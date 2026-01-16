"use client";

import { useDisclosure } from "@siberiacancode/reactuse";
import { TrashIcon } from "lucide-react";

import type { TalkReview } from "@/app/api/types";

import { useAuth } from "@/app/(contexts)/auth";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

import { ConfirmDeleteModal } from "./components/ConfirmDeleteModal";

export interface ReviewListProps {
  reviews: TalkReview[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  const authContext = useAuth();
  const deleteReviewModal = useDisclosure();

  const user = authContext.user;
  const userReview = reviews.find((review) => review.userId === user?.id);

  return (
    <>
      <div className="flex flex-col gap-4">
        {reviews.map((review) => {
          const isUserReview = user?.id === review.userId;

          return (
            <div key={review.id} className="group relative flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={review.user.photoUrl} />
                  <AvatarFallback>
                    {review.user.username![0].toLowerCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {review.user?.username ?? review.user?.id}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <p className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>

              {isUserReview && (
                <Button
                  className={cn(
                    "absolute top-0 right-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  )}
                  size="icon"
                  variant="ghost"
                  onClick={deleteReviewModal.open}
                >
                  <TrashIcon className="size-3" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {deleteReviewModal.opened && userReview && (
        <ConfirmDeleteModal
          review={userReview}
          onOpenChange={deleteReviewModal.toggle}
        />
      )}
    </>
  );
};
