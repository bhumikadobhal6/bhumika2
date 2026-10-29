import React, { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const metadata = {
  title: 'Sign In | AssignFlow',
  description: 'Sign in to access your college assignments and track academic deadlines.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingSpinner text="Loading authentication..." />}>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}

