'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { signOutUser } from '@/lib/auth';
import { getSupabaseEnv } from '@/lib/supabase/config';

interface SidebarProps {
  userEmail?: string | null;
  userName?: string | null;
}

export function Sidebar({ userEmail, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { isConfigured } = getSupabaseEnv();

  const handleSignOut = async () => {
    if (isConfigured) {
      await signOutUser();
    }
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      name: 'Assignments',
      href: '/assignments',
      icon: ClipboardList,
      active: pathname === '/assignments' || (pathname.startsWith('/assignments/') && !pathname.endsWith('/new')),
    },
    {
      name: 'New Assignment',
      href: '/assignments/new',
      icon: PlusCircle,
      active: pathname === '/assignments/new',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen fixed left-0 top-0 bottom-0 z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-18 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
            AssignFlow
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 block -mt-0.5">
            College Academic Suite
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                item.active
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Quick Insights
        </div>
        <div className="mx-2 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Study Tip
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Break large tasks into smaller daily goals. Check upcoming deadlines regularly to stay ahead!
          </p>
        </div>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
            {(userName || userEmail || 'S')[0]}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {userName || 'College Student'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{userEmail || 'student@university.edu'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/50 hover:border-rose-500/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

