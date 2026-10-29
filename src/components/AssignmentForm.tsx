'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Assignment, AssignmentFormData, Priority, Status } from '@/types/database.types';
import { formatDateTimeLocal } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Save,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface AssignmentFormProps {
  initialData?: Assignment;
  onSubmit: (data: AssignmentFormData) => Promise<{ success: boolean; error?: string }>;
  isEditing?: boolean;
}

export function AssignmentForm({
  initialData,
  onSubmit,
  isEditing = false,
}: AssignmentFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [dueDate, setDueDate] = useState<string>(() => {
    if (initialData?.due_date) {
      return formatDateTimeLocal(initialData.due_date);
    }
    return '';
  });
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'Medium');
  const [status, setStatus] = useState<Status>(initialData?.status || 'Pending');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setQuickDeadline = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDueDate(formatDateTimeLocal(d.toISOString()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client validation
    if (!title.trim()) {
      setErrorMessage('Please provide an assignment title.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please specify the subject or course name.');
      return;
    }
    if (!dueDate) {
      setErrorMessage('Please select a valid deadline date and time.');
      return;
    }

    setLoading(true);

    try {
      const result = await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        subject: subject.trim(),
        due_date: new Date(dueDate).toISOString(),
        priority,
        status,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to save assignment. Please try again.');
        setLoading(false);
        return;
      }

      setSuccessMessage(
        isEditing
          ? 'Assignment updated successfully!'
          : 'Assignment created successfully! Redirecting...'
      );

      setTimeout(() => {
        router.push('/assignments');
        router.refresh();
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Assignment Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Assignment Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Distributed Systems Lab 3, Calculus Midterm Prep"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
          required
        />
      </div>

      {/* Subject & Due Date Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Subject / Course <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. CS 301, Physics 102"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="dueDate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Deadline <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <button
                type="button"
                onClick={() => setQuickDeadline(1)}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium px-1 rounded hover:bg-indigo-50"
              >
                +1d
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(3)}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium px-1 rounded hover:bg-indigo-50"
              >
                +3d
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(7)}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium px-1 rounded hover:bg-indigo-50"
              >
                +1w
              </button>
            </div>
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Priority & Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Priority Level
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm transition-all"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm transition-all"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Description & Notes (Optional)
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Include grading rubric reminders, chapter numbers, partner names, or submission requirements..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Assignment'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
