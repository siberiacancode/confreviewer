import Script from 'next/script';

export const ThemeScript = () => (
  <Script
    id='theme-init'
    strategy='beforeInteractive'
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            const theme = document.cookie.match(/theme=(.*?)(;|$)/)?.[1] || 'light';
            document.documentElement.classList.add(theme);
          } catch (_) {}
        })();
      `
    }}
  />
);
