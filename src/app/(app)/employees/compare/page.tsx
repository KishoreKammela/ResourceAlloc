'use client';

import { Suspense } from 'react';
import EmployeeComparisonClient from './_components/employee-comparison-client';
import { Loader2 } from 'lucide-react';

function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <EmployeeComparisonClient />
    </Suspense>
  );
}

export default ComparePage;
