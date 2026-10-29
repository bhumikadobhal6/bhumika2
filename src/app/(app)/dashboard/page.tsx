import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getAssignments } from '@/lib/assignments';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { DashboardClient } from '@/components/DashboardClient';
import { Assignment } from '@/types/database.types';

export const metadata = {
  title: 'Dashboard | AssignFlow',
  description: 'Track academic deadlines, priorities, and assignments.',
};

export default async function DashboardPage() {
  const { isConfigured } = getSupabaseEnv();
  let assignments: Assignment[] = [];
  let userName: string | null = null;

  if (isConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? null;
      const res = await getAssignments(supabase);
      if (res.data) {
        assignments = res.data;
      }
    }
  }

  return (
    <DashboardClient
      initialAssignments={assignments}
      userName={userName}
    />
  );
}

