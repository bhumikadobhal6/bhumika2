import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/ResetPasswordForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const metadata = {
  title: 'Reset Password | AssignFlow',
  description: 'Choose a new password for your AssignFlow student account.',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingSpinner text="Verifying reset link..." />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
