'use client';

import { useDisclosure } from '@siberiacancode/reactuse';

export const useBugReport = () => {
  const bugReportModal = useDisclosure();

  return {
    features: {
      bugReportModal
    }
  };
};
