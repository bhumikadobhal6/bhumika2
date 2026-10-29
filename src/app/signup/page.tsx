import React, { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const metadata = {
  title: 'Create Account | AssignFlow',
  description: 'Join AssignFlow to track homework, projects, and academic deadlines with ease.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingSpinner text="Loading authentication..." />}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}

