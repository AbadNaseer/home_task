-- Replace these with a real user id to test locally if needed
-- You can run this after signing up a user; then copy their auth.users.id
-- and set the owner column accordingly.

-- Example seed using the currently authenticated user when run within
-- the SQL Editor is not possible directly. Instead, paste your UUID:
-- select auth.uid(); -- not available in SQL editor without context

-- Change this value before running:
-- \set user_id '00000000-0000-0000-0000-000000000000'

-- insert into public.tasks (title, status, owner) values
-- ('Read the docs', 'todo', :'user_id'),
-- ('Build minimal UI', 'doing', :'user_id'),
-- ('Ship MVP', 'done', :'user_id');

-- Alternatively, run these after replacing the owner UUIDs:
-- insert into public.tasks (title, status, owner) values
-- ('Read the docs', 'todo', 'REPLACE-WITH-USER-UUID'),
-- ('Build minimal UI', 'doing', 'REPLACE-WITH-USER-UUID'),
-- ('Ship MVP', 'done', 'REPLACE-WITH-USER-UUID');


