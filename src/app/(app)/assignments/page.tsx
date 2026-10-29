import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getAssignments } from '@/lib/assignments';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { AssignmentsListClient } from '@/components/AssignmentsListClient';
import { Assignment } from '@/types/database.types';

export const metadata = {
  title: 'All Assignments | AssignFlow',
  description: 'Manage, search, and track all your college assignments and coursework.',
};

export default async function AssignmentsPage() {
  const { isConfigured } = getSupabaseEnv();
  let assignments: Assignment[] = [];

  if (isConfigured) {
    const supabase = await createClient();
    const res = await getAssignments(supabase);
    if (res.data) {
      assignments = res.data;
    }
  }

  return <AssignmentsListClient initialAssignments={assignments} />;
}

