import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { SettingsClient } from '@/components/SettingsClient';
import { User } from '@supabase/supabase-js';

export const metadata = {
  title: 'Settings | AssignFlow',
  description: 'View student profile, Supabase connection status, and RLS configurations.',
};

export default async function SettingsPage() {
  const { url, isConfigured } = getSupabaseEnv();
  let user: User | null = null;

  if (isConfigured) {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  }

  return (
    <SettingsClient
      user={user}
      isConfigured={isConfigured}
      supabaseUrl={url}
    />
  );
}

