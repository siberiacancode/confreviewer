import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';

import type { TelegramAuthPayload } from '@/lib/telegram';

import { Toaster } from '@/components/ui/sonner';
import { decryptPayload } from '@/lib/secure';
import { AUTH_COOKIE, toAuthUser } from '@/lib/telegram';

import { TelegramWidgetScript, ThemeScript } from './(components)';
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
  const raw = cookiesStore.get(AUTH_COOKIE)?.value ?? '';
  const initialAuth = decryptPayload<TelegramAuthPayload>(raw);
  return initialAuth ? toAuthUser(initialAuth) : undefined;
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
        <Provider
          auth={{
            initialAuth
          }}
        >
          {children}
        </Provider>
        <Analytics mode='production' />
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
