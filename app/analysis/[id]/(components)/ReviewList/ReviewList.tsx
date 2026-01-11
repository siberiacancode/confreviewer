'use client';

import { useDisclosure } from '@siberiacancode/reactuse';
import { TrashIcon } from 'lucide-react';

import type { TalkReview } from '@/app/api/types';

import { useAuth } from '@/app/(contexts)/auth';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';

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
      <div className='flex flex-col gap-4'>
        {reviews.map((review) => {
          const isUserReview = user?.id === review.userId;

          return (
            <div key={review.id} className='group relative flex gap-3'>
              <div className='relative flex size-8 items-center justify-center'>
                <div className='flex size-8 items-center justify-center'>
                  <Avatar className='size-8'>
                    <AvatarImage src={review.user.photoUrl} />
                    <AvatarFallback>{review.user.username![0].toLowerCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{review.user?.username ?? review.user?.id}</span>
                </div>
                <p className='text-muted-foreground text-sm whitespace-pre-wrap'>
                  {review.comment}
                </p>
              </div>
              {isUserReview && (
                <Button
                  className={cn(
                    'absolute top-0 right-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100'
                  )}
                  size='icon'
                  variant='ghost'
                  onClick={deleteReviewModal.open}
                >
                  <TrashIcon className='size-3' />
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {deleteReviewModal.opened && userReview && (
        <ConfirmDeleteModal review={userReview} onOpenChange={deleteReviewModal.toggle} />
      )}
    </>
  );
};
