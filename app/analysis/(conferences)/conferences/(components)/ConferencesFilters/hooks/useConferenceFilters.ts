import { useDebounceCallback, useField } from '@siberiacancode/reactuse';
import { useRouter, useSearchParams } from 'next/navigation';

export const useConferenceFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search') ?? '';
  const searchField = useField({ initialValue: searchQuery });

  const onSearchChange = useDebounceCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (value) params.set('search', value);
    else params.delete('search');

    router.replace(`?${params.toString()}`, { scroll: false });
  }, 500);

  return {
    state: {
      searchField
    },
    functions: {
      onSearchChange
    }
  };
};
