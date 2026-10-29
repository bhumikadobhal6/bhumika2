'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuthCallbackUrl, loginWithEmail, signUpWithEmail } from '@/lib/auth';
import { getSupabaseEnv } from '@/lib/supabase/config';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirectTo');
  // Only allow same-origin paths to avoid an open redirect.
  const redirectTo =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/dashboard';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(urlError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { isConfigured } = getSupabaseEnv();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!isConfigured) {
      setErrorMessage(
        'Supabase is not configured yet. Please update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      );
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await loginWithEmail(email.trim(), password);
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } else {
        // Send the confirmation link through /auth/callback so the PKCE code
        // is exchanged for a real session before landing on the dashboard.
        const { data, error } = await signUpWithEmail(
          email.trim(),
          password,
          fullName.trim(),
          getAuthCallbackUrl(redirectTo)
        );
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }

        // If email confirmation is required by Supabase project settings
        if (data.session) {
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 900);
        } else {
          setSuccessMessage(
            'Account created! Please check your email inbox to confirm your registration.'
          );
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during authentication';
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">AssignFlow</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">
          {mode === 'login' ? 'Welcome back, student' : 'Start tracking coursework'}
        </h2>
        <p className="text-xs text-slate-500 mt-1.5">
          {mode === 'login'
            ? 'Sign in to access your assignments, deadlines, and schedule.'
            : 'Create your academic account to organize assignments and deadlines.'}
        </p>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span className="leading-relaxed">{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            {mode === 'login' ? (
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Forgot password?
              </Link>
            ) : (
              <span className="text-[11px] text-slate-400">Min 6 characters</span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            <>
              {mode === 'login' ? 'Sign In to Dashboard' : 'Create Student Account'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch mode */}
      <div className="text-center pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
        {mode === 'login' ? (
          <>
            Don&rsquo;t have an account yet?{' '}
            <Link
              href="/signup"
              className="font-bold text-indigo-600 hover:text-indigo-800 ml-1 transition-colors"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-800 ml-1 transition-colors"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Academic feature tag */}
      <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span>Encrypted with PostgreSQL Row Level Security (RLS)</span>
      </div>
    </div>
  );
}

