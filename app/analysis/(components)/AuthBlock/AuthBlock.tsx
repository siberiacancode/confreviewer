'use client';

import { LogOutIcon, StarIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/app/(contexts)/auth';
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
        Sign in
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
          <Avatar className='size-8'>
            <AvatarImage src={auth.user.photoUrl} />
            <AvatarFallback>{auth.user.username![0].toLowerCase()}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{auth.user.firstName}</span>
            <span className='text-muted-foreground text-xs'>{auth.user.username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href='/profile'>
            <UserIcon className='size-4' />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/profile'>
            <StarIcon className='size-4' />
            Favorites
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={auth.logout}>
          <LogOutIcon className='size-4' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
