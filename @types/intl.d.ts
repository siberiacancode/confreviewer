type Locale = 'en' | 'ru';
type MessagePath = keyof typeof import('@/public/locales/ru.json');

namespace FormatjsIntl {
  interface IntlConfig {
    locale: Locale;
  }
  interface Message {
    ids: MessagePath;
  }
}
