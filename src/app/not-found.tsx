import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 p-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-5">
          <Compass className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">404</p>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Page not found</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          The page or assignment you are looking for doesn&rsquo;t exist, was moved, or is not
          available to your account.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/dashboard"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/assignments"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Assignments
          </Link>
        </div>
      </div>
    </div>
  );
}
