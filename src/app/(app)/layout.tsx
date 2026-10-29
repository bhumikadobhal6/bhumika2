import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { ConfigBanner } from '@/components/ConfigBanner';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConfigured } = getSupabaseEnv();
  let userEmail: string | null = null;
  let userName: string | null = null;

  if (isConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    userEmail = user.email ?? null;
    userName = user.user_metadata?.full_name ?? null;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex">
      <Suspense fallback={<div className="hidden lg:block w-64 bg-slate-900 min-h-screen fixed left-0 top-0 bottom-0 z-30" />}>
        <Sidebar userEmail={userEmail} userName={userName} />
      </Suspense>
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <ConfigBanner isConfigured={isConfigured} />
        <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
          <Navbar userEmail={userEmail} userName={userName} />
        </Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

