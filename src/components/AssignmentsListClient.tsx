'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Assignment, Priority, Status } from '@/types/database.types';
import { AssignmentFilterBar } from '@/components/AssignmentFilterBar';
import { AssignmentCard } from '@/components/AssignmentCard';
import { DeleteModal } from '@/components/DeleteModal';
import { EmptyState } from '@/components/EmptyState';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { getAssignments, updateAssignment, deleteAssignment } from '@/lib/assignments';
import { Plus, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface AssignmentsListClientProps {
  initialAssignments: Assignment[];
}

export function AssignmentsListClient({ initialAssignments }: AssignmentsListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isConfigured } = getSupabaseEnv();

  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status | 'All'>('All');
  const [priority, setPriority] = useState<Priority | 'All'>('All');
  const [subject, setSubject] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'due_date' | 'created_at'>('due_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Compute distinct subjects from the dataset
  const subjectsList = useMemo(() => {
    const set = new Set<string>();
    initialAssignments.forEach((a) => {
      if (a.subject) set.add(a.subject);
    });
    return Array.from(set).sort();
  }, [initialAssignments]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Re-fetch or filter assignments based on criteria
  useEffect(() => {
    let isCancelled = false;

    // Client-side filtering keeps the UI usable when Supabase is not
    // configured yet or the network request fails.
    const applyLocalFilters = () => {
      let list = [...initialAssignments];
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (a) => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)
        );
      }
      if (status !== 'All') list = list.filter((a) => a.status === status);
      if (priority !== 'All') list = list.filter((a) => a.priority === priority);
      if (subject !== 'All') list = list.filter((a) => a.subject === subject);
      list.sort((a, b) => {
        const timeA = new Date(a[sortBy]).getTime();
        const timeB = new Date(b[sortBy]).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
      setAssignments(list);
    };

    const fetchFilteredData = async () => {
      if (!isConfigured) {
        applyLocalFilters();
        return;
      }

      startTransition(async () => {
        try {
          const supabase = createClient();
          const res = await getAssignments(supabase, {
            search,
            status,
            priority,
            subject,
            sortBy,
            sortOrder,
          });

          if (isCancelled) return;

          if (res.data) {
            setAssignments(res.data);
          } else if (res.error) {
            applyLocalFilters();
          }
        } catch {
          if (!isCancelled) applyLocalFilters();
        }
      });
    };

    const timer = setTimeout(fetchFilteredData, 200);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    search,
    status,
    priority,
    subject,
    sortBy,
    sortOrder,
    initialAssignments,
    isConfigured,
  ]);

  const handleStatusChange = async (id: string, newStatus: Status) => {
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

  const handleClearFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setSubject('All');
    setSortBy('due_date');
    setSortOrder('asc');
  };

  const isFiltering =
    search.trim() !== '' ||
    status !== 'All' ||
    priority !== 'All' ||
    subject !== 'All';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, prioritize, and manage all your coursework.
          </p>
        </div>
        <Link
          href="/assignments/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <AssignmentFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        subject={subject}
        onSubjectChange={setSubject}
        subjectsList={subjectsList}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onClearFilters={handleClearFilters}
      />

      {/* Assignment List */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
          <span>
            Showing <strong className="text-slate-800">{assignments.length}</strong> {assignments.length === 1 ? 'assignment' : 'assignments'}
          </span>
          {isPending && (
            <span className="flex items-center gap-1.5 text-indigo-600">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </span>
          )}
        </div>

        {assignments.length === 0 ? (
          <EmptyState
            title={isFiltering ? 'No assignments match your search/filter' : 'No assignments yet'}
            description={
              isFiltering
                ? 'Try adjusting your search keywords, clear priority/status filters, or reset all filters to view all coursework.'
                : 'Stay ahead of your coursework! Create your first assignment to begin tracking deadlines and tasks.'
            }
            actionText={isFiltering ? 'Clear Filters' : 'Create Assignment'}
            onActionClick={isFiltering ? handleClearFilters : undefined}
            actionHref={isFiltering ? undefined : '/assignments/new'}
            isFiltered={isFiltering}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
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

      {/* Delete Confirmation Modal */}
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

