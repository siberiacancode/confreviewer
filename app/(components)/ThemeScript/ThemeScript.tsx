import Script from 'next/script';

import { COOKIES } from '@/app/(constants)';

export const ThemeScript = () => (
  <Script
    id='theme-init'
    strategy='beforeInteractive'
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            const theme = document.cookie.match(/${COOKIES.THEME}=(.*?)(;|$)/)?.[1] || 'light';
            document.documentElement.classList.add(theme);
          } catch (_) {}
        })();
      `
    }}
  />
);
