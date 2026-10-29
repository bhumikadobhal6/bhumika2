'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  GraduationCap,
  Plus,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { signOutUser } from '@/lib/auth';
import { getSupabaseEnv } from '@/lib/supabase/config';

interface NavbarProps {
  userEmail?: string | null;
  userName?: string | null;
}

export function Navbar({ userEmail, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { isConfigured } = getSupabaseEnv();

  const handleSignOut = async () => {
    if (isConfigured) {
      await signOutUser();
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile Logo & Hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">AssignFlow</span>
          </Link>
        </div>

        {/* Desktop Title / Welcome Area */}
        <div className="hidden lg:flex items-center gap-4">
          <h1 className="text-sm font-medium text-slate-500">
            Welcome back, <span className="text-slate-800 font-semibold">{userName || userEmail?.split('@')[0] || 'Student'}</span>
          </h1>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/assignments/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Assignment</span>
            <span className="sm:hidden">New</span>
          </Link>

          <div className="hidden lg:flex items-center pl-3 border-l border-slate-200 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            Active Session
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          <div className="pb-3 border-b border-slate-800 px-2">
            <p className="text-sm font-semibold text-white">{userName || 'College Student'}</p>
            <p className="text-xs text-slate-400">{userEmail || 'student@university.edu'}</p>
          </div>

          <div className="space-y-1 pt-1">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              Dashboard
            </Link>
            <Link
              href="/assignments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ClipboardList className="w-4 h-4 text-indigo-400" />
              Assignments
            </Link>
            <Link
              href="/assignments/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              Create Assignment
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              Settings
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

