'use client';

import React from 'react';
import { Assignment, AssignmentFormData } from '@/types/database.types';
import { AssignmentForm } from '@/components/AssignmentForm';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { updateAssignment } from '@/lib/assignments';
import { Edit3 } from 'lucide-react';

interface EditAssignmentClientProps {
  assignment: Assignment;
}

export function EditAssignmentClient({ assignment }: EditAssignmentClientProps) {
  const { isConfigured } = getSupabaseEnv();

  const handleUpdate = async (formData: AssignmentFormData) => {
    if (!isConfigured) {
      return {
        success: false,
        error:
          'Supabase is not configured yet. Add your project URL and anon key to .env.local, then run the SQL migration.',
      };
    }
    const supabase = createClient();
    const res = await updateAssignment(supabase, assignment.id, formData);
    if (res.error) {
      return { success: false, error: res.error };
    }
    return { success: true };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <Edit3 className="w-4 h-4" />
          Update Coursework
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Assignment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Modify deadline dates, adjust urgency priority, change submission status, or add notes.
        </p>
      </div>

      <AssignmentForm
        initialData={assignment}
        onSubmit={handleUpdate}
        isEditing={true}
      />
    </div>
  );
}

