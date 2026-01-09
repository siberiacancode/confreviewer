'use client';

import { Modal } from '@/components/common';
import { TelegramIcon } from '@/components/icons';
import { Button } from '@/components/ui';

import { useAuthModal } from './hooks';

export const AuthModal = () => {
  const { state, functions } = useAuthModal();

  return (
    <Modal
      title='Sign in'
      description='Authentication via Telegram'
      onOpenChange={functions.onClose}
      open={state.opened}
    >
      <div className='flex flex-col gap-3'>
        <Button className='rounded-full' size='lg' variant='secondary' onClick={functions.onLogin}>
          <TelegramIcon className='size-5' />
          <span>Sign in via Telegram</span>
        </Button>
      </div>
    </Modal>
  );
};
