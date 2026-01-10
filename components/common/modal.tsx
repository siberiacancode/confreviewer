'use client';

import type { ReactNode } from 'react';

import { useMediaQuery } from '@siberiacancode/reactuse';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui';

export interface ModalProps {
  children?: ReactNode;
  description?: ReactNode;

  title?: ReactNode;
  onOpenChange: (open: boolean) => void;
}

export const Modal = ({ onOpenChange, title, description, children }: ModalProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Drawer onOpenChange={onOpenChange} open>
        <DrawerContent>
          {(title || description) && (
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && <DrawerDescription>{description}</DrawerDescription>}
            </DrawerHeader>
          )}
          <div className='px-4 pb-6'>{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open>
      <DialogContent className='w-sm'>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};
