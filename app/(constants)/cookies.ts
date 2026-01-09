export const COOKIES_PREFIX = 'conference-reviewer';
export const COOKIES = {
  AUTH: `${COOKIES_PREFIX}-auth`,
  THEME: `${COOKIES_PREFIX}-theme`
};

export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTH_COOKIE_EXPIRES = ONE_WEEK_MS;
