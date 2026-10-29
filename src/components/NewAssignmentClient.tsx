'use client';

import React from 'react';
import { AssignmentForm } from '@/components/AssignmentForm';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { createAssignment } from '@/lib/assignments';
import { AssignmentFormData } from '@/types/database.types';
import { PlusCircle } from 'lucide-react';

export function NewAssignmentClient() {
  const { isConfigured } = getSupabaseEnv();

  const handleCreate = async (formData: AssignmentFormData) => {
    if (!isConfigured) {
      return {
        success: false,
        error:
          'Supabase is not configured yet. Add your project URL and anon key to .env.local, then run the SQL migration.',
      };
    }
    const supabase = createClient();
    const res = await createAssignment(supabase, formData);
    if (res.error) {
      return { success: false, error: res.error };
    }
    return { success: true };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <PlusCircle className="w-4 h-4" />
          New Coursework Entry
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Assignment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add an upcoming assignment, lab report, quiz, or project to keep your deadlines organized.
        </p>
      </div>

      <AssignmentForm onSubmit={handleCreate} isEditing={false} />
    </div>
  );
}

