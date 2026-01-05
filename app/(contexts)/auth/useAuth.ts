'use client';

import { use } from 'react';

import { AuthContext } from './AuthContext';

export const useAuth = () => use(AuthContext);
