'use client';

import { IntlText } from '@/app/(contexts)/intl';
import { Modal } from '@/components/common';
import { TelegramIcon } from '@/components/icons';
import { Button } from '@/components/ui';

import { useAuthModal } from './hooks';

export const AuthModal = () => {
  const { features, functions } = useAuthModal();

  return (
    <Modal
      title='Sign in'
      description='Authentication via Telegram'
      onOpenChange={features.authModal.close}
    >
      <div className='flex flex-col gap-3'>
        <Button className='rounded-full' size='lg' variant='secondary' onClick={functions.onLogin}>
          <TelegramIcon className='size-5' />
          <IntlText path='button.signInViaTelegram' />
        </Button>
      </div>
    </Modal>
  );
};
