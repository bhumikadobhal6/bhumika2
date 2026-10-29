import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAssignmentById } from '@/lib/assignments';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { AssignmentDetailsClient } from '@/components/AssignmentDetailsClient';

export async function generateMetadata(props: PageProps<'/assignments/[id]'>) {
  const { id } = await props.params;
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return { title: 'Assignment Details | AssignFlow' };
  }

  const supabase = await createClient();
  const res = await getAssignmentById(supabase, id);
  if (res.data) {
    return { title: `${res.data.title} | AssignFlow` };
  }
  return { title: 'Assignment Details | AssignFlow' };
}

export default async function AssignmentDetailsPage(props: PageProps<'/assignments/[id]'>) {
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

  return <AssignmentDetailsClient assignment={res.data} />;
}
