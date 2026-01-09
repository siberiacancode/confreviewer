import type { ReactNode } from 'react';

import { LoaderIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/app/(constants)';
import { GithubIcon, TelegramIcon, TwitchIcon, VkIcon, YoutubeIcon } from '@/components/icons';
import { Button } from '@/components/ui';

import { AuthBlock, SearchInput, ThemeButton } from './(components)';

const COMMUNITY_URL = 'https://t.me/siberiacancodee';

interface AnalysisLayoutProps {
  children: ReactNode;
}

const AnalysisLayout = ({ children }: AnalysisLayoutProps) => (
  <div className='mx-auto flex min-h-screen max-w-4xl flex-col px-4'>
    <header>
      <div className='flex h-16 items-center justify-between gap-4'>
        <div className='flex-1'>
          <div className='w-fit'>
            <Link href={ROUTES.HOME} className='text-primary hover:text-primary/90'>
              <LoaderIcon className='size-6' />
            </Link>
          </div>
        </div>

        <div className='grow max-sm:hidden'>
          <SearchInput />
        </div>

        <div className='flex flex-1 items-center justify-end gap-2'>
          <Button asChild className='text-sm' size='sm' variant='ghost'>
            <a href={COMMUNITY_URL} rel='noopener noreferrer' target='_blank'>
              Community
            </a>
          </Button>
          <ThemeButton />
          <AuthBlock />
        </div>
      </div>
    </header>

    <main className='my-4 flex-1'>{children}</main>

    <footer className='mt-12 pb-4'>
      <div className='grid gap-8 sm:grid-cols-3'>
        <div className='space-y-4'>
          <div className='text-lg font-semibold'>confreviewer</div>
          <div className='text-muted-foreground flex flex-col justify-start gap-3'>
            <div className='flex items-center gap-2'>
              <Button asChild className='rounded-full' size='icon' variant='outline'>
                <a
                  href='https://t.me/siberiacancodee'
                  aria-label='Telegram'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <TelegramIcon />
                </a>
              </Button>

              <Button asChild className='rounded-full' size='icon' variant='outline'>
                <a
                  href='https://www.youtube.com'
                  aria-label='YouTube'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <YoutubeIcon />
                </a>
              </Button>

              <Button asChild className='rounded-full' size='icon' variant='outline'>
                <a href='https://vk.com' aria-label='VK' rel='noopener noreferrer' target='_blank'>
                  <VkIcon />
                </a>
              </Button>

              <Button asChild className='rounded-full' size='icon' variant='outline'>
                <a
                  href='https://github.com/siberiacancode'
                  aria-label='Github'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <GithubIcon />
                </a>
              </Button>

              <Button asChild className='rounded-full' size='icon' variant='outline'>
                <a
                  href='https://twitch.tv/siberiacancode'
                  aria-label='Twitch'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <TwitchIcon />
                </a>
              </Button>
            </div>

            <div>
              <Button asChild className='rounded-full' size='sm' variant='secondary'>
                <a href='https://t.me/siberiacancodee'>Связаться</a>
              </Button>
            </div>
          </div>
        </div>

        <div className='space-y-3 text-sm'>
          <div className='text-base font-medium'>Навигация</div>
          <div className='text-muted-foreground flex flex-col gap-2'>
            <Link href={ROUTES.HOME} className='hover:text-primary'>
              Главная
            </Link>
            <Link href={ROUTES.CONFERENCES} className='hover:text-primary'>
              Конференции
            </Link>
          </div>
        </div>

        <div className='space-y-3 text-sm'>
          <div className='text-base font-medium'>Документы</div>
          <div className='text-muted-foreground flex flex-col gap-2'>
            <a href='/legal/public-offer' className='hover:text-primary'>
              Публичная оферта
            </a>
            <a href='/legal/terms' className='hover:text-primary'>
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>

      <div className='text-muted-foreground mt-8 text-xs'>
        © {new Date().getFullYear()} confreviewer by siberiacancode — Смотрим и оцениваем вместе
      </div>
    </footer>
  </div>
);

export default AnalysisLayout;
