export const ROUTES = {
  HOME: '/',
  ANALYSIS: '/analysis',
  TALK: (id: string) => `/analysis/${id}`,
  CONFERENCES: '/analysis/conferences',
  CONFERENCE: (id: string) => `/analysis/conferences/${id}`,
  CONFERENCE_FORM: (id: string) => `/analysis/conferences/${id}/form`,
  ADMIN: {
    EDIT_TALK: (id: string) => `/analysis/${id}/edit`
  }
} as const;

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ADMIN_ROUTE_REGEXPS = Object.values(ROUTES.ADMIN).map((route) => {
  if (typeof route === 'string') {
    return new RegExp(`^${escapeRegex(route)}/?$`);
  }

  const template = route(':id');
  const pattern = escapeRegex(template).replace(escapeRegex(':id'), '[^/]+');
  return new RegExp(`^${pattern}/?$`);
});

export const checkAdminRoute = (pathname: string) =>
  ADMIN_ROUTE_REGEXPS.some((regex) => regex.test(pathname));
