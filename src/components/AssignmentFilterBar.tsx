'use client';

import React from 'react';
import { Priority, Status } from '@/types/database.types';
import { Search, X, ArrowUpDown } from 'lucide-react';

interface AssignmentFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: Status | 'All';
  onStatusChange: (status: Status | 'All') => void;
  priority: Priority | 'All';
  onPriorityChange: (priority: Priority | 'All') => void;
  subject: string;
  onSubjectChange: (subject: string) => void;
  subjectsList: string[];
  sortBy: 'due_date' | 'created_at';
  onSortByChange: (sort: 'due_date' | 'created_at') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

export function AssignmentFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  subject,
  onSubjectChange,
  subjectsList,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}: AssignmentFilterBarProps) {
  const hasActiveFilters =
    search.trim() !== '' ||
    status !== 'All' ||
    priority !== 'All' ||
    subject !== 'All' ||
    sortBy !== 'due_date' ||
    sortOrder !== 'asc';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5 mb-6">
      {/* Search Bar + Clear button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by assignment title or subject..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as Status | 'All')}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as Priority | 'All')}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Subjects</option>
            {subjectsList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Sort By
          </label>
          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'due_date' | 'created_at')}
              className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50 hover:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="due_date">Due Date</option>
              <option value="created_at">Date Created</option>
            </select>
            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              title={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

