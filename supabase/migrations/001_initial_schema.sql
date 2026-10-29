-- AssignFlow Database Schema Migration
-- 001_initial_schema.sql

-- Enable pgcrypto / uuid extension
create extension if not exists "uuid-ossp";

-- Create assignments table
create table if not exists public.assignments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null check (char_length(trim(title)) > 0),
    description text,
    subject text not null check (char_length(trim(subject)) > 0),
    due_date timestamptz not null,
    priority text not null check (priority in ('Low', 'Medium', 'High')),
    status text not null default 'Pending' check (status in ('Pending', 'In Progress', 'Completed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Table and column comments
comment on table public.assignments is 'Academic assignments created and managed by students';
comment on column public.assignments.user_id is 'Owner of the assignment, references auth.users';
comment on column public.assignments.due_date is 'Deadline with timezone support';

-- Indexes for high-efficiency querying, filtering, and sorting
create index if not exists idx_assignments_user_id on public.assignments(user_id);
create index if not exists idx_assignments_user_status on public.assignments(user_id, status);
create index if not exists idx_assignments_user_priority on public.assignments(user_id, priority);
create index if not exists idx_assignments_user_due_date on public.assignments(user_id, due_date);
create index if not exists idx_assignments_user_created_at on public.assignments(user_id, created_at desc);

-- Function and trigger to automatically manage updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_assignments_updated_at on public.assignments;
create trigger set_assignments_updated_at
    before update on public.assignments
    for each row
    execute function public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.assignments enable row level security;

-- RLS Policy: Users can only read their own assignments
drop policy if exists "Users can view own assignments" on public.assignments;
create policy "Users can view own assignments"
    on public.assignments
    for select
    using (auth.uid() = user_id);

-- RLS Policy: Users can only insert assignments for themselves
drop policy if exists "Users can create own assignments" on public.assignments;
create policy "Users can create own assignments"
    on public.assignments
    for insert
    with check (auth.uid() = user_id);

-- RLS Policy: Users can only update their own assignments, and cannot change user_id ownership
drop policy if exists "Users can update own assignments" on public.assignments;
create policy "Users can update own assignments"
    on public.assignments
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- RLS Policy: Users can only delete their own assignments
drop policy if exists "Users can delete own assignments" on public.assignments;
create policy "Users can delete own assignments"
    on public.assignments
    for delete
    using (auth.uid() = user_id);

