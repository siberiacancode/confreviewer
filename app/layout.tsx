import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import process from 'node:process';

import type { UserResponse } from '@/app/api/user/route';

import { api } from '@/app/api/instance';
import { Toaster } from '@/components/ui/sonner';

import { BugReport, TelegramWidgetScript, ThemeScript } from './(components)';
import { getDictionary } from './(contexts)/intl/helpers/getDictionary';
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
  const userResponse = await api.get<UserResponse>('/user');

  if (!userResponse.data) {
    return {
      initialUser: undefined,
      initialMetadata: {
        isAdmin: false,
        isReviewer: false
      }
    };
  }

  return {
    initialUser: userResponse.data.user,
    initialMetadata: userResponse.data.metadata
  };
};

const getInitialIntl = async () => {
  const locale = 'ru' as Locale;
  const messages = await getDictionary(locale);

  return {
    locale,
    messages
  };
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const initialAuth = await getInitialAuth();
  const initialIntl = await getInitialIntl();

  return (
    <html className='text-[20px]' lang='en'>
      <head>
        <ThemeScript />
        <TelegramWidgetScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider auth={initialAuth} intl={initialIntl}>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics mode='production' />}
          <Toaster />
          <BugReport />
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
