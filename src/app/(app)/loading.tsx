import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function AppLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner text="Loading your academic workspace..." />
    </div>
  );
}
