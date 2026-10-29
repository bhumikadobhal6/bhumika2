'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Assignment, Status } from '@/types/database.types';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { DeleteModal } from '@/components/DeleteModal';
import { formatDate, isOverdue, getDaysRemaining } from '@/lib/utils';
import { useCurrentTime } from '@/lib/useCurrentTime';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { updateAssignment, deleteAssignment } from '@/lib/assignments';
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
} from 'lucide-react';

interface AssignmentDetailsClientProps {
  assignment: Assignment;
}

export function AssignmentDetailsClient({ assignment: initialAssignment }: AssignmentDetailsClientProps) {
  const router = useRouter();
  const { isConfigured } = getSupabaseEnv();
  const [assignment, setAssignment] = useState<Assignment>(initialAssignment);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const now = useCurrentTime();
  const overdue = now > 0 ? isOverdue(assignment.due_date, assignment.status, now) : false;
  const days = now > 0 ? getDaysRemaining(assignment.due_date, now) : 0;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusUpdate = async (newStatus: Status) => {
    if (!isConfigured) {
      showNotification('error', 'Connect Supabase in .env.local to update this assignment.');
      return;
    }
    const supabase = createClient();
    const res = await updateAssignment(supabase, assignment.id, { status: newStatus });
    if (res.error) {
      showNotification('error', res.error);
      return;
    }

    setAssignment((prev) => ({
      ...prev,
      status: newStatus,
      updated_at: new Date().toISOString(),
    }));
    showNotification('success', `Status marked as ${newStatus}`);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!isConfigured) {
      showNotification('error', 'Connect Supabase in .env.local to delete this assignment.');
      return;
    }
    setIsDeleting(true);
    const supabase = createClient();
    const res = await deleteAssignment(supabase, assignment.id);
    setIsDeleting(false);

    if (res.error) {
      showNotification('error', res.error);
      return;
    }

    showNotification('success', 'Assignment deleted successfully. Redirecting...');
    setTimeout(() => {
      router.push('/assignments');
      router.refresh();
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-bottom-2 ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all assignments
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header: Title and Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                {assignment.subject}
              </span>
              <PriorityBadge priority={assignment.priority} />
              <StatusBadge status={assignment.status} isOverdue={overdue} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {assignment.title}
            </h1>
          </div>

          {/* Quick Actions (Edit / Delete) */}
          <div className="flex items-center gap-2 self-start">
            <Link
              href={`/assignments/${assignment.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Deadline & Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" /> Due Date
            </span>
            <p className="text-sm font-bold text-slate-900">{formatDate(assignment.due_date)}</p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${
            overdue
              ? 'bg-rose-50/70 border-rose-100 text-rose-900'
              : assignment.status === 'Completed'
              ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
              : 'bg-indigo-50/70 border-indigo-100 text-indigo-900'
          }`}>
            <span className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 opacity-75">
              <Clock className="w-3 h-3" /> Time Remaining
            </span>
            <p className="text-sm font-bold">
              {assignment.status === 'Completed'
                ? 'Completed'
                : overdue
                ? days === 0 ? 'Overdue today!' : `Overdue by ${Math.abs(days)} days`
                : days === 0 ? 'Due today!' : days === 1 ? 'Due tomorrow' : `${days} days left`}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <History className="w-3 h-3 text-slate-400" /> Quick Status
            </span>
            <div className="flex items-center gap-1.5 pt-0.5">
              {(['Pending', 'In Progress', 'Completed'] as Status[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusUpdate(st)}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                    assignment.status === st
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Notes */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-slate-400" />
            Description & Notes
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/60 border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {assignment.description || (
              <span className="text-slate-400 italic">No notes or description provided for this assignment.</span>
            )}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 gap-2">
          <span>Created on {formatDate(assignment.created_at)}</span>
          <span>Last updated {formatDate(assignment.updated_at)}</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        title={assignment.title}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
