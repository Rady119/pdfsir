'use client';

import { Dashboard } from './Dashboard';
import { AuthGuard } from '@/components/AuthGuard';

export function DashboardWithAuth() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}