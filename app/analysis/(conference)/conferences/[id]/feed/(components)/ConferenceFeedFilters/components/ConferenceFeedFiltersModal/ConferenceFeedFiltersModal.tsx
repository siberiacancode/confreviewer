import { FlameIcon, StarIcon, TrendingUpIcon } from 'lucide-react';

import type { ModalProps } from '@/components/common';

import { IntlText } from '@/app/(contexts)/intl';
import { Modal } from '@/components/common';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

import { useConferenceFeedFiltersModal } from './hooks/useConferenceFeedFiltersModal';

const BADGES = [
  { key: 'demanded', label: 'Самые востребованные', Icon: TrendingUpIcon },
  { key: 'popular', label: 'Самые популярные', Icon: FlameIcon }
] as const;

export type ConferenceFeedFiltersModalProps = ModalProps;

export const ConferenceFeedFiltersModal = (props: ConferenceFeedFiltersModalProps) => {
  const { state, functions } = useConferenceFeedFiltersModal(props);

  return (
    <Modal title='Фильтры' description='Подберите доклады по условиям' {...props}>
      <form className='flex flex-col gap-4' onSubmit={functions.onSubmit}>
        <div className='flex flex-col gap-4'>
          <Input {...state.searchField.register()} id='feed-search' placeholder='Поиск' />

          <div className='space-y-2'>
            <div className='text-muted-foreground text-sm'>Категории</div>
            <div className='flex flex-wrap gap-2'>
              {BADGES.map((badge) => {
                const active = state.badges[badge.key];
                const Icon = badge.Icon;

                return (
                  <button
                    key={badge.key}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-3 py-2 text-sm transition',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                    type='button'
                    onClick={() => functions.toggleBadge(badge.key)}
                  >
                    <Icon className='size-4' />
                    {badge.label}
                  </button>
                );
              })}

              <button
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-2 text-sm transition',
                  state.badges.recommended
                    ? 'bg-amber-500 text-amber-950 dark:text-amber-50'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-100'
                )}
                type='button'
                onClick={() => functions.toggleBadge('recommended')}
              >
                <StarIcon className='size-4' />
                Рекомендовано
              </button>
            </div>
          </div>

          <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end'>
            <Button
              className='rounded-full'
              type='reset'
              variant='outline'
              onClick={functions.onReset}
            >
              <IntlText path='button.clear' />
            </Button>
            <Button className='rounded-full' type='submit'>
              <IntlText path='button.apply' />
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
