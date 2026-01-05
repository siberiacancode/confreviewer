'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';

import { TelegramIcon } from '@/components/icons';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui';

import { useAuthModal } from './hooks';

export const AuthModal = () => {
  const { state, functions } = useAuthModal();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Drawer onOpenChange={functions.close} open={state.opened}>
        <DrawerContent>
          <DrawerHeader className='flex flex-col items-center justify-center'>
            <DrawerTitle>Sign in</DrawerTitle>
            <DrawerDescription>Authentication via Telegram</DrawerDescription>
          </DrawerHeader>

          <div className='flex flex-col gap-3 px-4'>
            <Button
              className='rounded-full'
              size='lg'
              variant='secondary'
              onClick={functions.login}
            >
              <TelegramIcon className='size-5' />
              <span>Sign in via Telegram</span>
            </Button>
          </div>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog onOpenChange={functions.close} open={state.opened}>
      <DialogContent className='w-sm'>
        <DialogHeader className='flex flex-col items-center justify-center'>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>Authentication via Telegram</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3'>
          <Button className='rounded-full' size='lg' variant='secondary' onClick={functions.login}>
            <TelegramIcon className='size-5' />
            <span>Sign in via Telegram</span>
          </Button>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
