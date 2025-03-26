import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { metadata } from './metadata';

// Use dynamic import for client component with no SSR
const HomePage = dynamic(() => import('@/components/HomePage'), { ssr: false });

export { metadata };

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}
