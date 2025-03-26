import { Suspense } from 'react';
import { DashboardWithAuth } from './DashboardWithAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardWithAuth />
    </Suspense>
  );
}
