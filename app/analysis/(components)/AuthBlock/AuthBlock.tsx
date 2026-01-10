'use client';

import { LogOutIcon, StarIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/app/(constants)';
import { useAuth } from '@/app/(contexts)/auth';
import { IntlText } from '@/app/(contexts)/intl';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui';

export const AuthBlock = () => {
  const auth = useAuth();

  if (!auth.user) {
    return (
      <Button className='rounded-full' size='sm' onClick={auth.authModal.open}>
        <IntlText path='button.signIn' />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex size-8 items-center justify-center'>
          <Avatar className='size-6'>
            <AvatarImage src={auth.user.photoUrl} />
            <AvatarFallback>{auth.user.username![0].toLowerCase()}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='flex items-center gap-3 px-2'>
          <div className='relative'>
            <Avatar className='size-8'>
              <AvatarImage src={auth.user.photoUrl} />
              <AvatarFallback>{auth.user.username![0].toLowerCase()}</AvatarFallback>
            </Avatar>
            {auth.metadata.isAdmin && (
              <div className='bg-secondary text-secondary-foreground absolute top-5 left-5 rounded-full px-1 text-[10px]'>
                A
              </div>
            )}
          </div>
          <div className='flex flex-col'>
            <span className='font-medium'>{auth.user.firstName}</span>
            <span className='text-muted-foreground text-xs'>{auth.user.username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE}>
            <UserIcon className='size-4' />
            <IntlText path='button.profile' />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE}>
            <StarIcon className='size-4' />
            <IntlText path='button.favorites' />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={auth.logout}>
          <LogOutIcon className='size-4' />
          <IntlText path='button.logout' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
