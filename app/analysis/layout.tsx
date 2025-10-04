import { LoaderIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';

import { SearchInput, ThemeButton } from './(components)';

interface AnalysisLayoutProps {
  children: React.ReactNode;
}

const AnalysisLayout = ({ children }: AnalysisLayoutProps) => (
  <div className='mx-auto max-w-4xl px-4'>
    <header>
      <div className='flex h-16 items-center justify-between gap-4'>
        <div className='flex-1'>
          <div className='w-fit'>
            <Link href='/' className='text-primary hover:text-primary/90'>
              <LoaderIcon className='size-6' />
            </Link>
          </div>
        </div>

        <div className='grow max-sm:hidden'>
          <SearchInput />
        </div>

        <div className='flex flex-1 items-center justify-end gap-2'>
          <Button asChild className='text-sm' size='sm' variant='ghost'>
            <a href='https://github.com/siberiacancode' rel='noopener noreferrer' target='_blank'>
              Community
            </a>
          </Button>
          <div className='flex items-center gap-1'>
            <ThemeButton />
          </div>
        </div>
      </div>
    </header>

    <div className='mt-4'>{children}</div>
  </div>
);

export default AnalysisLayout;
