'use client';

import { useRouter } from 'next/navigation';

import type { TalkReview } from '@/app/api/types';
import type { ModalProps } from '@/components/common';

import { IntlText } from '@/app/(contexts)/intl';
import { deleteReview } from '@/app/analysis/(actions)';
import { Modal } from '@/components/common';
import { Button } from '@/components/ui';

export interface ConfirmDeleteModalProps extends ModalProps {
  review: TalkReview;
}

export const ConfirmDeleteModal = ({ review, ...props }: ConfirmDeleteModalProps) => {
  const router = useRouter();

  const onCancel = () => props.onOpenChange(false);

  const onConfirm = () => {
    deleteReview({ reviewId: review.id });
    props.onOpenChange(false);
    router.refresh();
  };

  return (
    <Modal
      title='Удалить комментарий'
      description='Вы уверены, что хотите удалить этот комментарий?'
      {...props}
    >
      <div className='flex justify-end gap-2'>
        <Button className='rounded-full' variant='secondary' onClick={onCancel}>
          <IntlText path='button.cancel' />
        </Button>
        <Button className='rounded-full' onClick={onConfirm}>
          <IntlText path='button.delete' />
        </Button>
      </div>
    </Modal>
  );
};
