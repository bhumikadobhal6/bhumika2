import { SupabaseClient } from '@supabase/supabase-js';
import { Assignment, AssignmentFilters, AssignmentFormData } from '@/types/database.types';

export async function getAssignments(
  supabase: SupabaseClient,
  filters?: AssignmentFilters
): Promise<{ data: Assignment[] | null; error: string | null }> {
  try {
    let query = supabase
      .from('assignments')
      .select('*');

    if (filters?.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }

    if (filters?.priority && filters.priority !== 'All') {
      query = query.eq('priority', filters.priority);
    }

    if (filters?.subject && filters.subject !== 'All') {
      query = query.eq('subject', filters.subject);
    }

    if (filters?.search && filters.search.trim().length > 0) {
      // Strip characters that have meaning inside a PostgREST `or` filter
      // so a stray comma or parenthesis cannot break the query.
      const term = filters.search
        .trim()
        .replace(/[,()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (term.length > 0) {
        query = query.or(`title.ilike.%${term}%,subject.ilike.%${term}%`);
      }
    }

    const sortColumn = filters?.sortBy || 'due_date';
    const isAsc = filters?.sortOrder ? filters.sortOrder === 'asc' : sortColumn === 'due_date';

    query = query.order(sortColumn, { ascending: isAsc });

    // Stable tie-breaker so equally-dated assignments keep a predictable order.
    if (sortColumn !== 'created_at') {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Assignment[], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch assignments';
    return { data: null, error: message };
  }
}

export async function getAssignmentById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Assignment | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Assignment, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch assignment details';
    return { data: null, error: message };
  }
}

export async function createAssignment(
  supabase: SupabaseClient,
  formData: AssignmentFormData
): Promise<{ data: Assignment | null; error: string | null }> {
  try {
    // Validate required fields
    if (!formData.title || !formData.title.trim()) {
      return { data: null, error: 'Assignment title is required' };
    }
    if (!formData.subject || !formData.subject.trim()) {
      return { data: null, error: 'Subject is required' };
    }
    if (!formData.due_date) {
      return { data: null, error: 'Due date is required' };
    }

    // Get current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, error: 'You must be logged in to create an assignment' };
    }

    const insertData = {
      user_id: user.id,
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      subject: formData.subject.trim(),
      due_date: new Date(formData.due_date).toISOString(),
      priority: formData.priority,
      status: formData.status || 'Pending',
    };

    const { data, error } = await supabase
      .from('assignments')
      .insert(insertData as unknown as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Assignment, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create assignment';
    return { data: null, error: message };
  }
}

export async function updateAssignment(
  supabase: SupabaseClient,
  id: string,
  formData: Partial<AssignmentFormData>
): Promise<{ data: Assignment | null; error: string | null }> {
  try {
    const updatePayload: Record<string, unknown> = {};

    if (formData.title !== undefined) {
      if (!formData.title.trim()) {
        return { data: null, error: 'Title cannot be empty' };
      }
      updatePayload.title = formData.title.trim();
    }

    if (formData.description !== undefined) {
      updatePayload.description = formData.description?.trim() || null;
    }

    if (formData.subject !== undefined) {
      if (!formData.subject.trim()) {
        return { data: null, error: 'Subject cannot be empty' };
      }
      updatePayload.subject = formData.subject.trim();
    }

    if (formData.due_date !== undefined) {
      updatePayload.due_date = new Date(formData.due_date).toISOString();
    }

    if (formData.priority !== undefined) {
      updatePayload.priority = formData.priority;
    }

    if (formData.status !== undefined) {
      updatePayload.status = formData.status;
    }

    const { data, error } = await supabase
      .from('assignments')
      .update(updatePayload as unknown as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Assignment, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update assignment';
    return { data: null, error: message };
  }
}

export async function deleteAssignment(
  supabase: SupabaseClient,
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete assignment';
    return { success: false, error: message };
  }
}
