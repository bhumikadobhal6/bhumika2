import React from 'react';
import { Target, CheckCircle, Clock } from 'lucide-react';

interface CompletionProgressProps {
  total: number;
  completed: number;
  overdue: number;
  completionRate: number;
}

export function CompletionProgress({
  total,
  completed,
  overdue,
  completionRate,
}: CompletionProgressProps) {
  let message = 'Start completing assignments to boost your rate!';
  if (completionRate >= 80) {
    message = 'Outstanding academic momentum! Keep it up!';
  } else if (completionRate >= 50) {
    message = 'Good progress! Over halfway through your workload.';
  } else if (total > 0) {
    message = 'Focus on high-priority tasks first to build momentum.';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Completion Progress</h3>
            <p className="text-[11px] text-slate-500">Overall academic completion rate</p>
          </div>
        </div>
        <span className="text-xl font-bold text-slate-900">{completionRate}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
        />
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
        <div className="p-2 rounded-xl bg-slate-50">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Total</p>
          <p className="text-base font-bold text-slate-800">{total}</p>
        </div>
        <div className="p-2 rounded-xl bg-emerald-50/60">
          <p className="text-[10px] uppercase font-semibold text-emerald-600 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" /> Done
          </p>
          <p className="text-base font-bold text-emerald-700">{completed}</p>
        </div>
        <div className="p-2 rounded-xl bg-rose-50/60">
          <p className="text-[10px] uppercase font-semibold text-rose-600 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Overdue
          </p>
          <p className="text-base font-bold text-rose-700">{overdue}</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3 text-center">{message}</p>
    </div>
  );
}

