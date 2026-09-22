'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentInterviewsPage() {
  const router = useRouter();

  useEffect(() => {
    // The student interview stage has been removed from the selection workflow.
    // Selection progress is now tracked directly under My Applications.
    router.replace('/student/applications');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D12] text-slate-900 dark:text-slate-100 flex items-center justify-center text-xs">
      Redirecting to My Applications...
    </div>
  );
}
