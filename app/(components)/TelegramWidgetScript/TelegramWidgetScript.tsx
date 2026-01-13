import Script from 'next/script';

import { EXTERNAL_LINKS } from '@/app/(constants)';

export const TelegramWidgetScript = () => (
  <>
    <Script
      id='telegram-widget-lib'
      src={EXTERNAL_LINKS.TELEGRAM.WIDGET_SCRIPT}
      strategy='beforeInteractive'
    />
  </>
);
