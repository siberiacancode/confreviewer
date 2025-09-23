import Link from 'next/link';

import { AnimatedShinyText, DotPattern, HyperText } from '@/components/ui';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  const recentTalks = await prisma.talk.findMany({
    take: 3,
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className='relative min-h-screen overflow-hidden bg-white transition-colors dark:bg-black'>
      <DotPattern
        className={cn(
          'fill-gray-400/20 dark:fill-white/10',
          '[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]'
        )}
        cr={1}
        cx={1}
        cy={1}
        height={20}
        width={20}
      />

      <div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-8'>
        <div
          className={cn(
            'group rounded-full border transition-all ease-in hover:cursor-pointer',
            'border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200',
            'dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800'
          )}
        >
          <AnimatedShinyText className='inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-gray-600 hover:duration-300 dark:hover:text-neutral-400'>
            <span>✨ introducing speakers</span>
          </AnimatedShinyText>
        </div>

        <div className='mx-auto max-w-3xl space-y-12 text-center'>
          <div className='flex flex-col items-center justify-center gap-2'>
            <h1 className='text-6xl font-bold text-gray-900 transition-colors dark:text-white'>
              Easy to generate information about conferences
            </h1>

            <HyperText
              className='text-sm font-light text-gray-600 transition-colors dark:text-gray-400'
              animateOnHover={false}
              duration={1000}
            >
              analyze conferences automatically
            </HyperText>
          </div>

          {children}
        </div>

        {!!recentTalks.length && (
          <div className='mt-2 flex flex-col items-center justify-center gap-1'>
            {recentTalks.map((talk) => (
              <div key={talk.id} className='text-xs text-gray-600 dark:text-gray-400'>
                <Link href={`/analysis/${talk.id}`} className='underline'>
                  {talk.speaker} - {talk.title}
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className='mt-5 text-xs text-gray-600 dark:text-gray-400'>
          <span>
            made by{' '}
            <a
              href='https://github.com/siberiacancode'
              className='underline'
              rel='noopener noreferrer'
              target='_blank'
            >
              siberiacancode
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
