import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { getSupabaseEnv } from './config';

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}

