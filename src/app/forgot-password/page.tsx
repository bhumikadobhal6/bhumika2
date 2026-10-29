import React, { Suspense } from 'react';
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const metadata = {
  title: 'Forgot Password | AssignFlow',
  description: 'Request a secure password reset link for your AssignFlow student account.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingSpinner text="Loading password recovery..." />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
