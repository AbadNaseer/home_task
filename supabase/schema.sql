-- Tasks table and RLS policies
-- Add your table and RLS SQL here

-- Tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text check (status in ('todo', 'doing', 'done')) not null default 'todo',
  created_at timestamptz not null default now(),
  owner uuid references auth.users(id) not null
);

-- Enable Row Level Security
alter table tasks enable row level security;

-- Policy: Only allow users to access their own tasks
create policy "Users can view their own tasks" on tasks
  for select using (auth.uid() = owner);

create policy "Users can insert their own tasks" on tasks
  for insert with check (auth.uid() = owner);

create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = owner);

create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = owner);
