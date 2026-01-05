import Script from 'next/script';

const TELEGRAM_WIDGET_SRC = 'https://telegram.org/js/telegram-widget.js?22';

export const TelegramWidgetScript = () => (
  <>
    <Script id='telegram-widget-lib' src={TELEGRAM_WIDGET_SRC} strategy='beforeInteractive' />
  </>
);
