export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'In Progress' | 'Completed';

export interface Assignment {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject: string;
  due_date: string;
  priority: Priority;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface AssignmentFormData {
  title: string;
  description?: string;
  subject: string;
  due_date: string;
  priority: Priority;
  status: Status;
}

export interface AssignmentFilters {
  search?: string;
  status?: Status | 'All';
  priority?: Priority | 'All';
  subject?: string | 'All';
  sortBy?: 'due_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  upcomingCount: number;
  completionRate: number; // percentage 0-100
}

export interface Database {
  public: {
    Tables: {
      assignments: {
        Row: Assignment;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          subject: string;
          due_date: string;
          priority: Priority;
          status?: Status;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          subject?: string;
          due_date?: string;
          priority?: Priority;
          status?: Status;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'assignments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
