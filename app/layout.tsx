import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import process from 'node:process';

import type { TelegramAuthPayload } from '@/lib/telegram';

import { COOKIES } from '@/app/(constants)';
import { Toaster } from '@/components/ui/sonner';
import { decryptPayload } from '@/lib/secure';

import { TelegramWidgetScript, ThemeScript } from './(components)';
import { telegram } from './(contexts)/auth/telegram';
import { Provider } from './provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Conference Reviewer',
  description: 'Analyze conferences automatically'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const getInitialAuth = async () => {
  const cookiesStore = await cookies();
  const raw = cookiesStore.get(COOKIES.AUTH)?.value ?? '';
  const initialAuth = decryptPayload<TelegramAuthPayload>(raw);

  const adminIds = JSON.parse(process.env.TELEGRAM_ADMIN_IDS ?? '[]') as number[];
  const isAdmin = initialAuth ? adminIds.includes(initialAuth.id) : false;

  return {
    initialUser: initialAuth ? telegram.transformPayload(initialAuth) : undefined,
    initialMetadata: {
      isAdmin
    }
  };
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const initialAuth = await getInitialAuth();

  return (
    <html className='text-[20px]' lang='en'>
      <head>
        <ThemeScript />
        <TelegramWidgetScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider auth={initialAuth}>{children}</Provider>
        {process.env.NODE_ENV === 'production' && <Analytics mode='production' />}
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
