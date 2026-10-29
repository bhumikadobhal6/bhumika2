'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Assignment, Status } from '@/types/database.types';
import { PriorityBadge, StatusBadge } from './Badges';
import { formatDate, isOverdue, getDaysRemaining } from '@/lib/utils';
import { useCurrentTime } from '@/lib/useCurrentTime';
import { Calendar, BookOpen, MoreVertical, Edit3, Trash2, Eye, CheckCircle2 } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onDeleteRequest: (assignment: Assignment) => void;
  onStatusChange?: (assignmentId: string, newStatus: Status) => void;
}

export function AssignmentCard({
  assignment,
  onDeleteRequest,
  onStatusChange,
}: AssignmentCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const now = useCurrentTime();

  const overdue = now > 0 ? isOverdue(assignment.due_date, assignment.status, now) : false;
  const days = now > 0 ? getDaysRemaining(assignment.due_date, now) : 0;

  let deadlineLabel = '';
  if (now === 0) {
    deadlineLabel = assignment.status === 'Completed' ? 'Finished' : 'Upcoming';
  } else if (assignment.status === 'Completed') {
    deadlineLabel = 'Finished';
  } else if (overdue) {
    deadlineLabel = days === 0 ? 'Overdue today' : `Overdue by ${Math.abs(days)}d`;
  } else if (days === 0) {
    deadlineLabel = 'Due today';
  } else if (days === 1) {
    deadlineLabel = 'Due tomorrow';
  } else {
    deadlineLabel = `In ${days} days`;
  }

  return (
    <div className={`bg-white rounded-xl border transition-all duration-200 p-5 relative shadow-xs hover:shadow-md ${
      overdue
        ? 'border-red-200 hover:border-red-300'
        : assignment.status === 'Completed'
        ? 'border-emerald-100/80 bg-slate-50/50'
        : 'border-slate-200/80 hover:border-indigo-200'
    }`}>
      {/* Top row: Subject, Badges, and Menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <BookOpen className="w-3 h-3 text-indigo-500" />
            {assignment.subject}
          </span>
          <PriorityBadge priority={assignment.priority} />
          <StatusBadge status={assignment.status} isOverdue={overdue} />
        </div>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Assignment actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-xs animate-in fade-in">
                <Link
                  href={`/assignments/${assignment.id}`}
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </Link>
                <Link
                  href={`/assignments/${assignment.id}/edit`}
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Assignment
                </Link>
                {onStatusChange && assignment.status !== 'Completed' && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onStatusChange(assignment.id, 'Completed');
                    }}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Completed
                  </button>
                )}
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onDeleteRequest(assignment);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <Link href={`/assignments/${assignment.id}`} className="block group">
        <h3 className={`font-semibold text-base transition-colors ${
          assignment.status === 'Completed'
            ? 'text-slate-600 line-through'
            : 'text-slate-900 group-hover:text-indigo-600'
        }`}>
          {assignment.title}
        </h3>
      </Link>

      {/* Description Snippet */}
      {assignment.description && (
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>
      )}

      {/* Footer Info: Deadline */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(assignment.due_date)}</span>
        </div>

        <span className={`font-medium px-2 py-0.5 rounded-md ${
          assignment.status === 'Completed'
            ? 'text-emerald-700 bg-emerald-50'
            : overdue
            ? 'text-red-700 bg-red-50 font-semibold'
            : 'text-indigo-700 bg-indigo-50'
        }`}>
          {deadlineLabel}
        </span>
      </div>
    </div>
  );
}
