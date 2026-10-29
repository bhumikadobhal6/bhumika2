'use client';

import React from 'react';
import Link from 'next/link';
import { Assignment } from '@/types/database.types';
import { formatDate, getDaysRemaining } from '@/lib/utils';
import { useCurrentTime } from '@/lib/useCurrentTime';
import { Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PriorityBadge } from './Badges';

interface UpcomingDeadlinesProps {
  assignments: Assignment[];
  onComplete?: (id: string) => void;
}

export function UpcomingDeadlines({ assignments, onComplete }: UpcomingDeadlinesProps) {
  const now = useCurrentTime();

  // Filter for incomplete assignments with due dates in the future
  const upcoming = assignments
    .filter((a) => a.status !== 'Completed' && (now === 0 || new Date(a.due_date).getTime() >= now))
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs text-center">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No Imminent Deadlines</h3>
        <p className="text-xs text-slate-500 mt-1">
          You are all caught up! Enjoy your free time or prepare ahead for upcoming topics.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
            <p className="text-[11px] text-slate-500">Sorted by nearest deadline</p>
          </div>
        </div>
        <Link
          href="/assignments"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {upcoming.map((item) => {
          const days = now > 0 ? getDaysRemaining(item.due_date, now) : 0;
          let dueBadge = '';
          if (now === 0) dueBadge = 'Upcoming';
          else if (days === 0) dueBadge = 'Due today!';
          else if (days === 1) dueBadge = 'Due tomorrow';
          else dueBadge = `In ${days} days`;

          return (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {item.subject}
                  </span>
                  <PriorityBadge priority={item.priority} />
                </div>
                <Link
                  href={`/assignments/${item.id}`}
                  className="text-sm font-semibold text-slate-900 hover:text-indigo-600 truncate block"
                >
                  {item.title}
                </Link>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(item.due_date)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  now > 0 && days <= 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {dueBadge}
                </span>

                {onComplete && (
                  <button
                    onClick={() => onComplete(item.id)}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 hover:underline"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
