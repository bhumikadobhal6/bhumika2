import React from 'react';
import { Priority, Status } from '@/types/database.types';
import { AlertCircle, Clock, CheckCircle2, Hourglass } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const styles: Record<Priority, { bg: string; text: string; border: string }> = {
    High: {
      bg: 'bg-rose-50 text-rose-700',
      text: 'text-rose-700',
      border: 'border-rose-200',
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    Low: {
      bg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
  };

  const style = styles[priority] || styles.Medium;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${priority === 'High' ? 'bg-rose-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      {priority} Priority
    </span>
  );
}

interface StatusBadgeProps {
  status: Status;
  isOverdue?: boolean;
  className?: string;
}

export function StatusBadge({ status, isOverdue = false, className = '' }: StatusBadgeProps) {
  if (isOverdue && status !== 'Completed') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300 ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
        Overdue
      </span>
    );
  }

  const styles: Record<Status, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    Pending: {
      bg: 'bg-slate-100 text-slate-700',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />,
    },
    'In Progress': {
      bg: 'bg-blue-50 text-blue-700',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Hourglass className="w-3.5 h-3.5 mr-1 text-blue-500" />,
    },
    Completed: {
      bg: 'bg-green-50 text-green-700',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" />,
    },
  };

  const style = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.border} ${className}`}
    >
      {style.icon}
      {status}
    </span>
  );
}

