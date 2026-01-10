'use client';

import { BugIcon } from 'lucide-react';

import { Button } from '@/components/ui';

import { BugReportModal } from './components/BugReportModal/BugReportModal';
import { useBugReport } from './hooks';

export const BugReport = () => {
  const { features } = useBugReport();

  return (
    <>
      <Button
        className='fixed right-4 bottom-4 z-50 rounded-full'
        size='icon'
        variant='secondary'
        onClick={features.bugReportModal.open}
      >
        <BugIcon className='size-4' />
      </Button>

      {features.bugReportModal.opened && (
        <BugReportModal onOpenChange={features.bugReportModal.toggle} />
      )}
    </>
  );
};
