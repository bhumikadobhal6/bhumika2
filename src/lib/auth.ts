import { createClient } from './supabase/client';

export async function loginWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error: error ? error.message : null };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
  emailRedirectTo?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
      },
    },
  });

  return { data, error: error ? error.message : null };
}

export async function signOutUser() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

/**
 * Send a password recovery email. The link points at the auth callback,
 * which exchanges the PKCE code and forwards the student to /reset-password.
 */
export async function requestPasswordReset(email: string, redirectTo: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  return { error: error ? error.message : null };
}

/**
 * Set a new password for the currently authenticated user.
 * Used after following a recovery link (or from Settings).
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  return { error: error ? error.message : null };
}

/**
 * Update the student's display name in Supabase auth metadata.
 */
export async function updateProfile(fullName: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fullName.trim() },
  });

  return { data, error: error ? error.message : null };
}

/**
 * Build the absolute URL used by Supabase auth emails.
 */
export function getAuthCallbackUrl(nextPath = '/dashboard'): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}
