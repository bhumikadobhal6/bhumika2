'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Assignment } from '@/types/database.types';
import { calculateDashboardStats } from '@/lib/stats';
import { StatsCard } from '@/components/StatsCard';
import { UpcomingDeadlines } from '@/components/UpcomingDeadlines';
import { CompletionProgress } from '@/components/CompletionProgress';
import { AssignmentCard } from '@/components/AssignmentCard';
import { DeleteModal } from '@/components/DeleteModal';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { updateAssignment, deleteAssignment } from '@/lib/assignments';
import { useCurrentTime } from '@/lib/useCurrentTime';
import {
  Layers,
  Clock,
  Hourglass,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface DashboardClientProps {
  initialAssignments: Assignment[];
  userName?: string | null;
}

export function DashboardClient({ initialAssignments, userName }: DashboardClientProps) {
  const router = useRouter();
  const { isConfigured } = getSupabaseEnv();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const now = useCurrentTime();
  const stats = useMemo(() => calculateDashboardStats(assignments, now), [assignments, now]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    if (!isConfigured) {
      showNotification('error', 'Connect Supabase in .env.local to update assignments.');
      return;
    }
    const supabase = createClient();
    const res = await updateAssignment(supabase, id, { status: newStatus });
    if (res.error) {
      showNotification('error', res.error);
      return;
    }

    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus, updated_at: new Date().toISOString() } : a))
    );
    showNotification('success', `Status updated to ${newStatus}`);
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    if (!isConfigured) {
      showNotification('error', 'Connect Supabase in .env.local to delete assignments.');
      return;
    }
    setIsDeleting(true);
    const supabase = createClient();
    const res = await deleteAssignment(supabase, deleteTarget.id);
    setIsDeleting(false);

    if (res.error) {
      showNotification('error', res.error);
      return;
    }

    setAssignments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
    showNotification('success', 'Assignment deleted successfully');
    router.refresh();
  };

  const recentAssignments = useMemo(
    () =>
      [...assignments]
        .sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 4),
    [assignments]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Greeting and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Overview{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track coursework deadlines, prioritize pending submissions, and monitor term progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/assignments/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </Link>
        </div>
      </div>

      {/* Overdue alert */}
      {stats.overdue > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-rose-900">
                {stats.overdue} {stats.overdue === 1 ? 'assignment is' : 'assignments are'} overdue
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Submit these as soon as possible or update their status to keep your dashboard accurate.
              </p>
            </div>
          </div>
          <Link
            href="/assignments"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shrink-0"
          >
            Review overdue work
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
        <StatsCard
          title="Total Workload"
          value={stats.total}
          subtitle="All semester tasks"
          icon={Layers}
          variant="indigo"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          subtitle="Not yet started"
          icon={Clock}
          variant="slate"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Currently working"
          icon={Hourglass}
          variant="blue"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          subtitle="Submitted & done"
          icon={CheckCircle2}
          variant="green"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          subtitle={stats.overdue > 0 ? 'Requires attention' : 'No overdue items'}
          icon={AlertTriangle}
          variant="rose"
        />
      </div>

      {/* Main Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Progress + Recent Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <CompletionProgress
            total={stats.total}
            completed={stats.completed}
            overdue={stats.overdue}
            completionRate={stats.completionRate}
          />

          {/* Recent Assignments section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Assignments</h3>
                  <p className="text-[11px] text-slate-500">Your latest registered tasks</p>
                </div>
              </div>
              <Link
                href="/assignments"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all ({stats.total})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentAssignments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No assignments recorded yet. Click &ldquo;Add Assignment&rdquo; above to get started!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {recentAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onDeleteRequest={(a) => setDeleteTarget(a)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Upcoming Deadlines */}
        <div className="space-y-6">
          <UpcomingDeadlines
            assignments={assignments}
            onComplete={(id) => handleStatusChange(id, 'Completed')}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title || ''}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
