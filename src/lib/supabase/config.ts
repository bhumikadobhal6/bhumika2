/**
 * Supabase configuration and environment variable validation.
 * Uses exact required environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('your-project') &&
    !url.includes('your_supabase') &&
    anonKey !== 'your-anon-key-here' &&
    anonKey !== 'your_supabase_publishable_or_anon_key'
  );

  return {
    url: url || '',
    anonKey: anonKey || '',
    isConfigured,
  };
}

