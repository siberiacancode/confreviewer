import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Provider } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conference Reviewer",
  description: "Analyze conferences automatically",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" className="text-[20px]">
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              const theme = document.cookie.match(/theme=(.*?)(;|$)/)?.[1] || 'light';
              document.documentElement.classList.add(theme);
            `,
        }}
      />
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Provider>{children}</Provider>
    </body>
  </html>
);

export default RootLayout;
