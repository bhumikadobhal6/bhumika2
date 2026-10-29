import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'amber' | 'indigo' | 'green' | 'rose' | 'slate';
}

const variantStyles = {
  blue: {
    bg: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
    indicator: 'bg-blue-600',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
    indicator: 'bg-amber-600',
  },
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600',
    border: 'border-indigo-100',
    indicator: 'bg-indigo-600',
  },
  green: {
    bg: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-100',
    indicator: 'bg-emerald-600',
  },
  rose: {
    bg: 'bg-rose-50 text-rose-600',
    border: 'border-rose-100',
    indicator: 'bg-rose-600',
  },
  slate: {
    bg: 'bg-slate-50 text-slate-600',
    border: 'border-slate-100',
    indicator: 'bg-slate-600',
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
}: StatsCardProps) {
  const currentVariant = variantStyles[variant] || variantStyles.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${currentVariant.bg} border ${currentVariant.border}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

