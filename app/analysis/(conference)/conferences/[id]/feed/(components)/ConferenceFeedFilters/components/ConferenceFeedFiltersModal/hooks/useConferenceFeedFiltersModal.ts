'use client';

import { useField } from '@siberiacancode/reactuse';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import type { ModalProps } from '@/components/common';

const EMPTY_BADGES = {
  demanded: false,
  popular: false,
  recommended: false
} as const;

export type useConferenceFeedFiltersModalParams = ModalProps;

export const useConferenceFeedFiltersModal = (props: useConferenceFeedFiltersModalParams) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchField = useField({
    initialValue: searchParams.get('search') ?? ''
  });
  const [badges, setBadges] = useState({
    demanded: searchParams.has('demanded'),
    popular: searchParams.has('popular'),
    recommended: searchParams.has('recommended')
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const search = searchField.getValue().trim();

    if (search) params.set('search', search);
    if (badges.popular) params.set('popular', '1');
    if (badges.demanded) params.set('demanded', '1');
    if (badges.recommended) params.set('recommended', '1');

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    props.onOpenChange(false);
  };

  const onReset = () => {
    searchField.setValue('');
    setBadges(EMPTY_BADGES);
    router.replace(pathname, { scroll: false });
    props.onOpenChange(false);
  };

  const toggleBadge = (key: keyof typeof EMPTY_BADGES) =>
    setBadges({ ...badges, [key]: !badges[key] });

  return {
    state: {
      searchField,
      badges
    },
    functions: {
      toggleBadge,
      onSubmit,
      onReset
    }
  };
};
