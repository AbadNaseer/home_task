-- Enable required extensions
create extension if not exists pgcrypto;

-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'todo' check (status in ('todo','doing','done')),
  created_at timestamptz not null default now(),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Policy: users can read only their own tasks
create policy if not exists "read_own_tasks"
  on public.tasks for select
  using (auth.uid() = owner);

-- Policy: users can insert their own tasks
create policy if not exists "insert_own_tasks"
  on public.tasks for insert
  with check (auth.uid() = owner);

-- Policy: users can update only their own tasks
create policy if not exists "update_own_tasks"
  on public.tasks for update
  using (auth.uid() = owner)
  with check (auth.uid() = owner);

-- Policy: users can delete only their own tasks
create policy if not exists "delete_own_tasks"
  on public.tasks for delete
  using (auth.uid() = owner);


