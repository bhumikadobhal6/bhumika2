'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import {
  User as UserIcon,
  Shield,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  Lock,
  Save,
} from 'lucide-react';
import { updatePassword, updateProfile } from '@/lib/auth';

interface SettingsClientProps {
  user: User | null;
  isConfigured: boolean;
  supabaseUrl: string;
}

export function SettingsClient({
  user,
  isConfigured,
  supabaseUrl,
}: SettingsClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const [fullName, setFullName] = useState(
    (user?.user_metadata?.full_name as string | undefined) || ''
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!isConfigured) {
      setProfileMessage({
        type: 'error',
        text: 'Connect Supabase in .env.local before updating your profile.',
      });
      return;
    }

    if (!fullName.trim()) {
      setProfileMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    setProfileLoading(true);
    const { error } = await updateProfile(fullName);
    setProfileLoading(false);

    if (error) {
      setProfileMessage({ type: 'error', text: error });
      return;
    }

    setProfileMessage({ type: 'success', text: 'Display name updated successfully.' });
    router.refresh();
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!isConfigured) {
      setPasswordMessage({
        type: 'error',
        text: 'Connect Supabase in .env.local before changing your password.',
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: 'error',
        text: 'Password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    const { error } = await updatePassword(newPassword);
    setPasswordLoading(false);

    if (error) {
      setPasswordMessage({ type: 'error', text: error });
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
  };

  const copyMigrationPath = () => {
    navigator.clipboard.writeText('supabase/migrations/001_initial_schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your student account profile, Supabase security settings, and database configurations.
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Profile</h2>
            <p className="text-xs text-slate-500">Your authenticated student credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <span className="font-medium text-slate-900 text-sm">
              {user?.email || 'student@university.edu'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Member Since
            </span>
            <span className="font-medium text-slate-900 text-sm">
              {user?.created_at
                ? new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(user.created_at))
                : 'Not available'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              User ID (UUID)
            </span>
            <span className="font-mono text-slate-700 text-xs break-all">
              {user?.id || 'Not authenticated'}
            </span>
          </div>
        </div>

        {/* Update display name */}
        <form onSubmit={handleProfileSave} className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Display Name
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
              />
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 shrink-0"
              >
                {profileLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Name
              </button>
            </div>
          </div>

          {profileMessage && (
            <p
              className={`flex items-center gap-1.5 text-xs font-medium ${
                profileMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {profileMessage.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              {profileMessage.text}
            </p>
          )}
        </form>

        {/* Change password */}
        <form onSubmit={handlePasswordSave} className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Change Password
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {passwordMessage ? (
              <p
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  passwordMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {passwordMessage.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {passwordMessage.text}
              </p>
            ) : (
              <span className="text-[11px] text-slate-400">
                Use at least 6 characters for your new password.
              </span>
            )}
            <button
              type="submit"
              disabled={passwordLoading || !newPassword || !confirmPassword}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors disabled:opacity-50 shrink-0"
            >
              {passwordLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Database & RLS Posture */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Security & Row Level Security (RLS)</h2>
            <p className="text-xs text-slate-500">How your academic data is isolated and protected</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Strict Row Level Security Enforced</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                PostgreSQL RLS ensures that each student can only read, create, update, and delete their own assignments. Queries targeting another student&rsquo;s data are automatically rejected by PostgreSQL at the database level.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Secure Cookie-Based SSR Sessions</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Authentication tokens are handled via HTTP-only, secure cookies with `@supabase/ssr` middleware, preventing client-side script injection and keeping sessions alive across refreshes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Environment Status */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Database Connection</h2>
            <p className="text-xs text-slate-500">Supabase backend connection details</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="font-semibold text-slate-900 block">Configuration Status</span>
              <span className="text-slate-500 text-[11px]">
                {isConfigured ? 'Valid Supabase project URL & Anon key detected' : 'Placeholder keys detected'}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isConfigured
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {isConfigured ? 'Connected' : 'Setup Required'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">
              Endpoint URL
            </span>
            <span className="font-mono text-slate-800 text-xs">
              {supabaseUrl || 'Not configured'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-2 text-indigo-300">
                <Terminal className="w-4 h-4" />
                Database Migration Script
              </span>
              <button
                onClick={copyMigrationPath}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied path' : 'Copy path'}
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Find the full SQL migration in <code className="text-indigo-300 font-mono">supabase/migrations/001_initial_schema.sql</code>. It includes table definitions, indexes, timestamps, and RLS policies.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Open Supabase Dashboard
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

