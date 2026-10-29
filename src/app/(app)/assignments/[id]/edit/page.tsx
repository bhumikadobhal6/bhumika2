import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAssignmentById } from '@/lib/assignments';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { EditAssignmentClient } from '@/components/EditAssignmentClient';

export const metadata = {
  title: 'Edit Assignment | AssignFlow',
  description: 'Update assignment details, priority, deadline, and status.',
};

export default async function EditAssignmentPage(props: PageProps<'/assignments/[id]/edit'>) {
  const { id } = await props.params;
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    notFound();
  }

  const supabase = await createClient();
  const res = await getAssignmentById(supabase, id);

  if (res.error || !res.data) {
    notFound();
  }

  return <EditAssignmentClient assignment={res.data} />;
}
