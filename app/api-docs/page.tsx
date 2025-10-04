'use client';

import { ApiReferenceReact } from '@scalar/api-reference-react';

import '@scalar/api-reference-react/style.css';

const ApiDocsPage = () => (
  <ApiReferenceReact
    configuration={{
      _integration: 'nextjs',
      url: '/openapi.json'
    }}
  />
);

export default ApiDocsPage;
