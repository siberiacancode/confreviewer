'use client';

import { useDisclosure, useField } from '@siberiacancode/reactuse';
import { SendIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { useAuth } from '@/app/(contexts)/auth';
import { IntlText } from '@/app/(contexts)/intl';
import { actionReview } from '@/app/analysis/(actions)';
import { Avatar, AvatarFallback, AvatarImage, Button, Separator, Textarea } from '@/components/ui';

import { useTalk } from '../../(contexts)/talk';

export const ReviewForm = () => {
  const router = useRouter();
  const talkContext = useTalk();
  const authContext = useAuth();

  const reviewTextarea = useField();
  const buttonsDisclosure = useDisclosure();
  const [_isPending, startTransition] = useTransition();

  const user = authContext.user;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const comment = reviewTextarea.getValue().trim();
    if (!comment) return;

    startTransition(async () => {
      await actionReview({
        talkId: talkContext.talk.id,
        comment
      });

      router.refresh();
    });
  };

  const onCancel = () => {
    buttonsDisclosure.close();
    reviewTextarea.reset();
  };

  return (
    <>
      <Separator />
      <form className='flex flex-col gap-2' onSubmit={onSubmit}>
        <div className='flex gap-2'>
          <div className='flex size-8 items-center justify-center'>
            <Avatar className='size-8'>
              <AvatarImage src={user!.photoUrl} />
              <AvatarFallback>{user!.username![0].toLowerCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <Textarea
              {...reviewTextarea.register()}
              className='bg-background! min-h-[80px] resize-none border-none shadow-none focus-visible:ring-0'
              onClick={buttonsDisclosure.open}
              placeholder='Написать комментарий...'
              rows={3}
            />
          </div>
        </div>
        {buttonsDisclosure.opened && (
          <div className='flex justify-end gap-2'>
            <Button className='rounded-full' variant='secondary' onClick={onCancel}>
              <IntlText path='button.cancel' />
            </Button>
            <Button className='rounded-full' type='submit'>
              <SendIcon className='size-4' />
              <IntlText path='button.submit' />
            </Button>
          </div>
        )}
      </form>
    </>
  );
};
